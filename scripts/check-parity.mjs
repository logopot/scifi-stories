// Provera istovetnosti srpske i engleske verzije priče (story.json / story.en.json) i adresa po jezicima.
// Upotreba: npm run check-parity [slug | _template]   (bez argumenta: sve priče iz registra sa en blokom + šabloni sa story.en.json)
// Greške: struktura se razlikuje, adrese su neispravne, public/_redirects je zastareo.
// Upozorenja: prazan ili neprevedeni tekst, tf/leadf/textf u engleskoj verziji, srpska slova van imena.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import contentEn from '../src/i18n/legal/en.js';
import contentSr from '../src/i18n/legal/sr.js';
import { legalPages } from '../src/legalPages.js';
import { RESERVED_PATHS, stories } from '../src/stories/index.js';
import { isRedirectsCurrent } from './generate-redirects.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const storiesDir = join(here, '../src/stories');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const FEMALE_FIELDS = ['tf', 'leadf', 'textf', 'promptf', 'closingf'];
const SERBIAN_LETTERS = /[čćšžđČĆŠŽĐ]/;
const EN_PATH = /^[a-z0-9-]+$/;
const MAX_PATH = 40;

let failed = false;
const errors = [];
const warnings = [];
let scope = '';
const err = (m) => errors.push(`${scope}: ${m}`);
const warn = (m) => warnings.push(`${scope}: ${m}`);

const keys = (o) => Object.keys(o || {});
// Isti skup i redosled ključeva.
const sameKeys = (label, a, b) => {
  if (!same(keys(a), keys(b))) err(`${label}: ključevi se razlikuju\n    sr: ${keys(a).join(', ')}\n    en: ${keys(b).join(', ')}`);
};
// Rekurzivno poređenje samo ključeva (za ui).
const shape = (o) =>
  o && typeof o === 'object' && !Array.isArray(o) ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, shape(v)])) : Array.isArray(o) ? o.map(() => 0) : 0;

