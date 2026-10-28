import { css } from 'styled-components';
import literataLatin from '@fontsource-variable/literata/files/literata-latin-wght-normal.woff2';
import literataLatinExt from '@fontsource-variable/literata/files/literata-latin-ext-wght-normal.woff2';
import literataLatinItalic from '@fontsource-variable/literata/files/literata-latin-wght-italic.woff2';
import literataLatinExtItalic from '@fontsource-variable/literata/files/literata-latin-ext-wght-italic.woff2';
import grotesk from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2';
import groteskExt from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-ext-wght-normal.woff2';

// Fontovi se služe sa našeg domena (paketi @fontsource-variable, WOFF2): bez Google Fonts, pa se IP posetilaca ne šalje trećoj strani.
// Samo latin i latin-ext (č ć š ž đ i navodnici „ “ su u ova dva podskupa); preglednik učitava samo ono što stranica koristi.
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

const face = (family, style, weight, url, range) => `
  @font-face {
    font-family: '${family}';
    font-style: ${style};
    font-display: swap;
    font-weight: ${weight};
    src: url(${url}) format('woff2-variations');
    unicode-range: ${range};
  }`;

export const fontFaces = css`
  ${face('Literata Variable', 'normal', '200 900', literataLatin, LATIN)}
  ${face('Literata Variable', 'normal', '200 900', literataLatinExt, LATIN_EXT)}
  ${face('Literata Variable', 'italic', '200 900', literataLatinItalic, LATIN)}
  ${face('Literata Variable', 'italic', '200 900', literataLatinExtItalic, LATIN_EXT)}
  ${face('Space Grotesk Variable', 'normal', '300 700', grotesk, LATIN)}
  ${face('Space Grotesk Variable', 'normal', '300 700', groteskExt, LATIN_EXT)}
`;
