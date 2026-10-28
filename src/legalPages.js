// Registar pravnih stranica: javna adresa po jeziku (isti mehanizam kao path u registru priča, stories/index.js).
// Nakon izmene pokreni npm run redirects. Tekstovi su u src/i18n/legal/, linkovi u podnožju u src/i18n/*.json (legal.<key>).
export const legalPages = [
  { key: 'privacy', path: { sr: 'privatnost', en: 'privacy' } },
  { key: 'disclaimer', path: { sr: 'odricanje-odgovornosti', en: 'disclaimer' } },
];

export const findLegalByPath = (lang, path) => legalPages.find((p) => p.path[lang] === path) || null;
export const legalPath = (lang, page) => (lang === 'en' ? `/en/${page.path.en}` : `/${page.path.sr}`);
