// Provera priče: reference, dostižnost, jedinstveni id-evi, raspodela krajeva i procena vremena čitanja.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const story = JSON.parse(readFileSync(join(here, '../src/data/story.json'), 'utf8'));
const { nodes } = story;
const AXES = ['b', 's', 'u'];
const errors = [];
const err = (m) => errors.push(m);

// --- strukturne provere ---
const images = story.images || {};
for (const [k, im] of Object.entries(images)) {
  if (!im.src) err(`slika ${k}: nema src`);
  else if (!existsSync(join(here, '../public', im.src))) console.warn(`UPOZORENJE: nedostaje fajl public/${im.src} (slika "${k}")`);
}
for (const [id, n] of Object.entries(nodes)) {
  if (n.img && !images[n.img]) err(`${id}: nepoznata slika ${n.img}`);
  (n.paragraphs || []).forEach((p, i) => { if (p.img && !images[p.img]) err(`${id}[${i}]: nepoznata slika ${p.img}`); });
}
const choiceIds = new Set();
const hasOut = (n) => (n.choices && n.choices.length) || n.next || n.branch || n.end;
if (!nodes[story.start]) err(`start ${story.start} ne postoji`);
for (const [id, n] of Object.entries(nodes)) {
  if (!Array.isArray(n.paragraphs) || !n.paragraphs.length) err(`${id}: nema pasuse`);
  (n.paragraphs || []).forEach((p, i) => { if (typeof p !== 'object' || !p.t) err(`${id}[${i}]: pasus mora biti { t, lead?, if? }`); });
  if (!hasOut(n)) err(`${id}: nema izlaza`);
  const targets = [];
  (n.choices || []).forEach((c) => {
    if (choiceIds.has(c.id)) err(`${id}: duplikat id izbora ${c.id}`);
    choiceIds.add(c.id);
    targets.push(c.next);
  });
  if (n.hidden) {
    if (choiceIds.has(n.hidden.id)) err(`${id}: duplikat id skrivene opcije ${n.hidden.id}`);
    choiceIds.add(n.hidden.id);
    targets.push(n.hidden.next);
  }
  if (n.next) targets.push(n.next);
  (n.branch || []).forEach((b) => targets.push(b.next));
  targets.forEach((t) => { if (!nodes[t]) err(`${id}: vodi u nepostojeće "${t}"`); });
  if (n.choices && n.choices.length && !n.prompt) err(`${id}: scena sa izborima nema "prompt" rečenicu`);
  if (n.choices && n.choices.some((c) => c.rec) || n.offerRec) err(`${id}: ostalo "rec"/"offerRec" (preporuke su uklonjene)`);
  if (n.end && !story.endings[n.end]) err(`${id}: kraj "${n.end}" nije definisan`);
  if (n.chapter && !story.chapters[n.chapter]) err(`${id}: poglavlje "${n.chapter}" ne postoji`);
}

// --- uslovi pasusa moraju da pominju postojeće id-eve ---
for (const [id, n] of Object.entries(nodes)) {
  const conds = [...(n.paragraphs || []).map((p) => p.if), ...(n.branch || []).map((b) => b.if)];
  conds.filter(Boolean).forEach((c) => {
    [c.pick, c.notPick, ...(c.any || [])].filter(Boolean).forEach((cid) => {
      if (!choiceIds.has(cid)) err(`${id}: uslov pominje nepostojeći izbor "${cid}"`);
    });
  });
}

// --- dostižnost ---
const seen = new Set();
const stack = [story.start];
while (stack.length) {
  const id = stack.pop();
  if (seen.has(id) || !nodes[id]) continue;
  seen.add(id);
  const n = nodes[id];
  (n.choices || []).forEach((c) => stack.push(c.next));
  if (n.hidden) stack.push(n.hidden.next);
  if (n.next) stack.push(n.next);
  (n.branch || []).forEach((b) => stack.push(b.next));
}
Object.keys(nodes).forEach((id) => { if (!seen.has(id)) err(`${id}: nedostižna scena`); });

