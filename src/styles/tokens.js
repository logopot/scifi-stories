// Tokeni koji nisu boje. Spajaju se u theme objekat (vidi themes.js), pa komponente pišu
// ${({ theme }) => theme.space[150]}. Brojevi u ključevima su stotinke jedinice:
// space[150] = 1.5rem, fs[98] = 0.98rem, tracking[24] = 0.24em.
// Ako ti treba nova vrednost, dodaj je ovde, ne u .styled.js fajl.

export const space = {
  0: '0',
  10: '0.1rem',
  20: '0.2rem',
  30: '0.3rem',
  35: '0.35rem',
  40: '0.4rem',
  50: '0.5rem',
  60: '0.6rem',
  65: '0.65rem',
  70: '0.7rem',
  75: '0.75rem',
  80: '0.8rem',
  90: '0.9rem',
  100: '1rem',
  120: '1.2rem',
  135: '1.35rem',
  140: '1.4rem',
  150: '1.5rem',
  160: '1.6rem',
  180: '1.8rem',
  200: '2rem',
  240: '2.4rem',
  250: '2.5rem',
  300: '3rem',
  350: '3.5rem',
  400: '4rem',
  500: '5rem',
  600: '6rem',
};

export const fs = {
  68: '0.68rem',
  72: '0.72rem',
  74: '0.74rem',
  78: '0.78rem',
  80: '0.8rem',
  82: '0.82rem',
  85: '0.85rem',
  86: '0.86rem',
  90: '0.9rem',
  98: '0.98rem',
  102: '1.02rem',
  110: '1.1rem',
  120: '1.2rem',
  125: '1.25rem',
  150: '1.5rem',
  190: '1.9rem',
};

// letter-spacing u em
export const tracking = {
  4: '0.04em',
  20: '0.2em',
  22: '0.22em',
  24: '0.24em',
  28: '0.28em',
};

export const lineHeights = {
  tight: 1.1,
  heading: 1.2,
  text: 1.5,
  prose: 1.85,
};

export const radii = {
  none: '0',
  sm: '3px',
  md: '6px',
  lg: '10px',
};

export const sizes = {
  prose: '1.2rem',
  readWidth: '38rem',
  inputMax: '20rem',
  pageMinHeight: '62vh',
  screenMinHeight: '100vh',
  titleFluid: 'clamp(2.6rem, 8vw, 4.2rem)',
  portraitFluid: 'clamp(120px, 28%, 190px)',
  pageWidth: '46rem',
};

export const fonts = {
  serif: "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif",
  ui: "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif",
  menu: "'Cascadia Mono', 'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
};

export const transitions = {
  fast: '0.2s ease',
  base: '0.25s ease',
  theme: '0.45s ease',
  lift: '0.3s ease',
};

export const motion = {
  paragraph: '0.9s',
  option: '0.7s',
  figure: '1.2s',
  hint: '1.4s',
  sky: '0.8s',
};

export const zIndex = {
  sky: 0,
  page: 1,
  floating: 2,
};

export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

// Pozadina "Sky": veličine i položaji mrlja i zvezda (dekor, ne raspored sadržaja).
export const skyDecor = {
  blobA: { size: '46vmax', top: '-22vmax', left: '-12vmax', blur: '60px', duration: '40s' },
  blobB: { size: '30vmax', top: '-14vmax', right: '-8vmax', blur: '60px', duration: '55s' },
  fade: '68%',
  stars:
    '12% 18%, 27% 62%, 41% 9%, 53% 41%, 66% 77%, 78% 24%, 88% 55%, 93% 11%, 7% 84%, 35% 91%, 71% 5%, 60% 58%',
};

export const opacity = {
  disabled: 0.35,
  ghost: 0.7,
  muted: 0.7,
  soft: 0.8,
  dim: 0.72,
};

export const tokens = {
  space,
  fs,
  tracking,
  lineHeights,
  radii,
  sizes,
  fonts,
  transitions,
  motion,
  zIndex,
  breakpoints,
  skyDecor,
  opacity,
};
