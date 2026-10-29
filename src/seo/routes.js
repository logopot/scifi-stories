// Jedini izvor podataka o javnim stranama za SEO: koristi ga i aplikacija (useSeo) i build skripte (scripts/postbuild.mjs).
// Čisto JS (bez JSON importa), da radi i u Vite-u i u Node-u; tekstovi sajta (src/i18n/<jezik>.json) dolaze kao argument.
import { SITE_URL } from '../config.js';
import contentEn from '../i18n/legal/en.js';
import contentSr from '../i18n/legal/sr.js';
import { legalPages } from '../legalPages.js';
import { hasLang, homePath, localizeEntry, stories, storyPath } from '../stories/index.js';

export const LANGS = ['sr', 'en'];
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;
const LEGAL_CONTENT = { sr: contentSr, en: contentEn };

const fill = (text, values) => text.replace(/\{\{(\w+)\}\}/g, (_, k) => String(values[k]));

// Skraćuje na granici reči, sa tri tačke.
const clip = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, '').replace(/[\s,;:.–-]+$/, '');
  return `${cut}…`;
};

// „<Naslov> | <Naziv sajta>"; ako je duže od TITLE_MAX, skraćuje se naziv sajta na kraju (a bez mesta za njega ostaje samo naslov).
export const withSiteName = (title, siteName, max = TITLE_MAX) => {
  const full = `${title} | ${siteName}`;
  if (full.length <= max) return full;
  const room = max - title.length - 3;
  return room >= 8 ? `${title} | ${clip(siteName, room)}` : title;
};

// Opis priče: tagline + rečenica o formi; ako ne staje u DESCRIPTION_MAX, kraća rečenica o formi, pa skraćivanje.
export const storyDescription = (tagline, minutes, messages) => {
  const long = `${tagline} ${fill(messages.seo.form, { minutes })}`;
  if (long.length <= DESCRIPTION_MAX) return long;
  const short = `${tagline} ${fill(messages.seo.formShort, { minutes })}`;
  return clip(short, DESCRIPTION_MAX);
};

export const absolute = (path) => `${SITE_URL}${path === '/' ? '/' : path}`;
export const ogImagePath = (slug) => `/og/${slug || 'default'}.jpg`;

// messages: { sr, en } sadržaj src/i18n/sr.json i en.json. Vraća javne strane (home, story, legal) obe verzije jezika.
export const buildRoutes = (messages) => {
  const routes = [];
  const siteName = (lang) => messages[lang].site.name;
  const alt = (make) => Object.fromEntries(LANGS.map((l) => [l, make(l)]));

  for (const lang of LANGS) {
    const m = messages[lang];
    routes.push({
      lang,
      type: 'home',
      key: 'home',
      path: homePath(lang),
      title: m.seo.homeTitle,
      description: m.seo.homeDescription,
      h1: siteName(lang),
      image: ogImagePath(null),
      imageAlt: siteName(lang),
      alternates: alt(homePath),
    });
    for (const raw of stories) {
      if (raw.status === 'soon' || !hasLang(raw, lang)) continue;
      const entry = localizeEntry(raw, lang);
      routes.push({
        lang,
        type: 'story',
        key: raw.slug,
        path: storyPath(lang, raw),
        title: withSiteName(entry.title, siteName(lang)),
        description: storyDescription(entry.tagline, raw.minutes, m),
        h1: entry.title,
        image: ogImagePath(raw.slug),
        imageAlt: entry.coverAlt,
        alternates: alt((l) => (hasLang(raw, l) ? storyPath(l, raw) : null)),
        story: { name: entry.title, tagline: entry.tagline, genre: entry.genre, minutes: raw.minutes },
      });
    }
    for (const page of legalPages) {
      const c = LEGAL_CONTENT[lang][page.key];
      routes.push({
        lang,
        type: 'legal',
        key: page.key,
        path: `${lang === 'en' ? '/en/' : '/'}${page.path[lang]}`,
        title: withSiteName(c.title, siteName(lang)),
        description: c.description,
        h1: c.title,
        image: ogImagePath(null),
        imageAlt: siteName(lang),
        alternates: alt((l) => `${l === 'en' ? '/en/' : '/'}${page.path[l]}`),
      });
    }
  }
  return routes;
};

// Strana „ne postoji" (404, /dev/*): bez alternativa, noindex.
export const notFoundRoute = (lang, messages) => ({
  lang,
  type: 'notfound',
  key: '404',
  path: null,
  title: messages[lang].seo.notFoundTitle,
  description: messages[lang].seo.notFoundDescription,
  image: ogImagePath(null),
  imageAlt: messages[lang].site.name,
  alternates: {},
  noindex: true,
});

// Kanonski oblik adrese: bez završne kose crte (osim korena).
export const normalizePath = (pathname) => {
  const p = (pathname || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return p === '' ? '/' : p;
};

export const findRoute = (routes, pathname) => {
  const p = normalizePath(pathname);
  return routes.find((r) => r.path === p) || null;
};
