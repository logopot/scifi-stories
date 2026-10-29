import sr from '../i18n/sr.json';
import en from '../i18n/en.json';
import { buildRoutes, findRoute, notFoundRoute } from './routes';

export const messages = { sr, en };
export const routes = buildRoutes(messages);

// Strana za adresu; nepoznata adresa (i /dev/*) dobija „ne postoji" sa noindex.
export const resolveRoute = (pathname, lang) => findRoute(routes, pathname) || notFoundRoute(lang, messages);