// --- simulacija (isti algoritam kao u engine.js) ---
const totals = (picks) => {
  const t = { b: 0, s: 0, u: 0 };
  picks.forEach((p) => AXES.forEach((a) => { t[a] += (p.w && p.w[a]) || 0; }));
  return t;
};
const leadAxis = (picks) => {
  const t = totals(picks);
  const max = Math.max(...AXES.map((a) => t[a]));
  let cands = AXES.filter((a) => t[a] === max);
  for (let i = picks.length - 1; i >= 0 && cands.length > 1; i -= 1) {
    const w = picks[i].w || {};
    const best = Math.max(...cands.map((a) => w[a] || 0));
    if (best > 0) cands = cands.filter((a) => (w[a] || 0) === best);
  }
  return cands[0];
};
const matches = (c, picks) => {
  if (!c) return true;
  const ids = picks.map((p) => p.id);
  if (c.pick && !ids.includes(c.pick)) return false;
  if (c.notPick && ids.includes(c.notPick)) return false;
  if (c.any && !c.any.some((i) => ids.includes(i))) return false;
  if (c.lead && leadAxis(picks) !== c.lead) return false;
  return true;
};
const words = (s) => s.split(/\s+/).filter(Boolean).length;
const visibleWords = (n, picks) =>
  (n.paragraphs || []).filter((p) => matches(p.if, picks))
    .reduce((s, p) => s + words(p.t), 0);

const play = (chooser) => {
  let id = story.start;
  const picks = [];
  let w = 0;
  let scenes = 0;
  for (let guard = 0; guard < 200; guard += 1) {
    const n = nodes[id];
    scenes += 1;
    w += visibleWords(n, picks);
    if (n.end) return { end: n.end, picks, words: w, scenes };
    if (n.choices && n.choices.length) {
      const opts = n.hidden ? [...n.choices, n.hidden] : n.choices;
      const c = chooser(opts, picks, n);
      picks.push({ id: c.id, w: c.w || {} });
      id = c.next;
    } else if (n.branch) {
      id = n.branch.find((b) => matches(b.if, picks)).next;
    } else {
      id = n.next;
    }
  }
  throw new Error('Petlja u priči');
};

const N = 20000;
const dist = { b: 0, s: 0, u: 0 };
let wsum = 0;
let wmin = Infinity;
let wmax = 0;
for (let i = 0; i < N; i += 1) {
  const r = play((opts, _p, n) => {
    // Skrivena opcija se u pravoj igri bira retko (samo ako čitalac okleva), pa je ovde 5%.
    if (n.hidden && Math.random() < 0.05) return n.hidden;
    return n.choices[Math.floor(Math.random() * n.choices.length)];
  });
  dist[r.end] += 1;
  wsum += r.words;
  wmin = Math.min(wmin, r.words);
  wmax = Math.max(wmax, r.words);
}
// Namerne putanje: uvek težiš jednoj osi.
const forced = {};
AXES.forEach((a) => {
  forced[a] = play((opts) => [...opts].sort((x, y) => ((y.w && y.w[a]) || 0) - ((x.w && x.w[a]) || 0))[0]).end;
});
// Uvek prva opcija / uvek preporučena / uvek poslednja.
const alwaysFirst = play((opts) => opts[0]).end;
const alwaysLast = play((opts) => opts[opts.length - 1]).end;

Object.entries(dist).forEach(([k, v]) => { if (!v) err(`kraj "${k}" nikad nije dostignut u ${N} nasumičnih igara`); });

console.log(`Scena: ${Object.keys(nodes).length} | dostižnih: ${seen.size} | izbora (id): ${choiceIds.size}`);
console.log(`Nasumičnih igara: ${N}. Krajevi: b=${(dist.b / N * 100).toFixed(1)}%  s=${(dist.s / N * 100).toFixed(1)}%  u=${(dist.u / N * 100).toFixed(1)}%`);
const avg = wsum / N;
console.log(`Reči po igri: min ${wmin} | prosek ${Math.round(avg)} | max ${wmax}  ->  čitanje ~${Math.round(avg / 180)} min (180 reči/min), bez razmišljanja o izborima`);
console.log('Namerne putanje (ka osi):', forced, '| uvek prva:', alwaysFirst, '| uvek poslednja:', alwaysLast);

if (errors.length) {
  console.error(`\nGREŠKE (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('\nSve provere prošle.');
