import { createInstance } from 'i18next';
import sr from './sr.json';
import en from './en.json';

// Jezik se određuje isključivo iz adrese (vidi langFromPath u stories/index.js): bez otkrivanja jezika pregledača.
// Po jedna instanca po jeziku, pa prelaz između jezika ne menja stanje u komponentama koje se već crtaju.
const make = (lng) => {
  const instance = createInstance();
  instance.init({
    lng,
    fallbackLng: 'sr',
    resources: { sr: { translation: sr }, en: { translation: en } },
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  return instance;
};

export const i18nByLang = { sr: make('sr'), en: make('en') };
