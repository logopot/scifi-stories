// Posle vite build: slike za deljenje, statički HTML po strani, 404.html, sitemap.xml i robots.txt u dist/.
// Pokreće se iz `npm run build`; radi samo sa Node-om (bez pregledača).
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { buildOgImages } from './og-images.mjs';
import { prerender } from './prerender.mjs';
import { root } from './lib/seo-data.mjs';
import { writeSeoFiles } from './seo-files.mjs';

const dist = join(root, 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('postbuild: dist/index.html ne postoji; prvo pokreni vite build.');
  process.exit(1);
}
const og = await buildOgImages(dist);
const { files } = prerender(dist);
writeSeoFiles(dist);
console.log(`postbuild: ${files.length} strana + 404.html, ${og.length} slika za deljenje, sitemap.xml, robots.txt.`);
