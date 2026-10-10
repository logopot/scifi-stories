// Provera priča iz registra: ose i krajevi iz meta.axes, reference, dostižnost, jedinstveni id-evi,
// raspodela krajeva (svaki kraj 15–55% od 20000 nasumičnih igara) i procena vremena čitanja.
// Upotreba: npm run check-story [slug]   (bez slug-a proverava sve priče sa status 'ready'; zatim teme i strukturu)
// Folderi koji počinju sa "_" (npr. _template) nisu priče u registru; proveravaju se kao šabloni, bez teme i naslovne slike.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { getStoryEntry, stories } from '../src/stories/index.js';
import { themes } from '../src/styles/themes.js';

const here = dirname(fileURLToPath(import.meta.url));
const storiesDir = join(here, '../src/stories');
const N = 20000;
const MIN_SHARE = 0.15; // svaki kraj mora biti dostignut u bar 15% nasumičnih igara
const MAX_SHARE = 0.55; // ... i u najviše 55%
let failed = false;

// entry: { slug, status?, cover? }; template: true za foldere "_*" (bez provere teme i naslovne slike)
const checkStory = (entry, { template = false } = {}) => {
  const story = JSON.parse(readFileSync(join(storiesDir, entry.slug, 'story.json'), 'utf8'));
  const { nodes } = story;
  const errors = [];
  const err = (m) => errors.push(m);

  // --- ose i krajevi (meta.axes) ---
  const axesDef = story.meta && story.meta.axes;
  let AXES = [];
  if (!Array.isArray(axesDef) || axesDef.length < 2 || axesDef.length > 4) {
    err('meta.axes mora biti niz od 2 do 4 osa: [{ "id": "b", "name": "..." }]');
  } else {
    axesDef.forEach((a, i) => {
      if (!a || typeof a.id !== 'string' || !/^[a-z]$/.test(a.id)) err(`meta.axes[${i}].id mora biti jedno malo slovo (je: ${JSON.stringify(a && a.id)})`);
      if (!a || typeof a.name !== 'string' || !a.name.trim()) err(`meta.axes[${i}].name mora biti neprazan tekst (samo za autore, čitaocu se ne prikazuje)`);
    });
    AXES = axesDef.map((a) => a && a.id).filter(Boolean);
    if (new Set(AXES).size !== AXES.length) err('meta.axes: id-evi osa moraju biti jedinstveni');
  }
  const endings = story.endings || {};
  AXES.forEach((a) => { if (!endings[a]) err(`nedostaje kraj endings.${a} za osu "${a}"`); });
  Object.keys(endings).forEach((k) => { if (!AXES.includes(k)) err(`endings.${k}: nema ose "${k}" u meta.axes (ključevi endings moraju biti id-evi osa)`); });
  for (const [k, e] of Object.entries(endings)) {
    if (!e || typeof e.title !== 'string' || !e.title.trim()) err(`endings.${k}.title mora biti tekst`);
    if (!e || !Array.isArray(e.closing) || !e.closing.length || e.closing.some((t) => typeof t !== 'string')) err(`endings.${k}.closing mora biti niz pasusa`);
    if (e && e.closingf !== undefined && (!Array.isArray(e.closingf) || !Array.isArray(e.closing) || e.closingf.length !== e.closing.length)) {
      err(`endings.${k}.closingf mora imati isti broj pasusa kao closing`);
    }
  }

  // --- tekstovi interfejsa i metapodaci koje čitač koristi ---
  const need = (path, check = (v) => typeof v === 'string' && v.trim()) => {
    const v = path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), story);
    if (!check(v)) err(`nedostaje ili nije ispravno: ${path}`);
  };
  const isText = (v) => typeof v === 'string' && v.trim();
  need('meta.title');
  need('meta.subtitle');
  ['next', 'finish', 'start.begin', 'start.continue', 'start.tip', 'start.note', 'start.nameLabel', 'start.namePlaceholder', 'start.genderLabel',
    'start.hintFound', 'start.hintUnknown', 'start.hintNeed', 'start.chosen', 'start.genders.m', 'start.genders.f', 'start.defaults.m',
    'start.defaults.f', 'mirror.kicker', 'mirror.restart'].forEach((k) => need(`ui.${k}`, isText));
  need('ui.start.intro', (v) => Array.isArray(v) && v.length && v.every(isText));
  if (!story.chapters || typeof story.chapters !== 'object') err('nedostaje chapters (može biti prazan objekat {})');

  // --- strukturne provere ---
  const images = story.images || {};
  for (const [k, im] of Object.entries(images)) {
    if (!im.src) err(`slika ${k}: nema src`);
    else if (!template && !im.src.startsWith(`img/${entry.slug}/`)) err(`slika ${k}: src mora počinjati sa img/${entry.slug}/ (je: ${im.src})`);
    else if (!existsSync(join(here, '../public', im.src))) console.warn(`UPOZORENJE: nedostaje fajl public/${im.src} (slika "${k}")`);
  }
  for (const [id, n] of Object.entries(nodes)) {
    if (n.img && !images[n.img]) err(`${id}: nepoznata slika ${n.img}`);
    (n.paragraphs || []).forEach((p, i) => { if (p.img && !images[p.img]) err(`${id}[${i}]: nepoznata slika ${p.img}`); });
  }
  const choiceIds = new Set();
  const hasOut = (n) => (n.choices && n.choices.length) || n.next || n.branch || n.end;
  if (!nodes[story.start]) err(`start ${story.start} ne postoji`);
  const checkWeights = (where, w) => {
    Object.entries(w || {}).forEach(([a, v]) => {
      if (!AXES.includes(a)) err(`${where}: težina za nedeklarisanu osu "${a}" (deklarisane: ${AXES.join(', ')})`);
      if (typeof v !== 'number') err(`${where}: težina ose "${a}" mora biti broj`);
    });
  };
  for (const [id, n] of Object.entries(nodes)) {
    if (!Array.isArray(n.paragraphs) || !n.paragraphs.length) err(`${id}: nema pasuse`);
    (n.paragraphs || []).forEach((p, i) => { if (typeof p !== 'object' || !p.t) err(`${id}[${i}]: pasus mora biti { t, lead?, if? }`); });
    if (!hasOut(n)) err(`${id}: nema izlaza`);
    const targets = [];
    (n.choices || []).forEach((c) => {
      if (choiceIds.has(c.id)) err(`${id}: duplikat id izbora ${c.id}`);
      choiceIds.add(c.id);
      checkWeights(`${id}/${c.id}`, c.w);
      targets.push(c.next);
    });
    if (n.hidden) {
      if (choiceIds.has(n.hidden.id)) err(`${id}: duplikat id skrivene opcije ${n.hidden.id}`);
      choiceIds.add(n.hidden.id);
      checkWeights(`${id}/${n.hidden.id}`, n.hidden.w);
      targets.push(n.hidden.next);
    }
    if (n.next) targets.push(n.next);
    (n.branch || []).forEach((b) => targets.push(b.next));
    targets.forEach((t) => { if (!nodes[t]) err(`${id}: vodi u nepostojeće "${t}"`); });
    if (n.choices && n.choices.length && !n.prompt) err(`${id}: scena sa izborima nema "prompt" rečenicu`);
    if (n.choices && n.choices.some((c) => c.rec) || n.offerRec) err(`${id}: ostalo "rec"/"offerRec" (preporuke su uklonjene)`);
    if (n.end && !AXES.includes(n.end)) err(`${id}: kraj "${n.end}" nije id ose iz meta.axes`);
    if (n.end && !endings[n.end]) err(`${id}: kraj "${n.end}" nije definisan u endings`);
    if (n.chapter && !(story.chapters || {})[n.chapter]) err(`${id}: poglavlje "${n.chapter}" ne postoji`);
  }

  // --- uslovi pasusa moraju da pominju postojeće id-eve izbora i ose ---
  for (const [id, n] of Object.entries(nodes)) {
    const conds = [...(n.paragraphs || []).map((p) => p.if), ...(n.branch || []).map((b) => b.if)];
    conds.filter(Boolean).forEach((c) => {
      [c.pick, c.notPick, ...(c.any || [])].filter(Boolean).forEach((cid) => {
        if (!choiceIds.has(cid)) err(`${id}: uslov pominje nepostojeći izbor "${cid}"`);
      });
      if (c.lead && !AXES.includes(c.lead)) err(`${id}: uslov lead "${c.lead}" nije id ose iz meta.axes`);
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

  // --- likovi: svaki govornik (who) i svaki lik iz `with` mora biti u characters; img je id iz images ili null (slovo) ---
  const characters = story.characters || {};
  const reader = characters.__reader__ || null;
  const READER_TOKEN = /^\{(ime|IME)\}$/;
  const isReaderWho = (w) => Boolean(reader) && (w === (reader.who || 'Ti') || READER_TOKEN.test(w));
  const named = new Set();
  let readerSpeaks = false;
  for (const [id, n] of Object.entries(nodes)) {
    (n.paragraphs || []).forEach((p, i) => {
      if (p.who && (p.who === 'Ti' || READER_TOKEN.test(p.who))) readerSpeaks = true;
      if (p.who && !isReaderWho(p.who) && !p.who.includes('{')) named.add(p.who);
      if (p.with !== undefined && !Array.isArray(p.with)) err(`${id}[${i}]: with mora biti niz imena`);
      (Array.isArray(p.with) ? p.with : []).forEach((w) => {
        if (!(w in characters)) err(`${id}[${i}]: with "${w}" nije u characters`);
        named.add(w);
      });
    });
  }
  named.forEach((w) => {
    if (!(w in characters)) err(`govornik "${w}" nije u characters (dodaj ga, ili { "img": null } ako nema portret)`);
  });
  if (readerSpeaks && !reader) err('pasusi govore u ime čitaoca (who "Ti"), a nema characters.__reader__ { who, imgM, imgF }');
  const checkImg = (label, id) => {
    if (id === null || id === undefined) return;
    if (!images[id]) err(`${label}: slika "${id}" ne postoji u images`);
    else if (images[id].kind !== 'portrait') err(`${label}: slika "${id}" nije kind "portrait"`);
  };
  for (const [name, c] of Object.entries(characters)) {
    if (name === '__reader__') {
      if (!c.imgM || !c.imgF) err('characters.__reader__: potrebna su polja imgM i imgF (id portreta za rod m i f)');
      checkImg('characters.__reader__.imgM', c.imgM);
      checkImg('characters.__reader__.imgF', c.imgF);
    } else if (!c || !('img' in c)) err(`characters.${name}: nedostaje polje img (id slike ili null)`);
    else checkImg(`characters.${name}`, c.img);
  }
  const noPortrait = [...named].filter((w) => characters[w] && characters[w].img === null);
  if (noPortrait.length) console.warn(`UPOZORENJE: bez portreta (prikazuje se slovo): ${noPortrait.join(', ')}`);
  const missingFiles = Object.entries(characters)
    .flatMap(([name, c]) => [c.img, c.imgM, c.imgF].filter(Boolean).map((id) => [name, id]))
    .filter(([, id]) => images[id] && images[id].src && !existsSync(join(here, '../public', images[id].src)));
  if (missingFiles.length) {
    console.warn(`UPOZORENJE: nema fajla portreta (prikazuje se slovo): ${missingFiles.map(([n, id]) => `${n} (${images[id].src})`).join(', ')}`);
  }

  // --- metapodaci priče i registra ---
  const desc = story.meta && story.meta.description;
  if (!Array.isArray(desc) || !desc.length || desc.some((d) => typeof d !== 'string' || !d.trim())) {
    err('meta.description mora biti niz od bar jednog neispraznog pasusa (opis na stranici priče)');
  }
  if (!template) {
    if (!themes[entry.slug]) err(`nema teme "${entry.slug}" u src/styles/themes.js`);
    if (entry.cover && !existsSync(join(here, '../public', entry.cover))) console.warn(`UPOZORENJE: nedostaje naslovna slika public/${entry.cover}`);
  }

  // --- simulacija (isti algoritam kao u engine.js, ali sa osama iz meta.axes) ---
  // Preskače se ako struktura nije ispravna (inače bi pucala na pokvarenim referencama).
  if (errors.length) {
    console.error(`\nGREŠKE u "${entry.slug}" (${errors.length}):\n- ${errors.join('\n- ')}\n(simulacija preskočena dok se strukturne greške ne isprave)`);
    return false;
  }

  const totals = (picks) => {
    const t = Object.fromEntries(AXES.map((a) => [a, 0]));
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
        const hit = n.branch.find((b) => matches(b.if, picks));
        if (!hit) throw new Error(`${id}: nijedna grana branch ne važi (dodaj granu bez uslova na kraj)`);
        id = hit.next;
      } else {
        id = n.next;
      }
    }
    throw new Error('Petlja u priči');
  };

  const dist = Object.fromEntries(AXES.map((a) => [a, 0]));
  let wsum = 0;
  let wmin = Infinity;
  let wmax = 0;
  let forced = {};
  let alwaysFirst;
  let alwaysLast;
  try {
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
    AXES.forEach((a) => {
      forced[a] = play((opts) => [...opts].sort((x, y) => ((y.w && y.w[a]) || 0) - ((x.w && x.w[a]) || 0))[0]).end;
    });
    // Uvek prva / uvek poslednja opcija.
    alwaysFirst = play((opts) => opts[0]).end;
    alwaysLast = play((opts) => opts[opts.length - 1]).end;
  } catch (e) {
    err(`simulacija pala: ${e.message}`);
    forced = {};
  }

  AXES.forEach((a) => {
    const share = dist[a] / N;
    if (!dist[a]) err(`osa "${a}" nikad ne pobeđuje: kraj "${a}" nije dostignut ni u jednoj od ${N} nasumičnih igara`);
    else if (share < MIN_SHARE) err(`kraj "${a}" je previše redak: ${(share * 100).toFixed(1)}% igara (najmanje ${Math.round(MIN_SHARE * 100)}%)`);
    else if (share > MAX_SHARE) err(`kraj "${a}" je previše čest: ${(share * 100).toFixed(1)}% igara (najviše ${Math.round(MAX_SHARE * 100)}%)`);
  });

  console.log(`Ose: ${axesDef.map((a) => `${a.id} = ${a.name}`).join(' | ')}`);
  console.log(`Scena: ${Object.keys(nodes).length} | dostižnih: ${seen.size} | izbora (id): ${choiceIds.size}`);
  console.log(`Nasumičnih igara: ${N}. Krajevi: ${AXES.map((a) => `${a}=${(dist[a] / N * 100).toFixed(1)}%`).join('  ')}`);
  const avg = wsum / N;
  console.log(`Reči po igri: min ${wmin} | prosek ${Math.round(avg)} | max ${wmax}  ->  čitanje ~${Math.round(avg / 180)} min (180 reči/min), bez razmišljanja o izborima`);
  console.log('Namerne putanje (ka osi):', forced, '| uvek prva:', alwaysFirst, '| uvek poslednja:', alwaysLast);

  if (errors.length) {
    console.error(`\nGREŠKE u "${entry.slug}" (${errors.length}):\n- ${errors.join('\n- ')}`);
    return false;
  }
  console.log(`\n"${entry.slug}": sve provere prošle.`);
  return true;
};

