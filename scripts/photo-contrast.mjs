/**
 * Contrast where text meets photography.
 *
 * After the imagery pass there is exactly one such place left: the caption chip
 * on the hero photo. Everything else — hero copy, Om oss copy, the booking
 * block — sits on solid ivory or solid charcoal and is covered by
 * scripts/contrast.mjs.
 *
 * The chip is measured against the BRIGHTEST and DARKEST pixel it can cover, so
 * the result holds wherever the crop lands.
 */

import sharp from 'sharp';

const T = { surface: '#FCFAF5', ink: '#23201C', inkMuted: '#6A655B', line: '#E4DFD5' };

const hex = (h) => h.replace('#', '').match(/../g).map((v) => parseInt(v, 16));
const lin = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (px) => 0.2126 * lin(px[0]) + 0.7152 * lin(px[1]) + 0.0722 * lin(px[2]);
const ratio = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const mix = (color, alpha, base) =>
  hex(color).map((v, i) => Math.round(v * alpha + base[i] * (1 - alpha)));

/** The caption chip: bg-surface/95, bottom-left of the hero photo. */
const CHIP = { alpha: 0.95, zone: { x0: 0.0, x1: 0.6, y0: 0.86, y1: 1.0 } };

async function extremes(file, w, h, zone) {
  const { data, info } = await sharp(file)
    .resize(w, h, { fit: 'cover', position: 'centre' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  let darkest = [255, 255, 255];
  let brightest = [0, 0, 0];
  for (let py = Math.floor(zone.y0 * info.height); py < Math.ceil(zone.y1 * info.height); py++) {
    for (let px = Math.floor(zone.x0 * info.width); px < Math.ceil(zone.x1 * info.width); px++) {
      const i = (py * info.width + px) * info.channels;
      const p = [data[i], data[i + 1], data[i + 2]];
      if (lum(p) < lum(darkest)) darkest = p;
      if (lum(p) > lum(brightest)) brightest = p;
    }
  }
  return { darkest, brightest };
}

// Panel sizes the hero photo actually renders at: ~46vw on desktop, ~92vw on mobile.
const views = [
  { name: 'desktop (5:6-panel)', w: 620, h: 744 },
  { name: 'mobil (4:3-panel)', w: 358, h: 268 },
];

let failed = 0;
console.log('Kontrast där text möter foto — hero-bildens bildtext\n');

for (const v of views) {
  const { darkest, brightest } = await extremes('src/assets/hero.jpg', v.w, v.h, CHIP.zone);
  for (const [label, base] of [
    ['mörkaste pixeln', darkest],
    ['ljusaste pixeln', brightest],
  ]) {
    const bg = mix(T.surface, CHIP.alpha, base);
    const r = ratio(lum(hex(T.inkMuted)), lum(bg));
    const ok = r >= 4.5;
    if (!ok) failed++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1 (krav 4.5)  ${v.name.padEnd(20)} ` +
        `bildtext (ink-muted på surface/95) — ${label}`
    );
  }
}

console.log(
  failed
    ? `\n${failed} kontrastkrav underkända.`
    : '\nAlla kontrastkrav uppfyllda. Ingen annan text ligger på foto — se npm run contrast.'
);
process.exit(failed ? 1 : 0);
