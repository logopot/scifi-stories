// Provera SEO-a nad dist/ (posle npm run build). Upotreba: npm run check-seo
// Za svaku javnu stranu: jedinstven naslov (do 65 znakova) i opis (70–160), apsolutan canonical, recipročan hreflang + x-default,
// postojeća og slika, validan JSON-LD, tačno jedan h1 u statičkom sadržaju, <html lang>, bez noindex. 404.html i /dev bez indeksiranja.
// Sitemap sadrži tačno javne strane (bez preusmerenja i 404), robots.txt upućuje na sitemap, a _redirects nema SPA rezervno pravilo.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../src/config.js';
import { absolute } from '../src/seo/routes.js';
import { fileForPath, root, routes } from './lib/seo-data.mjs';

const dist = join(root, 'dist');
const errors = [];
const err = (msg) => errors.push(msg);

if (!existsSync(join(dist, 'index.html'))) {
  console.error('check-seo: dist/ ne postoji; prvo pokreni npm run build.');
  process.exit(1);
}

const read = (rel) => readFileSync(join(dist, rel), 'utf8');
const decode = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const metaContent = (html, key, value) => {
  const m = html.match(new RegExp(`<meta[^>]*\\b${key}="${value}"[^>]*>`));
  const c = m && m[0].match(/\bcontent="([^"]*)"/);
  return c ? decode(c[1]) : null;
};
const links = (html, rel) =>
  [...html.matchAll(new RegExp(`<link[^>]*\\brel="${rel}"[^>]*>`, 'g'))].map((m) => ({
    href: decode((m[0].match(/\bhref="([^"]*)"/) || [])[1] || ''),
    hreflang: (m[0].match(/\bhreflang="([^"]*)"/) || [])[1],
  }));
const stripTags = (s) => s.replace(/<[^>]+>/g, '');

const titles = new Map();
const descriptions = new Map();
const pageHtml = new Map();

for (const r of routes) {
  const rel = fileForPath(r.path);
  const where = `${r.lang} ${r.path}`;
  if (!existsSync(join(dist, rel))) {
    err(`${where}: nema fajla dist/${rel}`);
    continue;
  }
  const html = read(rel);
  pageHtml.set(r.path, html);

  const lang = (html.match(/<html lang="([^"]*)"/) || [])[1];
  if (lang !== r.lang) err(`${where}: <html lang="${lang}"`);

  const title = decode(((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '').trim());
  if (!title) err(`${where}: nema <title>`);
  if (title.length > 65) err(`${where}: naslov ima ${title.length} znakova (najviše 65)`);
  if (titles.has(title)) err(`${where}: naslov "${title}" se ponavlja (${titles.get(title)})`);
  titles.set(title, where);
  if (title !== r.title) err(`${where}: naslov u HTML-u ne odgovara registru`);

  const desc = metaContent(html, 'name', 'description');
  if (!desc || desc.length < 70 || desc.length > 160) err(`${where}: opis ima ${desc ? desc.length : 0} znakova (70–160)`);
  if (desc && descriptions.has(desc)) err(`${where}: opis se ponavlja (${descriptions.get(desc)})`);
  if (desc) descriptions.set(desc, where);

  const robots = metaContent(html, 'name', 'robots') || '';
  if (/noindex/i.test(robots)) err(`${where}: strana ima noindex`);

  const canonical = links(html, 'canonical');
  if (canonical.length !== 1) err(`${where}: canonical oznaka ima ${canonical.length}, očekivana 1`);
  else if (canonical[0].href !== absolute(r.path)) err(`${where}: canonical ${canonical[0].href} nije ${absolute(r.path)}`);
  if (r.path !== '/' && canonical[0]?.href.endsWith('/')) err(`${where}: canonical ima završnu kosu crtu`);

  // hreflang: recipročan (svaka alternativa u svom HTML-u pokazuje nazad) + x-default
  const alts = links(html, 'alternate').filter((l) => l.hreflang);
  const byLang = Object.fromEntries(alts.map((a) => [a.hreflang, a.href]));
  if (!byLang['x-default']) err(`${where}: nema hreflang x-default`);
  if (byLang[r.lang] !== absolute(r.path)) err(`${where}: hreflang ${r.lang} ne pokazuje na samu stranu`);
  const other = r.lang === 'sr' ? 'en' : 'sr';
  if (r.alternates[other]) {
    if (byLang[other] !== absolute(r.alternates[other])) err(`${where}: hreflang ${other} ne pokazuje na ${r.alternates[other]}`);
    const twin = routes.find((x) => x.path === r.alternates[other]);
    if (!twin) err(`${where}: alternativa ${r.alternates[other]} nije javna strana`);
    else if (twin.alternates[r.lang] !== r.path) err(`${where}: hreflang nije recipročan sa ${twin.path}`);
  }

  // og slika
  const ogImage = metaContent(html, 'property', 'og:image');
  if (!ogImage || !ogImage.startsWith(`${SITE_URL}/og/`)) err(`${where}: og:image nije apsolutna adresa ${SITE_URL}/og/...`);
  else if (!existsSync(join(dist, ogImage.slice(SITE_URL.length)))) err(`${where}: og slika ${ogImage} ne postoji u dist/`);
  if (metaContent(html, 'property', 'og:url') !== absolute(r.path)) err(`${where}: og:url nije ${absolute(r.path)}`);
  if (metaContent(html, 'name', 'twitter:card') !== 'summary_large_image') err(`${where}: twitter:card nije summary_large_image`);

  // JSON-LD
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const expected = { home: 1, story: 2, legal: 1 }[r.type];
  if (ld.length !== expected) err(`${where}: JSON-LD blokova ${ld.length}, očekivano ${expected}`);
  for (const m of ld) {
    try {
      const data = JSON.parse(m[1]);
      if (data['@context'] !== 'https://schema.org' || !data['@type']) err(`${where}: JSON-LD bez @context/@type`);
    } catch (e) {
      err(`${where}: JSON-LD nije validan JSON (${e.message})`);
    }
  }

  // statički sadržaj: tačno jedan h1, unutar skrivenog bloka
  const root$ = (html.match(/<div id="root">([\s\S]*?)<\/body>/) || [])[1] || '';
  if (!root$.includes('class="seo-static"')) err(`${where}: #root nema statički sadržaj`);
  const h1s = [...root$.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
  if (h1s.length !== 1) err(`${where}: ${h1s.length} h1 elemenata u statičkom sadržaju (očekivan 1)`);
  else if (!stripTags(h1s[0][0]).trim()) err(`${where}: prazan h1`);
}

// 404.html
if (!existsSync(join(dist, '404.html'))) err('nema dist/404.html');
else {
  const html = read('404.html');
  if (!/noindex/i.test(metaContent(html, 'name', 'robots') || '')) err('404.html nema noindex');
  if (links(html, 'canonical').length) err('404.html ima canonical');
  if (![...html.matchAll(/<h1[\s>]/g)].length) err('404.html nema h1');
}

// sitemap.xml: tačno javne strane
if (!existsSync(join(dist, 'sitemap.xml'))) err('nema dist/sitemap.xml');
else {
  const xml = read('sitemap.xml');
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
  const want = routes.map((r) => absolute(r.path));
  for (const w of want) if (!locs.includes(w)) err(`sitemap: nedostaje ${w}`);
  for (const l of locs) if (!want.includes(l)) err(`sitemap: ${l} nije javna strana`);
  if (new Set(locs).size !== locs.length) err('sitemap: adrese se ponavljaju');
  const n = (xml.match(/<url>/g) || []).length;
  const x = (xml.match(/hreflang="x-default"/g) || []).length;
  if (x !== n) err(`sitemap: x-default ima ${x} od ${n} adresa`);
}

// robots.txt
if (!existsSync(join(dist, 'robots.txt'))) err('nema dist/robots.txt');
else {
  const txt = read('robots.txt');
  for (const line of ['User-agent: *', 'Allow: /', 'Disallow: /dev/', `Sitemap: ${SITE_URL}/sitemap.xml`]) {
    if (!txt.split(/\r?\n/).includes(line)) err(`robots.txt: nema reda "${line}"`);
  }
}

// _redirects: bez SPA rezervnog pravila, a odredišta su statičke javne strane
if (existsSync(join(dist, '_redirects'))) {
  const publicPaths = new Set(routes.map((r) => r.path));
  for (const raw of read('_redirects').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, status] = line.split(/\s+/);
    if (status === '200') err(`_redirects: pravilo sa statusom 200 (${line}); nepoznate adrese moraju da vraćaju 404`);
    if (from.includes(':') || from.includes('*') || to.includes(':')) continue; // opšta pravila
    if (!publicPaths.has(to)) err(`_redirects: odredište ${to} nije javna strana (${line})`);
    if (publicPaths.has(from)) err(`_redirects: ${from} je javna strana, a preusmerava se (${line})`);
  }
} else err('nema dist/_redirects');

if (errors.length) {
  console.error(errors.map((e) => `GREŠKA ${e}`).join('\n'));
  console.error(`\ncheck-seo: ${errors.length} grešaka.`);
  process.exit(1);
}
console.log(`check-seo: ${routes.length} javnih strana + 404.html u redu (naslovi, opisi, canonical, hreflang, og slike, JSON-LD, h1, sitemap, robots, _redirects).`);
