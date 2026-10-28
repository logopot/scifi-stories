// Naziv sajta za index.html (vite.config.js) (srpski je podrazumevani jezik; engleski naziv je u src/i18n/en.json). Tekstovi u aplikaciji dolaze iz src/i18n (site.name).
export const SITE_NAME = 'Priče drugog sveta';

// Podaci odgovorne osobe za stranice „Politika privatnosti“ i „Odricanje odgovornosti“ (src/pages/Legal).
// Vrednosti u uglastim zagradama treba popuniti pre objave; scripts/check-legal.mjs prekida Cloudflare build dok ih ima.
export const LEGAL = {
  operator: '[IME I PREZIME ILI NAZIV]',
  email: '[KONTAKT E-POŠTA]',
  country: 'Srbija',
  updated: '2026-10-28',
  year: 2026,
};
