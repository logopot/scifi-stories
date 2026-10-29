// Statički HTML po javnoj strani, bez pregledača: iz dist/index.html (posle vite build) pravi dist/<adresa>.html
// (/ → index.html, /tamni-sat → tamni-sat.html, /en → en.html, /en/dark-hour → en/dark-hour.html) i dist/404.html.
// U <head> ide tačan SEO (isti model kao useSeo), u #root vizuelno skriven tekst iste strane koji React pri montiranju zamenjuje.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LEGAL } from '../src/config.js';
import contentEn from '../src/i18n/legal/en.js';
import contentSr from '../src/i18n/legal/sr.js';
import { legalPages } from '../src/legalPages.js';
import { headModel, jsonLd } from '../src/seo/head.js';
import { findByPath, storiesFor, storyPath } from '../src/stories/index.js';
import { fileForPath, messages, notFound, root, routes } from './lib/seo-data.mjs';

const LEGAL_CONTENT = { sr: contentSr, en: contentEn };
export const HIDDEN_CLASS = 'seo-static';
const HIDDEN_CSS = `.${HIDDEN_CLASS}{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0}`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
const t = (lang, key) => key.split('.').reduce((o, k) => o[k], messages[lang]);

const formatDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));

// Isti tokeni kao u src/pages/Legal: {site}, {year} i [tekst](adresa).
const inline = (text, lang) =>
  esc(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label, href) => `<a href="${href}" rel="noopener noreferrer">${label}</a>`)
    .replace(/\{site\}/g, esc(t(lang, 'site.name')))
    .replace(/\{year\}/g, String(LEGAL.year));

const footer = (lang) => {
  const links = legalPages
    .map((p) => `<a href="${lang === 'en' ? '/en/' : '/'}${p.path[lang]}">${esc(t(lang, `legal.${p.key}`))}</a>`)
    .join(' ');
  return `<footer><p>${esc(t(lang, 'site.name'))} · ${esc(t(lang, 'site.footer'))}</p><nav aria-label="${esc(t(lang, 'legal.label'))}">${links}</nav></footer>`;
};

const homeBody = (route) => {
  const { lang } = route;
  const items = storiesFor(lang)
    .filter((e) => e.status !== 'soon')
    .map((e) => `<li><a href="${storyPath(lang, e)}"><strong>${esc(e.title)}</strong></a> ${esc(e.tagline)}</li>`)
    .join('');
  const list = items ? `<ul>${items}</ul>` : `<p>${esc(t(lang, 'landing.empty'))}</p>`;
  return `<h1>${esc(route.h1)}</h1><p>${esc(t(lang, 'landing.subtitle'))}</p>${list}${footer(lang)}`;
};

// Početni ekran priče prikazuje meta.title, meta.subtitle i ui.start.intro iz JSON-a priče na tom jeziku.
const storyBody = (route) => {
  const raw = findByPath(route.lang, route.path.split('/').pop());
  const file = route.lang === 'en' ? 'story.en.json' : 'story.json';
  const data = JSON.parse(readFileSync(join(root, 'src/stories', raw.slug, file), 'utf8'));
  const intro = (data.ui?.start?.intro || []).map((p) => `<p>${esc(p)}</p>`).join('');
  return `<h1>${esc(data.meta?.title || route.h1)}</h1><p>${esc(data.meta?.subtitle || '')}</p>${intro}`;
};

const legalBody = (route) => {
  const { lang } = route;
  const page = LEGAL_CONTENT[lang][route.key];
  const home = lang === 'en' ? '/en' : '/';
  const sections = page.sections
    .map((s) => {
      const blocks = s.blocks
        .map((b) => (b.ul ? `<ul>${b.ul.map((i) => `<li>${inline(i, lang)}</li>`).join('')}</ul>` : `<p>${inline(b.p, lang)}</p>`))
        .join('');
      return `<section><h2>${esc(s.h)}</h2>${blocks}</section>`;
    })
    .join('');
  const updated = t(lang, 'legal.updated').replace('{{date}}', formatDate(LEGAL.updated, lang));
  return `<p><a href="${home}">${esc(t(lang, 'site.allStories'))}</a></p><h1>${esc(page.title)}</h1><p>${esc(updated)}</p>${sections}${footer(lang)}`;
};

const notFoundBody = (lang) =>
  `<h1>${esc(t(lang, 'notFound.title'))}</h1><p>${esc(t(lang, 'notFound.text'))}</p><p><a href="${lang === 'en' ? '/en' : '/'}">${esc(t(lang, 'site.allStories'))}</a></p>${footer(lang)}`;

const BODY = { home: homeBody, story: storyBody, legal: legalBody };

// Skida opšte oznake iz šablona (naslov, opis, Open Graph, Twitter) i ubacuje oznake strane.
const render = (template, route, body) => {
  const { lang } = route;
  const siteName = t(lang, 'site.name');
  const model = headModel(route, siteName);
  const ld = route.noindex ? [] : jsonLd(route, siteName, t(lang, 'seo.breadcrumbHome'));
  const head = [
    `    <title>${esc(model.title)}</title>`,
    ...model.tags.map(({ tag, attrs: a }) => `    <${tag} ${attrs(a)} />`),
    ...ld.map((d) => `    <script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
    `    <style>${HIDDEN_CSS}</style>`,
  ].join('\n');
  const html = template
    .replace(/<html lang="[^"]*"/, `<html lang="${lang}"`)
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta (?:name="(?:description|robots)"|name="twitter:[^"]*"|property="og:[^"]*")[^>]*>/g, '')
    .replace('</head>', `${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><div class="${HIDDEN_CLASS}">${body}</div></div>`);
  if (!html.includes(`class="${HIDDEN_CLASS}"`)) throw new Error('prerender: <div id="root"> nije pronađen u dist/index.html');
  return html;
};

const write = (dist, rel, html) => {
  const target = join(dist, rel);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
};

export const prerender = (dist) => {
  const template = readFileSync(join(dist, 'index.html'), 'utf8');
  const files = [];
  for (const route of routes) {
    const rel = fileForPath(route.path);
    write(dist, rel, render(template, route, BODY[route.type](route)));
    files.push(rel);
  }
  write(dist, '404.html', render(template, notFound('sr'), notFoundBody('sr')));
  return { files, notFound: '404.html' };
};
