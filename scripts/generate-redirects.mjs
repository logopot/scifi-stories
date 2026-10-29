// Generiše public/_redirects iz registra priča (src/stories/index.js).
// Upotreba: npm run redirects
// Redosled pravila (Cloudflare Pages uzima prvo koje se poklopi): (a) opšta pravila, (b) adrese po jezicima za svaku priču
// koja ima en blok, (c) /en/ → /en. Nema rezervnog pravila /* → /index.html 200 (nepoznate adrese vraćaju 404).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { legalPages } from '../src/legalPages.js';
import { stories } from '../src/stories/index.js';

const here = dirname(fileURLToPath(import.meta.url));
export const REDIRECTS_FILE = join(here, '../public/_redirects');

export const buildRedirects = (list = stories) => {
  const lines = [
    '# Generisano: npm run redirects (ne menjaj ručno)',
    '/:slug/citaj  /:slug  301',
    '/en/:slug/citaj  /en/:slug  301',
  ];
  for (const s of list) {
    const sr = s.path?.sr || s.slug;
    const en = s.en?.path;
    if (!en || en === sr) continue; // priče bez engleske verzije nemaju pravila
    // adresa pogrešnog jezika vodi na ispravnu, i sa /citaj na kraju
    lines.push(`/en/${sr}  /en/${en}  301`);
    lines.push(`/en/${sr}/citaj  /en/${en}  301`);
    lines.push(`/${en}  /${sr}  301`);
    lines.push(`/${en}/citaj  /${sr}  301`);
  }
  // pravne stranice: adresa pogrešnog jezika vodi na ispravnu
  for (const p of legalPages) {
    lines.push(`/en/${p.path.sr}  /en/${p.path.en}  301`);
    lines.push(`/${p.path.en}  /${p.path.sr}  301`);
  }
  // Svaka javna strana je statički fajl u dist/ (scripts/prerender.mjs), pa nema SPA rezervnog pravila:
  // nepoznata adresa dobija 404.html sa statusom 404. /en/ (kosa crta na kraju) vodi na /en.
  lines.push('/en/  /en  301');
  return `${lines.join('\n')}\n`;
};

// Poredi bez razlike u krajevima redova (Windows/Git).
export const isRedirectsCurrent = () => {
  let current = '';
  try {
    current = readFileSync(REDIRECTS_FILE, 'utf8');
  } catch {
    return false;
  }
  return current.replace(/\r\n/g, '\n') === buildRedirects();
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeFileSync(REDIRECTS_FILE, buildRedirects());
  console.log('public/_redirects generisan.');
}
