// Tekst koji stoji preko slike (ploča scene na širokom ekranu, povratak na sajt gore): boje teksta dolaze iz
// onImage, jer je ispod njih tamna scrim boja čak i kad je tema svetla. Akcenat se osvetljava prema onImage.
// Tamne teme ostaju kakve jesu.
const toRgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Meša dve #hex boje: `share` je udeo prve (0–1).
export const mixHex = (a, b, share = 0.5) => {
  const [x, y] = [toRgb(a), toRgb(b)];
  return `#${x.map((v, i) => Math.round(v * share + y[i] * (1 - share)).toString(16).padStart(2, '0')).join('')}`;
};

export const ACCENT_SHARE = 0.4;

export const onImageTheme = (theme) => {
  if (theme.mode === 'dark') return theme;
  const accent = mixHex(theme.accent, theme.onImage, ACCENT_SHARE);
  return {
    ...theme,
    text: theme.onImage,
    textMuted: theme.onImage,
    textFaint: theme.onImage,
    accent,
    btnText: accent,
    btnBorder: accent,
    btnQuietText: theme.onImage,
    btnQuietBorder: `color-mix(in srgb, ${theme.onImage} 60%, transparent)`,
    btnDisabledBg: `color-mix(in srgb, ${theme.onImage} 14%, transparent)`,
    btnDisabledText: `color-mix(in srgb, ${theme.onImage} 65%, transparent)`,
    focusRing: accent,
    border: `color-mix(in srgb, ${theme.onImage} 24%, transparent)`,
  };
};