// --- glavni tok ---
const slugArg = process.argv[2];
const templateDirs = readdirSync(storiesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('_') && existsSync(join(storiesDir, d.name, 'story.json')))
  .map((d) => d.name);

let targets = stories.filter((s) => s.status === 'ready');
let templates = templateDirs;
if (slugArg) {
  if (slugArg.startsWith('_')) {
    if (!templateDirs.includes(slugArg)) {
      console.error(`Nema šablona "${slugArg}" (src/stories/${slugArg}/story.json)`);
      process.exit(1);
    }
    targets = [];
    templates = [slugArg];
  } else {
    const one = getStoryEntry(slugArg);
    if (!one) {
      console.error(`Nepoznat slug "${slugArg}". Dostupni: ${stories.map((s) => s.slug).join(', ')}`);
      process.exit(1);
    }
    targets = [one];
    templates = [];
  }
}
for (const entry of targets) {
  console.log(`\n=== ${entry.slug} ===`);
  if (entry.status === 'soon') {
    console.log('status "soon": nema story.json za proveru.');
  } else if (!checkStory(entry)) {
    failed = true;
  }
}
for (const name of templates) {
  console.log(`\n=== ${name} (šablon, nije u registru) ===`);
  if (!checkStory({ slug: name }, { template: true })) failed = true;
}
// Registar: svaka priča ima temu.
stories.forEach((s) => { if (!themes[s.slug]) { console.error(`Registar: nema teme za "${s.slug}"`); failed = true; } });

// Teme (kontrast) i struktura komponenti.
for (const script of ['check-themes.mjs', 'check-structure.mjs']) {
  console.log(`\n=== ${script} ===`);
  const r = spawnSync(process.execPath, [join(here, script)], { stdio: 'inherit' });
  if (r.status !== 0) failed = true;
}

if (failed) {
  console.error('\nProvere NISU prošle.');
  process.exit(1);
}
console.log('\nSve provere prošle.');