const checkStoryPair = (sr, en, label) => {
  scope = label;

  sameKeys('nodes (skup i redosled čvorova)', sr.nodes, en.nodes);
  if (sr.start !== en.start) err(`start: "${sr.start}" ≠ "${en.start}"`);
  if (!same((sr.meta?.axes || []).map((a) => a.id), (en.meta?.axes || []).map((a) => a.id))) err('meta.axes: id-evi osa se razlikuju');
  if (!same(shape(sr.ui), shape(en.ui))) err('ui: struktura polja se razlikuje (ista polja kao u srpskoj verziji)');
  sameKeys('chapters (id)', sr.chapters, en.chapters);
  sameKeys('images (id)', sr.images, en.images);
  for (const id of keys(sr.images)) {
    const a = sr.images[id];
    const b = (en.images || {})[id];
    if (!b) continue;
    for (const f of ['src', 'kind']) if (a[f] !== b[f]) err(`images.${id}.${f}: "${a[f]}" ≠ "${b[f]}"`);
  }
  sameKeys('characters (ključevi)', sr.characters, en.characters);
  for (const k of keys(sr.characters)) {
    const a = sr.characters[k] || {};
    const b = (en.characters || {})[k];
    if (!b) continue;
    for (const f of ['img', 'imgM', 'imgF']) if ((a[f] ?? null) !== (b[f] ?? null)) err(`characters.${k}.${f}: "${a[f]}" ≠ "${b[f]}"`);
  }
  sameKeys('endings (id)', sr.endings, en.endings);
  for (const k of keys(sr.endings)) {
    const b = (en.endings || {})[k];
    if (b && sr.endings[k].closing.length !== (b.closing || []).length) err(`endings.${k}.closing: različit broj pasusa`);
  }

  for (const id of keys(sr.nodes)) {
    const a = sr.nodes[id];
    const b = (en.nodes || {})[id];
    if (!b) continue;
    for (const f of ['chapter', 'img', 'next', 'end', 'showChapter']) {
      if ((a[f] ?? null) !== (b[f] ?? null)) err(`${id}.${f}: ${JSON.stringify(a[f])} ≠ ${JSON.stringify(b[f])}`);
    }
    if (!same(a.branch ?? null, b.branch ?? null)) err(`${id}.branch: grane (next, if) se razlikuju`);
    const pa = a.paragraphs || [];
    const pb = b.paragraphs || [];
    if (pa.length !== pb.length) err(`${id}.paragraphs: ${pa.length} ≠ ${pb.length} pasusa`);
    pa.forEach((p, i) => {
      const q = pb[i];
      if (!q) return;
      for (const f of ['img', 'if', 'who', 'with', 'solo']) {
        if (!same(p[f] ?? null, q[f] ?? null)) err(`${id}[${i}].${f}: ${JSON.stringify(p[f])} ≠ ${JSON.stringify(q[f])}`);
      }
    });
    const ca = a.choices || [];
    const cb = b.choices || [];
    if (ca.length !== cb.length) err(`${id}.choices: ${ca.length} ≠ ${cb.length} izbora`);
    ca.forEach((c, i) => {
      const d = cb[i];
      if (!d) return;
      for (const f of ['id', 'next', 'w']) if (!same(c[f] ?? null, d[f] ?? null)) err(`${id}.choices[${i}].${f}: ${JSON.stringify(c[f])} ≠ ${JSON.stringify(d[f])}`);
    });
    if (Boolean(a.hidden) !== Boolean(b.hidden)) err(`${id}.hidden: postoji samo u jednoj verziji`);
    else if (a.hidden) for (const f of ['id', 'next', 'w', 'after']) if (!same(a.hidden[f] ?? null, b.hidden[f] ?? null)) err(`${id}.hidden.${f} se razlikuje`);
  }

  // --- tekstovi: prazno, neprevedeno, srpska slova, ženske varijante ---
  const names = new Set(keys(sr.characters).filter((k) => k !== '__reader__'));
  const texts = [];
  const add = (path, srText, enText) => {
    if (typeof srText === 'string' || typeof enText === 'string') texts.push([path, srText, enText]);
  };
  const addAll = (path, a, b) => {
    if (Array.isArray(a)) a.forEach((x, i) => addAll(`${path}[${i}]`, x, b ? b[i] : undefined));
    else if (a && typeof a === 'object') Object.keys(a).forEach((k) => addAll(`${path}.${k}`, a[k], b ? b[k] : undefined));
    else add(path, a, b);
  };
  addAll('meta.title', sr.meta?.title, en.meta?.title);
  addAll('meta.subtitle', sr.meta?.subtitle, en.meta?.subtitle);
  addAll('meta.description', sr.meta?.description, en.meta?.description);
  addAll('ui', sr.ui, en.ui);
  for (const id of keys(sr.chapters)) addAll(`chapters.${id}`, sr.chapters[id], (en.chapters || {})[id]);
  for (const id of keys(sr.endings)) {
    const e = (en.endings || {})[id] || {};
    addAll(`endings.${id}.title`, sr.endings[id].title, e.title);
    addAll(`endings.${id}.closing`, sr.endings[id].closing, e.closing);
  }
  for (const id of keys(sr.nodes)) {
    const a = sr.nodes[id];
    const b = (en.nodes || {})[id] || {};
    (a.paragraphs || []).forEach((p, i) => {
      const q = (b.paragraphs || [])[i] || {};
      add(`${id}[${i}].t`, p.t, q.t);
      add(`${id}[${i}].lead`, p.lead, q.lead);
    });
    add(`${id}.prompt`, a.prompt, b.prompt);
    (a.choices || []).forEach((c, i) => add(`${id}.choices[${i}].text`, c.text, (b.choices || [])[i]?.text));
    if (a.hidden) add(`${id}.hidden.text`, a.hidden.text, b.hidden?.text);
  }
  for (const [path, s, e] of texts) {
    if (typeof e !== 'string' || !e.trim()) {
      warn(`${path}: prazan ili nedostaje engleski tekst`);
      continue;
    }
    const letters = e.replace(/[^\p{L}]/gu, '');
    if (typeof s === 'string' && e.trim() === s.trim() && letters.length > 3 && !names.has(e.trim()) && !/^\{\w+\}$/.test(e.trim())) {
      warn(`${path}: neprevedeno (isto kao srpski): "${e.slice(0, 50)}"`);
    }
  }
  // ženske varijante i srpska slova u celoj engleskoj verziji
  const walk = (v, path, inKey) => {
    if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, inKey));
    else if (v && typeof v === 'object') {
      for (const [k, x] of Object.entries(v)) {
        if (FEMALE_FIELDS.includes(k)) warn(`${path}.${k}: engleska verzija ne sme imati rodne varijante (${FEMALE_FIELDS.join(', ')})`);
        else walk(x, `${path}.${k}`, inKey);
      }
    } else if (typeof v === 'string' && SERBIAN_LETTERS.test(v) && !path.startsWith('images.') ) {
      // reči sa č ć š ž đ; velikim slovom (ne na početku rečenice) su imena likova i mesta
      const re = /[\p{L}'-]*[čćšžđČĆŠŽĐ][\p{L}'-]*/gu;
      for (const m of v.matchAll(re)) {
        const word = m[0];
        const sentenceStart = /(^|[.!?…"“”]\s*)$/.test(v.slice(0, m.index));
        if (/^\p{Lu}/u.test(word) && !sentenceStart) continue;
        if (names.has(word)) continue;
        warn(`${path}: srpsko slovo u reči "${word}"`);
        break;
      }
    }
  };
  walk(en, 'en', false);
  // alt tekst slika sme da se razlikuje, ali ne sme da bude prazan
  for (const id of keys(sr.images)) {
    const alt = (en.images || {})[id]?.alt;
    if (sr.images[id].alt && !(typeof alt === 'string' && alt.trim())) warn(`images.${id}.alt: nedostaje engleski alt`);
  }
};

