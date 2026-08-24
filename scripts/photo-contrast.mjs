/**
 * Contrast where text meets photography — the hero.
 *
 * For every pixel inside a text zone we evaluate the authored scrim gradients at
 * that exact position, composite them over the real photo pixel, and compute the
 * WCAG ratio. Reported per zone: the worst pixel, and the scrim alpha there.
 *
 * The layer definitions mirror Hero.astro. Change a stop there, change it here,
 * re-run. Zones come from scripts/hero-zones.json, measured in a real browser —
 * re-capture them if the hero layout changes.
 */

import sharp from 'sharp';
import zones from './hero-zones.json' with { type: 'json' };

const T = { paper: '#F5F2EC', surface: '#FCFAF5', ink: '#23201C', inkMuted: '#6A655B' };

const hex = (h) => h.replace('#', '').match(/../g).map((v) => parseInt(v, 16));
const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (px) => 0.2126 * lin(px[0]) + 0.7152 * lin(px[1]) + 0.0722 * lin(px[2]);
const ratio = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (color, alpha, base) =>
  hex(color).map((v, i) => Math.round(v * alpha + base[i] * (1 - alpha)));

/** Linear-gradient stops → alpha at position t (0–1 along the axis). */
const along = (stops, t) => {
  if (t <= stops[0][0]) return stops[0][1];
  const last = stops[stops.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < stops.length; i++) {
    const [x1, a1] = stops[i];
    const [x0, a0] = stops[i - 1];
    if (t <= x1) return a0 + ((t - x0) / (x1 - x0)) * (a1 - a0);
  }
  return last[1];
};

const toRight = (stops, color = T.paper) => ({ color, at: (x) => along(stops, x) });
const toBottom = (stops, color = T.paper) => ({ color, at: (_x, y) => along(stops, y) });
/** Band anchored to the bottom edge; `height` is the fraction it covers. */
const bottomBand = (height, stopsFromBottom, color = T.paper) => ({
  color,
  at: (_x, y) => (y < 1 - height ? 0 : along(stopsFromBottom, (1 - y) / height)),
});
const flatFrom = (yStart, alpha, color = T.paper) => ({
  color,
  at: (_x, y) => (y >= yStart ? alpha : 0),
});

// --- mirrors Hero.astro ------------------------------------------------------
const desktopLayers = [
  toRight([[0, 0.94], [0.32, 0.9], [0.46, 0.7], [0.6, 0.24], [0.7, 0]]),
  bottomBand(0.34, [[0, 0.92], [0.55, 0.88], [0.85, 0.35], [1, 0]]),
];
const mobileLayers = [
  toBottom([[0.13, 0], [0.19, 0.88]]),
  flatFrom(0.19, 0.88),
];
// -----------------------------------------------------------------------------

const applyLayers = (layers, px, x, y) =>
  layers.reduce((base, layer) => {
    const a = layer.at(x, y);
    return a > 0 ? mix(layer.color, a, base) : base;
  }, px);

/** Mirrors CSS object-fit: cover with object-position: 52% 8% (see Hero.astro). */
async function pixels(file, width, height) {
  const meta = await sharp(file).metadata();
  const scale = Math.max(width / meta.width, height / meta.height);
  const scaledW = Math.round(meta.width * scale);
  const scaledH = Math.round(meta.height * scale);
  const left = Math.round((scaledW - width) * 0.52);
  const top = Math.round((scaledH - height) * 0.08);

  const { data, info } = await sharp(file)
    .resize(scaledW, scaledH)
    .extract({ left, top, width, height })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function worstInZone({ data, info }, zone, layers, color) {
  const fg = lum(hex(color));
  let worst = Infinity;
  let alphaAtWorst = 0;
  for (let py = Math.floor(zone.y0 * info.height); py < Math.ceil(zone.y1 * info.height); py += 2) {
    for (let px = Math.floor(zone.x0 * info.width); px < Math.ceil(zone.x1 * info.width); px += 2) {
      const i = (py * info.width + px) * info.channels;
      const x = px / info.width;
      const y = py / info.height;
      const bg = applyLayers(layers, [data[i], data[i + 1], data[i + 2]], x, y);
      const r = ratio(fg, lum(bg));
      if (r < worst) {
        worst = r;
        alphaAtWorst = layers.reduce((acc, l) => 1 - (1 - acc) * (1 - l.at(x, y)), 0);
      }
    }
  }
  return { ratio: worst, alpha: alphaAtWorst };
}

const views = [
  { name: 'desktop 1440×900', w: 1440, h: 900, key: 'desktop', layers: desktopLayers },
  { name: 'mobil 390×844', w: 390, h: 844, key: 'mobile', layers: mobileLayers },
];

let failed = 0;
console.log('Hero — kontrast mot det riktiga fotot, sämsta pixeln per textzon\n');

for (const v of views) {
  const img = await pixels('src/assets/hero.jpg', v.w, v.h);
  for (const zone of zones[v.key]) {
    const min = zone.label === 'rail' ? 3.0 : 4.5;
    const { ratio: r, alpha } = worstInZone(img, zone, v.layers, T.ink);
    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1 (krav ${min})  ` +
        `${v.name.padEnd(16)} ${zone.label.padEnd(14)} scrim ${alpha.toFixed(2)}`
    );
  }
}

console.log(
  failed
    ? `\n${failed} kontrastkrav underkända.`
    : '\nAlla kontrastkrav uppfyllda. Övriga ytor mäts i npm run contrast.'
);
process.exit(failed ? 1 : 0);
