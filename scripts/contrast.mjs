/**
 * Run: npm run contrast
 *
 * against the WORST case: the ivory veil composited over a pure black photo.
 */

const tokens = {
  paper: '#F5F2EC',
  surface: '#FCFAF5',
  ink: '#23201C',
  inkMuted: '#6A655B',
  accent: '#7E8B70',
  accentDeep: '#656F5A',
  accentSoft: '#E9EDE3',
  line: '#E4DFD5',
  tint: '#F0F0E8',
};

const hex = (h) => h.replace('#', '').match(/../g).map((v) => parseInt(v, 16));
const lin = (c) => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const lum = (h) => { const [r, g, b] = hex(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
const over = (fg, bg, alpha) =>
  '#' + hex(fg).map((v, i) => Math.round(v * alpha + hex(bg)[i] * (1 - alpha)).toString(16).padStart(2, '0')).join('');


const checks = [
  // --- sektionstoner (rytmen) ---
  ['ink → paper', tokens.ink, tokens.paper, 4.5, 'brödtext, rubriker'],
  ['ink → tint (sage-ton)', tokens.ink, tokens.tint, 4.5, 'brödtext, rubriker'],
  ['ink-muted → tint (sage-ton)', tokens.inkMuted, tokens.tint, 4.5, 'sekundär text'],
  ['accent-deep → tint (sage-ton)', tokens.accentDeep, tokens.tint, 4.5, 'eyebrow'],
  ['surface-kort → tint (ytkontrast)', tokens.surface, tokens.tint, 1.05, 'kort mot bakgrund'],
  ['surface-kort → paper (ytkontrast)', tokens.surface, tokens.paper, 1.05, 'kort mot bakgrund'],
  ['ink → surface', tokens.ink, tokens.surface, 4.5, 'text på kort'],
  ['ink-muted → paper', tokens.inkMuted, tokens.paper, 4.5, 'sekundär text'],
  ['ink-muted → surface', tokens.inkMuted, tokens.surface, 4.5, 'sekundär text på kort'],
  ['surface → ink', tokens.surface, tokens.ink, 4.5, 'primär CTA (charcoal, vit text)'],
  ['accent-deep → paper', tokens.accentDeep, tokens.paper, 4.5, 'eyebrow på solid bakgrund'],
  ['ink → accent-soft', tokens.ink, tokens.accentSoft, 4.5, 'FillIn-chip'],
  ['accent → paper', tokens.accent, tokens.paper, 3.0, 'hårlinjer/ikoner — ej text'],

  // --- charcoal booking block ---
  ['surface → ink (rubrik/länkar)', tokens.surface, tokens.ink, 4.5, 'bokningssektionen'],
  ['surface 85% → ink (fotnot)', over(tokens.surface, tokens.ink, 0.85), tokens.ink, 4.5, 'bokningssektionen'],
  ['surface 70% → ink (etikett)', over(tokens.surface, tokens.ink, 0.7), tokens.ink, 4.5, 'bokningssektionen'],
];

let failed = 0;
console.log('Kontrast — WCAG 2.1 (svart foto = värsta fall bakom hero-slöjan)\n');
for (const [label, fg, bg, min, note] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (krav ${min})  ${label.padEnd(46)} ${note}`);
}
console.log(failed ? `\n${failed} kontrastkrav underkända.` : '\nAlla kontrastkrav uppfyllda.');
process.exit(failed ? 1 : 0);
