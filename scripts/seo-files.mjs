// sitemap.xml i robots.txt u dist/. lastmod iz git istorije fajla strane, samo ako istorija postoji (na Cloudflare-u može biti plitka).
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE_URL } from '../src/config.js';
import { absolute } from '../src/seo/routes.js';
import { findByPath } from '../src/stories/index.js';
import { root, routes } from './lib/seo-data.mjs';

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
};

// Bez git-a ili sa plitkim klonom (Cloudflare) datumi nisu pouzdani, pa lastmod izostaje.
const shallow = git(['rev-parse', '--is-shallow-repository']) !== 'false';

// Fajl čija izmena menja stranu (priča: njen JSON na tom jeziku; pravna: tekst na jeziku; početna: registar priča).
const sourceFor = (route) => {
  if (route.type === 'story') {
    const raw = findByPath(route.lang, route.path.split('/').pop());
    return `src/stories/${raw.slug}/${route.lang === 'en' ? 'story.en.json' : 'story.json'}`;
  }
  if (route.type === 'legal') return `src/i18n/legal/${route.lang}.js`;
  return 'src/stories/index.js';
};

export const lastmod = (route) => (shallow ? null : git(['log', '-1', '--format=%cI', '--', sourceFor(route)]) || null);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export const buildSitemap = () => {
  const urls = routes.map((r) => {
    const links = ['sr', 'en']
      .filter((l) => r.alternates[l])
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(absolute(r.alternates[l]))}"/>`);
    links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absolute(r.alternates.sr || r.path))}"/>`);
    const mod = lastmod(r);
    return `  <url>\n    <loc>${esc(absolute(r.path))}</loc>\n${mod ? `    <lastmod>${mod}</lastmod>\n` : ''}${links.join('\n')}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
};

export const buildRobots = () => `User-agent: *\nAllow: /\nDisallow: /dev/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

export const writeSeoFiles = (dist) => {
  writeFileSync(join(dist, 'sitemap.xml'), buildSitemap());
  writeFileSync(join(dist, 'robots.txt'), buildRobots());
};
