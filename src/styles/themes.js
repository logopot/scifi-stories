// Sve boje sajta žive ovde i samo ovde. Svaka tema ima ISTI skup tokena (vidi README).
// Nova priča = nova tema u `themes` (ključ je slug priče). Brisanje teme = brisanje reda.
import { fonts, tokens } from './tokens.js';

// Tema sveta Tandem: večni dan, dva sunca (ćilibarsko i plavkasto-belo), dve senke.
// Ovo je tačan izgled "Bez opcije" pre uvođenja tema; ne menjati.
export const bezOpcije = {
  name: 'bez-opcije',
  mode: 'light',
  sky: 'twin-suns',
  bg: '#f4ecd9',
  bgSoft: '#eadfc4',
  surface: '#faf4e6',
  text: '#2b2219',
  textMuted: '#5a4c3b',
  textFaint: '#8d7e69',
  accent: '#d9892b',
  accentContrast: '#2b2219',
  secondary: '#4f7ea6',
  secondarySoft: 'rgba(79, 126, 166, 0.35)',
  glowA: 'rgba(236, 160, 60, 0.55)',
  glowB: 'rgba(130, 175, 215, 0.55)',
  border: 'rgba(43, 34, 25, 0.18)',
  selection: 'rgba(217, 137, 43, 0.35)',
  focusRing: '#4f7ea6',
  shadow: 'rgba(60, 40, 20, 0.5)',
  fontBody: fonts.serif,
  fontHeading: fonts.serif,
};

// Neutralna tema za početnu stranu i stranicu "nema takve priče".
export const siteTheme = {
  name: 'site',
  mode: 'light',
  sky: 'twin-suns',
  bg: '#f2efe8',
  bgSoft: '#e6e2d8',
  surface: '#fbfaf6',
  text: '#22262b',
  textMuted: '#51565e',
  textFaint: '#7a7f87',
  accent: '#46607e',
  accentContrast: '#ffffff',
  secondary: '#8a6f4a',
  secondarySoft: 'rgba(138, 111, 74, 0.3)',
  glowA: 'rgba(120, 150, 190, 0.45)',
  glowB: 'rgba(220, 180, 120, 0.4)',
  border: 'rgba(34, 38, 43, 0.18)',
  selection: 'rgba(70, 96, 126, 0.3)',
  focusRing: '#46607e',
  shadow: 'rgba(34, 38, 43, 0.4)',
  fontBody: fonts.serif,
  fontHeading: fonts.serif,
};

// Rezervisano mesto za buduću priču: tamna tema, zvezdano nebo.
export const tihiSat = {
  name: 'tihi-sat',
  mode: 'dark',
  sky: 'stars',
  bg: '#0f1420',
  bgSoft: '#172034',
  surface: '#1a2236',
  text: '#e6e9f0',
  textMuted: '#aab3c5',
  textFaint: '#8590a6',
  accent: '#7fb4e8',
  accentContrast: '#0f1420',
  secondary: '#c4a3f5',
  secondarySoft: 'rgba(196, 163, 245, 0.3)',
  glowA: 'rgba(80, 110, 220, 0.35)',
  glowB: 'rgba(160, 110, 230, 0.28)',
  border: 'rgba(230, 233, 240, 0.2)',
  selection: 'rgba(127, 180, 232, 0.35)',
  focusRing: '#7fb4e8',
  shadow: 'rgba(0, 0, 0, 0.6)',
  fontBody: fonts.serif,
  fontHeading: fonts.ui,
};

// Rezervisano mesto za buduću priču: svetla zelenkasta tema.
export const zelenaGranica = {
  name: 'zelena-granica',
  mode: 'light',
  sky: 'twin-suns',
  bg: '#e8f0e4',
  bgSoft: '#d6e5d1',
  surface: '#f4f9f1',
  text: '#1b2a21',
  textMuted: '#40554a',
  textFaint: '#60756a',
  accent: '#2d7556',
  accentContrast: '#ffffff',
  secondary: '#b2742b',
  secondarySoft: 'rgba(178, 116, 43, 0.3)',
  glowA: 'rgba(90, 190, 140, 0.45)',
  glowB: 'rgba(240, 200, 110, 0.5)',
  border: 'rgba(27, 42, 33, 0.2)',
  selection: 'rgba(45, 117, 86, 0.3)',
  focusRing: '#2d7556',
  shadow: 'rgba(27, 42, 33, 0.4)',
  fontBody: fonts.serif,
  fontHeading: fonts.serif,
};

// slug priče -> tema
export const themes = {
  'bez-opcije': bezOpcije,
  'tihi-sat': tihiSat,
  'zelena-granica': zelenaGranica,
};

export const hasTheme = (slug) => Object.prototype.hasOwnProperty.call(themes, slug);

// Tema spremna za ThemeProvider: boje + tokeni. Nepoznat slug daje neutralnu temu sajta.
export const getTheme = (slug) => ({ ...tokens, ...(hasTheme(slug) ? themes[slug] : siteTheme) });
