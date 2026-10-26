// Provera popune linije napretka (src/engine/chapterProgress.js): nasumična putanja kroz prvo poglavlje jedne priče,
// ispis popune posle svake strane. Popuna mora strogo da raste i da ostane najviše 0.97 do kraja poglavlja.
// Upotreba: node scripts/check-progress.mjs <slug> [--seed N] [--gender f]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith('--') && Number.isNaN(Number(a))) || 'bez-opcije';
const gender = args.includes('f') || args.includes('--gender') ? 'f' : 'm';
let seed = Number(args[args.indexOf('--seed') + 1]) || 7;
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

const bundle = async (entry) => {
  const { build } = await import('esbuild');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-progress-'));
  const outfile = path.join(tmp, 'm.mjs');
  await build({ entryPoints: [path.join(root, entry)], bundle: true, format: 'esm', outfile, logLevel: 'error', platform: 'node' });
  return import(pathToFileURL(outfile).href);
};
const { createEngine } = await bundle('src/engine/engine.js');
const { createTracker, chapterIds, CAP } = await bundle('src/engine/chapterProgress.js');
const story = JSON.parse(fs.readFileSync(path.join(root, 'src/stories', slug, 'story.json'), 'utf8'));
const engine = createEngine(story, slug);
const player = { gender, name: '' };
const ids = chapterIds(story);
const tracker = createTracker();

let node = story.start;
const picks = [];
let chapter = null;
let prev = 0;
let errors = 0;
console.log(`${slug} (${gender}), poglavlja: ${ids.join(', ')}\n`);
console.log('čvor'.padEnd(14) + 'strana'.padEnd(9) + 'popuna');
for (let guard = 0; guard < 200; guard += 1) {
  const n = story.nodes[node];
  const pages = engine.buildPages(n, picks, player);
  chapter = n.chapter || chapter;
  if (chapter !== ids[0]) break; // samo prvo poglavlje
  for (let p = 0; p < pages.length; p += 1) {
    const r = tracker.update({ story, engine, slug, nodeId: node, picks, player, page: p, pagesCount: pages.length });
    const ok = r.value > prev && r.value <= CAP;
    if (!ok) errors += 1;
    console.log(node.padEnd(14) + `${p + 1}/${pages.length}`.padEnd(9) + r.value.toFixed(3) + (ok ? '' : '   <-- GREŠKA'));
    prev = r.value;
  }
  if (n.end) break;
  if (n.choices && n.choices.length) {
    const c = n.choices[Math.floor(rnd() * n.choices.length)];
    picks.push({ id: c.id, node, w: c.w || {}, hidden: false });
    node = c.next;
  } else {
    node = engine.resolveNext(n, picks);
  }
  if (!node) break;
}
console.log(errors ? `\nGREŠKE: ${errors} (popuna ne raste strogo ili je prešla ${CAP})` : '\nPopuna strogo raste i ostaje najviše 0.97.');
process.exit(errors ? 1 : 0);
