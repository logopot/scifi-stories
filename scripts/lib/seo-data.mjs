// Podaci za SEO build skripte: iste javne strane kao u aplikaciji (src/seo/routes.js), sa tekstovima iz src/i18n/*.json.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRoutes, notFoundRoute } from '../../src/seo/routes.js';

export const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (rel) => JSON.parse(readFileSync(join(root, rel), 'utf8'));

export const messages = { sr: readJson('src/i18n/sr.json'), en: readJson('src/i18n/en.json') };
export const routes = buildRoutes(messages);
export const notFound = (lang) => notFoundRoute(lang, messages);

// Putanja fajla u dist/ za adresu: /tamni-sat → tamni-sat.html, /en/dark-hour → en/dark-hour.html, / → index.html.
// (Pages služi fajl.html na adresi bez ekstenzije i bez završne kose crte, što odgovara kanonskom obliku.)
export const fileForPath = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);
