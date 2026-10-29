// Oznake u <head> za jednu stranu, kao podaci: isti model koristi useSeo (u pregledaču) i scripts/prerender.mjs (pri buildu).
import { SITE_URL } from '../config.js';
import { absolute } from './routes.js';

const LOCALE = { sr: 'sr_RS', en: 'en_US' };
export const OG_SIZE = { width: 1200, height: 630 };

const isoMinutes = (minutes) => (minutes ? `PT${minutes}M` : null);

// Strukturirani podaci (JSON-LD); samo ono što je stvarno na strani i u registru.
export const jsonLd = (route, siteName, homeName) => {
  const url = absolute(route.path);
  const publisher = { '@type': 'Organization', name: siteName, url: SITE_URL };
  if (route.type === 'home') {
    return [{ '@context': 'https://schema.org', '@type': 'WebSite', name: siteName, url, inLanguage: route.lang }];
  }
  if (route.type === 'story') {
    const home = absolute(route.lang === 'en' ? '/en' : '/');
    const work = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: route.story.name,
      description: route.story.tagline,
      inLanguage: route.lang,
      genre: 'Science fiction',
      image: absolute(route.image),
      url,
      isAccessibleForFree: true,
      publisher,
      author: publisher,
    };
    const time = isoMinutes(route.story.minutes);
    if (time) work.timeRequired = time;
    const crumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: homeName, item: home },
        { '@type': 'ListItem', position: 2, name: route.story.name, item: url },
      ],
    };
    return [work, crumbs];
  }
  if (route.type === 'legal') {
    return [{ '@context': 'https://schema.org', '@type': 'WebPage', name: route.h1, url, inLanguage: route.lang }];
  }
  return [];
};

// Model <head>-a: { title, tags: [{ tag: 'meta'|'link', attrs }], jsonLd: [objekti] }. Redosled je stabilan.
export const headModel = (route, siteName) => {
  const { lang } = route;
  const other = lang === 'en' ? 'sr' : 'en';
  const tags = [];
  const meta = (attrs) => tags.push({ tag: 'meta', attrs });
  const link = (attrs) => tags.push({ tag: 'link', attrs });
  const image = absolute(route.image);

  meta({ name: 'description', content: route.description });
  meta({ name: 'robots', content: route.noindex ? 'noindex, nofollow' : 'index, follow' });
  if (!route.noindex) {
    link({ rel: 'canonical', href: absolute(route.path) });
    for (const l of ['sr', 'en']) {
      if (route.alternates[l]) link({ rel: 'alternate', hreflang: l, href: absolute(route.alternates[l]) });
    }
    // x-default: srpska verzija iste strane (ako je nema, sama strana)
    link({ rel: 'alternate', hreflang: 'x-default', href: absolute(route.alternates.sr || route.path) });
  }
  meta({ property: 'og:type', content: 'website' });
  meta({ property: 'og:site_name', content: siteName });
  meta({ property: 'og:title', content: route.title });
  meta({ property: 'og:description', content: route.description });
  if (!route.noindex) meta({ property: 'og:url', content: absolute(route.path) });
  meta({ property: 'og:image', content: image });
  meta({ property: 'og:image:width', content: String(OG_SIZE.width) });
  meta({ property: 'og:image:height', content: String(OG_SIZE.height) });
  meta({ property: 'og:image:alt', content: route.imageAlt });
  meta({ property: 'og:locale', content: LOCALE[lang] });
  if (!route.noindex && route.alternates[other]) meta({ property: 'og:locale:alternate', content: LOCALE[other] });
  meta({ name: 'twitter:card', content: 'summary_large_image' });
  meta({ name: 'twitter:title', content: route.title });
  meta({ name: 'twitter:description', content: route.description });
  meta({ name: 'twitter:image', content: image });
  meta({ name: 'twitter:image:alt', content: route.imageAlt });
  return { title: route.title, tags };
};

// Selektor svih oznaka kojima upravlja SEO (da nijedna iz prethodne strane ne ostane).
export const MANAGED_SELECTOR = [
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name^="twitter:"]',
  'meta[property^="og:"]',
  'link[rel="canonical"]',
  'link[rel="alternate"][hreflang]',
  'script[type="application/ld+json"]',
].join(',');
