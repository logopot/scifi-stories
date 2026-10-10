// Provera tema: isti skup tokena u svakoj temi i WCAG kontrast čitljivih parova boja.
import { siteTheme, themes } from '../src/styles/themes.js';

export const REQUIRED = [
  'name', 'mode', 'sky', 'bg', 'bgSoft', 'surface', 'text', 'textMuted', 'textFaint', 'accent', 'accentStrong', 'onAccent',
  'secondary', 'secondarySoft', 'glowA', 'glowB', 'border', 'selection', 'focusRing', 'shadow', 'logoBackdrop', 'btnBg', 'btnText', 'btnBorder', 'btnBgHover', 'btnTextHover', 'btnBorderHover', 'btnBgActive',
  'btnQuietText', 'btnQuietBorder', 'btnQuietBgHover', 'btnQuietTextHover', 'choiceBg', 'choiceBorder', 'choiceBgSelected',
  'choiceTextSelected', 'choiceDot', 'btnDisabledBg', 'btnDisabledText', 'fontBody', 'fontHeading',
];
const SKIES = ['twin-suns', 'stars', 'plain'];
const MODES = ['light', 'dark'];

// Parovi koji moraju da prođu. Tekst: 4.5; veliki tekst i kontrole: 3.
const PAIRS = [
  ['text', 'bg', 4.5],
  ['textMuted', 'bg', 4.5],
  ['onAccent', 'accentStrong', 4.5],
  ['btnText', 'bg', 4.5],
  ['text', 'surface', 4.5],
  ['btnTextHover', 'btnBgHover', 4.5],
  ['btnQuietTextHover', 'btnQuietBgHover', 4.5],
  ['choiceTextSelected', 'choiceBgSelected', 4.5],
  ['btnBorder', 'bg', 3],
  ['focusRing', 'bg', 3],
];
// Samo upozorenje: sitni dekorativni tekst (broj strane, oznake).
const SOFT_PAIRS = [['textFaint', 'bg', 3]];

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lin = (v) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const errors = [];
const all = { site: siteTheme, ...themes };

for (const [key, t] of Object.entries(all)) {
  const missing = REQUIRED.filter((k) => !(k in t));
  const extra = Object.keys(t).filter((k) => !REQUIRED.includes(k));
  if (missing.length) errors.push(`tema "${key}": nedostaju tokeni: ${missing.join(', ')}`);
  if (extra.length) errors.push(`tema "${key}": nepoznati tokeni: ${extra.join(', ')} (dodaj ih u REQUIRED i README, i u SVE teme)`);
  if (!SKIES.includes(t.sky)) errors.push(`tema "${key}": sky mora biti ${SKIES.join(' | ')}`);
  if (!MODES.includes(t.mode)) errors.push(`tema "${key}": mode mora biti ${MODES.join(' | ')}`);

  for (const [fg, bg, min] of PAIRS) {
    if (!/^#[0-9a-f]{3,6}$/i.test(t[fg] || '') || !/^#[0-9a-f]{3,6}$/i.test(t[bg] || '')) {
      errors.push(`tema "${key}": ${fg} i ${bg} moraju biti #hex boje da bi se kontrast proverio`);
      continue;
    }
    const c = contrast(t[fg], t[bg]);
    const ok = c >= min;
    console.log(`${ok ? 'ok  ' : 'LOŠE'} ${key.padEnd(15)} ${fg}/${bg}: ${c.toFixed(2)} (min ${min})`);
    if (!ok) errors.push(`tema "${key}": kontrast ${fg}/${bg} je ${c.toFixed(2)}, a mora biti bar ${min}`);
  }
  for (const [fg, bg, min] of SOFT_PAIRS) {
    const c = contrast(t[fg], t[bg]);
    if (c < min) console.warn(`UPOZORENJE: tema "${key}": ${fg}/${bg} je ${c.toFixed(2)} (preporuka ${min}+)`);
  }
}

if (errors.length) {
  console.error(`\nGREŠKE u temama (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nTeme: ${Object.keys(all).length} proverene, sve prošle.`);
