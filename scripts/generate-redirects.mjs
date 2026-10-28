// Generiše public/_redirects iz registra priča (src/stories/index.js).
// Upotreba: npm run redirects
// Redosled pravila (Cloudflare Pages uzima prvo koje se poklopi): (a) opšta pravila, (b) adrese po jezicima za svaku priču
// koja ima en blok, (c) SPA rezervno pravilo.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
  lines.push('/*  /index.html  200');
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