const checkPaths = () => {
  scope = 'adrese';
  const srPaths = new Map();
  for (const s of stories) {
    const p = s.path?.sr || s.slug;
    if (RESERVED_PATHS.includes(p)) err(`${s.slug}: srpska adresa "${p}" je rezervisana`);
    if (srPaths.has(p)) err(`${s.slug}: srpska adresa "${p}" već koristi ${srPaths.get(p)}`);
    srPaths.set(p, s.slug);
  }
  const enPaths = new Map();
  for (const s of stories) {
    if (!s.en) continue;
    const p = s.en.path;
    if (typeof p !== 'string' || !EN_PATH.test(p)) err(`${s.slug}: en.path "${p}" mora imati samo mala ASCII slova, cifre i crtice`);
    if (typeof p === 'string' && p.length > MAX_PATH) err(`${s.slug}: en.path "${p}" je duži od ${MAX_PATH} znakova`);
    if (RESERVED_PATHS.includes(p)) err(`${s.slug}: en.path "${p}" je rezervisana adresa (${RESERVED_PATHS.join(', ')})`);
    if (enPaths.has(p)) err(`${s.slug}: en.path "${p}" već koristi ${enPaths.get(p)}`);
    enPaths.set(p, s.slug);
    if (srPaths.has(p) && srPaths.get(p) !== s.slug) err(`${s.slug}: en.path "${p}" se poklapa sa srpskom adresom priče ${srPaths.get(p)}`);
    for (const f of ['title', 'tagline', 'genre', 'coverAlt']) {
      if (typeof s.en[f] !== 'string' || !s.en[f].trim()) err(`${s.slug}: en.${f} mora biti neprazan tekst`);
    }
    if (typeof s.en.load !== 'function') err(`${s.slug}: en.load mora biti funkcija`);
    if (!existsSync(join(storiesDir, s.slug, 'story.en.json'))) err(`${s.slug}: nedostaje src/stories/${s.slug}/story.en.json`);
  }
  // pravne stranice: adrese neispravne ili u sukobu sa pričama
  const legalSeen = new Map();
  for (const p of legalPages) {
    for (const lang of ['sr', 'en']) {
      const a = p.path[lang];
      if (!a || !EN_PATH.test(a) || a.length > MAX_PATH) err(`pravna stranica ${p.key}: adresa ${lang} "${a}" nije ispravna`);
      if (RESERVED_PATHS.includes(a)) err(`pravna stranica ${p.key}: adresa "${a}" je rezervisana`);
      const k = `${lang}:${a}`;
      if (legalSeen.has(k)) err(`pravna stranica ${p.key}: adresa ${lang} "${a}" već koristi ${legalSeen.get(k)}`);
      legalSeen.set(k, p.key);
    }
    for (const s of stories) {
      for (const [lang, a] of [['sr', s.path?.sr || s.slug], ['en', s.en?.path]]) {
        if (a && (a === p.path.sr || a === p.path.en)) err(`adresa priče ${s.slug} (${lang}) "${a}" se poklapa sa pravnom stranicom ${p.key}`);
      }
    }
  }
  if (!isRedirectsCurrent()) err('public/_redirects je zastareo u odnosu na registar; pokreni npm run redirects');
};

// Pravne stranice: isti sadržaj i raspored na oba jezika (broj odeljaka, vrsta i broj blokova, isti tokeni).
const checkLegal = () => {
  scope = 'pravne stranice';
  const tokens = (t) => (String(t).match(/{w+}|](https?:[^)]+)/g) || []).sort().join(',');
  for (const p of legalPages) {
    const a = contentSr[p.key];
    const b = contentEn[p.key];
    if (!a || !b) {
      err(`${p.key}: nema teksta na oba jezika`);
      continue;
    }
    if (a.sections.length !== b.sections.length) err(`${p.key}: broj odeljaka ${a.sections.length} ≠ ${b.sections.length}`);
    a.sections.forEach((s, i) => {
      const t = b.sections[i];
      if (!t) return;
      if (s.blocks.length !== t.blocks.length) err(`${p.key}/${i + 1}: broj blokova se razlikuje`);
      s.blocks.forEach((x, j) => {
        const y = t.blocks[j];
        if (!y) return;
        if (Boolean(x.ul) !== Boolean(y.ul)) err(`${p.key}/${i + 1}.${j + 1}: različita vrsta bloka (pasus/lista)`);
        else if (x.ul) {
          if (x.ul.length !== y.ul.length) err(`${p.key}/${i + 1}.${j + 1}: lista ima ${x.ul.length} ≠ ${y.ul.length} stavki`);
          x.ul.forEach((v, k) => { if (y.ul[k] !== undefined && tokens(v) !== tokens(y.ul[k])) err(`${p.key}/${i + 1}.${j + 1}.${k + 1}: tokeni ili linkovi se razlikuju`); });
        } else if (tokens(x.p) !== tokens(y.p)) err(`${p.key}/${i + 1}.${j + 1}: tokeni ili linkovi se razlikuju`);
      });
    });
    if (SERBIAN_LETTERS.test(JSON.stringify(b))) warn(`${p.key} (en): srpska slova u engleskom tekstu`);
  }
};

// --- glavni tok ---
const arg = process.argv[2];
const pairs = [];
const templateDirs = readdirSync(storiesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith('_') && existsSync(join(storiesDir, d.name, 'story.en.json')))
  .map((d) => d.name);
if (arg) {
  if (arg.startsWith('_')) {
    if (!templateDirs.includes(arg)) {
      console.error(`Nema šablona "${arg}" sa story.en.json`);
      process.exit(1);
    }
    pairs.push(arg);
  } else {
    if (!stories.some((s) => s.slug === arg)) {
      console.error(`Nepoznat slug "${arg}"`);
      process.exit(1);
    }
    pairs.push(arg);
  }
} else {
  pairs.push(...stories.filter((s) => s.en).map((s) => s.slug), ...templateDirs);
}

checkPaths();
checkLegal();
for (const slug of pairs) {
  const en = join(storiesDir, slug, 'story.en.json');
  if (!existsSync(en)) {
    scope = slug;
    err('nema story.en.json');
    continue;
  }
  checkStoryPair(readJson(join(storiesDir, slug, 'story.json')), readJson(en), slug);
  console.log(`${slug}: poređeno sa story.en.json`);
}

if (warnings.length) console.warn(`\nUPOZORENJA (${warnings.length}):\n- ${warnings.join('\n- ')}`);
if (errors.length) {
  console.error(`\nGREŠKE (${errors.length}):\n- ${errors.join('\n- ')}`);
  failed = true;
}
if (failed) {
  console.error('\ncheck-parity: provere NISU prošle.');
  process.exit(1);
}
console.log(`\ncheck-parity: provereno ${pairs.length}, adrese i _redirects su u redu.`);
