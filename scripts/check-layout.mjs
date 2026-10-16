// Provera izgleda SVAKE strane SVIH priča na više širina ekrana.
// Upotreba: npm run dev (u drugom terminalu), pa npm run check-layout [-- http://localhost:5173] [--story slug] [--widths 375,1440] [--sizes 1440x780,1366x650] [--quick] [--out folder] [--concurrency 4] [--random 30]
// Pregledač: CHROMIUM_PATH, inače Playwright-ov instalirani Chromium ili poznata putanja (ništa se ne instalira).
// Do strana stiže razvojnom rutom /dev/scene/:slug/:node/:page (src/pages/DevScene; postoji samo u razvoju).
// Strane se nabrajaju iz engine-a (buildPages), za izbore: (a) svi izbori iz uslova "if", (b) bez izbora, (c) nasumični prolazi
// kroz priču (po --random za svaki rod). Izlazni kod je 1 ako ima grešaka. Snimci strana sa greškom idu u --out (van repoa).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : def;
};
const base = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:5173').replace(/\/$/, '');
const QUICK = args.includes('--quick');
const WIDTHS = (opt('--widths', QUICK ? '375,1440,3840' : '375,768,1024,1440,1920,3840')).split(',').map(Number);
const ONLY = opt('--story', null);
const CONCURRENCY = Number(opt('--concurrency', 4));
const RANDOM_PLAYS = Number(opt('--random', 30));
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'check-layout')));
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const HEIGHT = { 375: 667, 768: 1024, 1024: 768, 1440: 900, 1920: 1080, 3840: 2160 };
const heightOf = (w) => HEIGHT[w] || 900;
// Veličine (širina x visina) koje odgovaraju pravim prozorima pregledača na laptopovima; dodaju se uz --widths.
const LAPTOP_SIZES = ['1440x780', '1366x650', '1536x730', '1280x620'];
const SIZES = (opt('--sizes', null)
  ? opt('--sizes', '').split(',')
  : [...WIDTHS.map((w) => `${w}x${heightOf(w)}`), ...(QUICK || opt('--widths', null) ? [] : LAPTOP_SIZES)]
).map((s) => {
  const [w, h] = s.split('x').map(Number);
  return { w, h: h || heightOf(w), label: `${w}x${h || heightOf(w)}` };
});
// Na ovim veličinama se prijavljuje unutrašnji skrol panela (telefon, laptop visine do 900px).
const SCROLL_REPORT = new Set(['375x667', '1440x900', ...LAPTOP_SIZES]);
const MIN_CH = 30;
const MIN_PHONE_SHARE = 0.9;

const findChromium = () => {
  const env = process.env.CHROMIUM_PATH;
  if (env && fs.existsSync(env)) return env;
  try {
    const p = chromium.executablePath();
    if (p && fs.existsSync(p)) return p;
  } catch {
    /* nije instaliran preko Playwright-a */
  }
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(process.env.LOCALAPPDATA || '', 'ms-playwright'), path.join(os.homedir(), '.cache/ms-playwright'), '/opt/pw-browsers'].filter(Boolean);
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    for (const d of fs.readdirSync(r).filter((n) => n.startsWith('chromium')).sort().reverse()) {
      for (const rel of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = path.join(r, d, rel);
        if (fs.existsSync(p)) return p;
      }
    }
    const direct = path.join(r, 'chromium');
    if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  }
  return null;
};

// ---- Engine u Node-u: src/engine/engine.js se pakuje (esbuild dolazi uz Vite) u privremeni fajl ----
const loadEngine = async () => {
  const { build } = await import('esbuild');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'check-layout-engine-'));
  const outfile = path.join(tmp, 'engine.mjs');
  await build({ entryPoints: [path.join(root, 'src/engine/engine.js')], bundle: true, format: 'esm', outfile, logLevel: 'error', platform: 'node' });
  return import(pathToFileURL(outfile).href);
};

// ---- Spisak ready priča iz src/stories/index.js (bez učitavanja JSON-a kroz import()) ----
const readyStories = () => {
  const src = fs.readFileSync(path.join(root, 'src/stories/index.js'), 'utf8');
  return [...src.matchAll(/\{\s*slug:\s*["']([^"']+)["'][\s\S]*?status:\s*["'](\w+)["']/g)]
    .filter((m) => m[2] === 'ready')
    .map((m) => m[1])
    .filter((s) => !ONLY || s === ONLY);
};

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;

// Svi id-evi izbora koji se pominju u uslovima (if.pick, if.any).
const condPickIds = (story) => {
  const ids = new Set();
  const visit = (c) => {
    if (!c) return;
    if (c.pick) ids.add(c.pick);
    (c.any || []).forEach((x) => ids.add(x));
  };
  for (const n of Object.values(story.nodes)) {
    (n.paragraphs || []).forEach((p) => visit(p.if));
    (n.branch || []).forEach((b) => visit(b.if));
  }
  return [...ids];
};

// Nasumični prolaz: lista { node, picks } za svaki posećeni čvor.
const randomPlay = (engine, story, rng) => {
  let node = story.start;
  const picks = [];
  const visits = [];
  for (let guard = 0; guard < 300; guard += 1) {
    visits.push({ node, picks: picks.map((p) => p.id) });
    const n = story.nodes[node];
    if (n.end) break;
    if (n.choices && n.choices.length) {
      const c = n.hidden && rng() < 0.05 ? n.hidden : n.choices[Math.floor(rng() * n.choices.length)];
      picks.push({ id: c.id, node, w: c.w || {}, hidden: c === n.hidden });
      node = c.next;
    } else {
      const next = engine.resolveNext(n, picks);
      if (!next) break;
      node = next;
    }
  }
  return visits;
};

// Sve različite strane priče: { node, page, total, gender, picks, words, expect }.
const enumeratePages = (E, slug, story) => {
  const engine = E.createEngine(story, slug);
  const rng = mulberry32(12345);
  const scenarios = []; // { picks: [ids], gender, node }
  const allIds = condPickIds(story);
  for (const node of Object.keys(story.nodes)) {
    for (const gender of ['m', 'f']) {
      scenarios.push({ node, picks: allIds, gender });
      scenarios.push({ node, picks: [], gender });
    }
  }
  for (const gender of ['m', 'f']) {
    for (let i = 0; i < RANDOM_PLAYS; i += 1) {
      randomPlay(engine, story, rng).forEach((v) => scenarios.push({ node: v.node, picks: v.picks, gender }));
    }
  }
  const seen = new Map();
  for (const sc of scenarios) {
    const player = { gender: sc.gender, name: '' };
    const picksObj = sc.picks.map((id) => ({ id }));
    const node = story.nodes[sc.node];
    const pages = engine.buildPages(node, picksObj, player);
    pages.forEach((pg, i) => {
      const hasReader = pg.texts.some((t) => t.who && engine.getCharacter(t.who, player).reader);
      const key = [sc.node, i, hasReader ? sc.gender : '', JSON.stringify(pg.texts.map((t) => [t.who, t.t]))].join('|');
      if (seen.has(key)) return;
      const speakers = pg.texts.filter((t) => t.who).map((t) => engine.getCharacter(t.who, player));
      const other = speakers.find((c) => !c.reader);
      const rdr = speakers.find((c) => c.reader);
      const expectPortraits = [other, rdr].filter((c) => c && c.image && c.image.src).map((c) => c.image.src);
      seen.set(key, {
        slug,
        node: sc.node,
        page: i + 1,
        total: pages.length,
        gender: sc.gender,
        picks: sc.picks,
        words: pg.texts.reduce((a, t) => a + wordCount(t.t), 0),
        expectPortraits,
        speakerCount: new Set(pg.texts.filter((t) => t.who).map((t) => t.who)).size,
      });
    });
  }
  return { list: [...seen.values()], nodes: Object.keys(story.nodes).length };
};

// ---- Merenje u pregledaču ----
const measure = () => {
  const panel = document.querySelector('[data-scene-panel]');
  const out = { vw: window.innerWidth, vh: window.innerHeight, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, hasPanel: Boolean(panel) };
  if (!panel) return out;
  const rect = (e) => {
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.right, bottom: r.bottom };
  };
  out.panel = rect(panel);
  // kolona teksta: prvi pasus u panelu; ch se meri probom u istom pasusu
  const para = [...panel.querySelectorAll('p')].find((e) => e.textContent.trim().length > 0);
  if (para) {
    const probe = document.createElement('span');
    probe.style.cssText = 'display:inline-block;width:1ch;height:1px';
    para.appendChild(probe);
    const ch = probe.getBoundingClientRect().width;
    probe.remove();
    const w = para.getBoundingClientRect().width;
    out.text = { w, ch: ch ? w / ch : 0 };
  }
  out.portraits = [...panel.querySelectorAll('img')]
    .filter((i) => getComputedStyle(i.parentElement).position === 'absolute') // veliki portreti; male slike (CharacterRow) se ne računaju
    .map((i) => ({ src: (i.getAttribute('src') || '').replace(/^.*?(img\/.*)$/, '$1'), nat: i.naturalWidth, rect: rect(i.parentElement) }));
  // logo, dugme „← Sve priče“ i broj strane ne smeju da budu prekriveni
  const covered = (el) => {
    if (!el) return null;
    el.scrollIntoView({ block: 'center', inline: 'nearest' }); // element van vidljivog dela (telefon) se prvo dovede u vidno polje
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return !(top && (el === top || el.contains(top) || top.contains(el)));
  };
  const back = [...document.querySelectorAll('a')].find((a) => /Sve priče/.test(a.textContent));
  const logo = back && back.previousElementSibling;
  const pn = [...panel.querySelectorAll('div')].find((d) => d.children.length === 0 && /^\d+ \/ \d+$/.test(d.textContent.trim()));
  out.coveredBack = covered(back);
  out.coveredLogo = covered(logo);
  out.coveredPageNumber = covered(pn);
  out.hasPageNumber = Boolean(pn);
  // slika scene
  const bg = [...document.querySelectorAll('img')].filter((i) => !panel.contains(i));
  out.backdrop = bg.map((i) => ({ nat: i.naturalWidth, w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height }));
  // unutrašnji skrol
  out.scrolls = [panel, ...panel.querySelectorAll('*')].some((e) => {
    const oy = getComputedStyle(e).overflowY;
    return (oy === 'auto' || oy === 'scroll') && e.scrollHeight > e.clientHeight + 1;
  });
  return out;
};

const evaluateErrors = (entry, size, m, isPhone) => {
  const w = size.w;
  const errs = [];
  const add = (check, value) => errs.push({ check, value });
  if (!m.hasPanel) {
    add('panel se nije prikazao', '-');
    return errs;
  }
  if (m.sw > m.cw) add('horizontalni skrol', `scrollWidth ${m.sw} > clientWidth ${m.cw}`);
  if (m.text) {
    if (isPhone) {
      const share = m.text.w / m.panel.w;
      if (share < MIN_PHONE_SHARE) add('kolona teksta preuska (telefon)', `${(share * 100).toFixed(0)}% panela (treba ≥ ${MIN_PHONE_SHARE * 100}%)`);
    } else if (w >= 1024 && m.text.ch < MIN_CH) {
      add('kolona teksta preuska', `${m.text.ch.toFixed(1)}ch (treba ≥ ${MIN_CH}ch)`);
    }
  }
  if (m.coveredBack) add('prekriveno dugme „← Sve priče“', '-');
  if (m.coveredLogo) add('prekriven logo', '-');
  if (m.hasPageNumber && m.coveredPageNumber) add('prekriven broj strane', '-');
  const shown = m.portraits.length;
  if (shown > 2) add('više od dva portreta', String(shown));
  const loaded = m.portraits.filter((p) => p.nat > 0);
  if (loaded.length !== shown) add('portret nije učitan', m.portraits.filter((p) => p.nat === 0).map((p) => p.src).join(', '));
  const missing = entry.expectPortraits.filter((src) => !m.portraits.some((p) => p.src === src && p.nat > 0));
  if (missing.length) add('očekivani portret nije prikazan', missing.join(', '));
  const extra = m.portraits.filter((p) => !entry.expectPortraits.includes(p.src));
  if (extra.length) add('prikazan portret koji ne treba', extra.map((p) => p.src).join(', '));
  if (entry.expectScene) {
    const ok = m.backdrop.some((b) => b.nat > 0);
    if (!ok) add('slika scene nije učitana', '-');
    else {
      const b = m.backdrop.find((x) => x.nat > 0);
      const needH = isPhone ? m.vh * 0.45 : m.vh - 1;
      if (b.w < m.vw - 1 || b.h < needH) add('pozadina ne popunjava ekran', `${Math.round(b.w)}x${Math.round(b.h)} u ${m.vw}x${m.vh}`);
    }
  }
  if (m.scrolls && SCROLL_REPORT.has(size.label)) add('panel skroluje iznutra', `${entry.words} reči na strani`);
  return errs;
};

// ---- Glavni tok ----
const exe = findChromium();
if (!exe) {
  console.error('Nije nađen Chromium. Postavi CHROMIUM_PATH na izvršni fajl pregledača.');
  process.exit(2);
}
const E = await loadEngine();
const slugs = readyStories();
if (!slugs.length) {
  console.error('Nema priča za proveru.');
  process.exit(2);
}
fs.mkdirSync(OUT, { recursive: true });

const coverOf = (slug) => {
  const src = fs.readFileSync(path.join(root, 'src/stories/index.js'), 'utf8');
  const m = new RegExp(`slug:\\s*["']${slug}["'][\\s\\S]*?cover:\\s*["']([^"']+)["']`).exec(src);
  return Boolean(m);
};

const jobs = [];
const summary = {};
for (const slug of slugs) {
  const story = JSON.parse(fs.readFileSync(path.join(root, 'src/stories', slug, 'story.json'), 'utf8'));
  const { list, nodes } = enumeratePages(E, slug, story);
  const hasCover = coverOf(slug);
  list.forEach((e) => {
    e.expectScene = Boolean(story.nodes[e.node].img || hasCover);
  });
  summary[slug] = { nodes, pages: list.length, combos: 0, errors: 0 };
  for (const e of list) for (const size of SIZES) jobs.push({ e, size });
}
console.log(`Priče: ${slugs.join(', ')} | veličine: ${SIZES.map((s) => s.label).join(', ')} | strana: ${Object.values(summary).reduce((a, s) => a + s.pages, 0)} | kombinacija: ${jobs.length}`);

const browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu'] });
const results = []; // { e, w, errs }
const startedAt = Date.now();
let done = 0;

for (const size of SIZES) {
  const w = size.w;
  const mine = jobs.filter((j) => j.size === size);
  const isPhone = w < 768;
  const ctx = await browser.newContext({ viewport: { width: size.w, height: size.h }, isMobile: isPhone, hasTouch: isPhone, deviceScaleFactor: 1 });
  const queue = [...mine];
  const worker = async () => {
    const page = await ctx.newPage();
    while (queue.length) {
      const { e } = queue.shift();
      const url = `${base}/dev/scene/${e.slug}/${e.node}/${e.page}?g=${e.gender}${e.picks.length ? `&picks=${e.picks.join(',')}` : ''}`;
      let errs = [];
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-scene-panel]', { timeout: 15000 });
        await page.evaluate(async () => {
          await document.fonts.ready;
          const imgs = [...document.images];
          await Promise.race([
            Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.addEventListener('load', r); i.addEventListener('error', r); })))),
            new Promise((r) => setTimeout(r, 4000)),
          ]);
        });
        await page.waitForTimeout(250);
        const m = await page.evaluate(measure);
        errs = evaluateErrors(e, size, m, isPhone);
        if (errs.length) {
          const shot = path.join(OUT, `${e.slug}-${e.node}-${e.page}-${e.gender}-${size.label}.png`);
          await page.screenshot({ path: shot });
          errs.forEach((x) => { x.shot = shot; });
        }
      } catch (err) {
        errs = [{ check: 'strana se nije učitala', value: String(err.message).split('\n')[0] }];
      }
      results.push({ e, w: size.label, errs });
      done += 1;
      if (done % 200 === 0) console.log(`  ... ${done}/${jobs.length} (${Math.round((Date.now() - startedAt) / 1000)} s)`);
    }
    await page.close();
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await ctx.close();
}
await browser.close();

// ---- Izveštaj ----
const failures = [];
for (const r of results) {
  summary[r.e.slug].combos += 1;
  r.errs.forEach((x) => {
    summary[r.e.slug].errors += 1;
    failures.push({ slug: r.e.slug, node: r.e.node, page: `${r.e.page}/${r.e.total}`, gender: r.e.gender, w: r.w, ...x });
  });
}
console.log('\nPriča            čvorova  strana  proverenih kombinacija  grešaka');
for (const [slug, s] of Object.entries(summary)) {
  console.log(`${slug.padEnd(16)} ${String(s.nodes).padStart(7)} ${String(s.pages).padStart(7)} ${String(s.combos).padStart(23)} ${String(s.errors).padStart(8)}`);
}
// unutrašnji skrol po veličini: broj strana (sa rodovima) i broj različitih strana (čvor + strana)
const scrollBy = {};
failures.filter((f) => f.check === 'panel skroluje iznutra').forEach((f) => {
  const s = (scrollBy[f.w] ||= { all: 0, uniq: new Set(), total: results.filter((r) => r.w === f.w).length });
  s.all += 1;
  s.uniq.add(`${f.slug}/${f.node}/${f.page}`);
});
const byCheck = {};
failures.forEach((f) => { byCheck[f.check] = (byCheck[f.check] || 0) + 1; });
if (failures.length) {
  console.log('\nGreške (priča, čvor, strana, rod, širina, provera, izmereno):');
  failures
    .sort((a, b) => a.check.localeCompare(b.check) || a.slug.localeCompare(b.slug))
    .forEach((f) => console.log(`  ${f.slug} ${f.node} ${f.page} ${f.gender} ${f.w}px | ${f.check} | ${f.value}`));
  console.log('\nPo vrsti provere:');
  Object.entries(byCheck).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(5)}  ${k}`));
  console.log(`Snimci strana sa greškom: ${OUT}`);
}
if (SIZES.some((s) => SCROLL_REPORT.has(s.label))) {
  console.log('\nPanel skroluje iznutra, po veličini ekrana (strana sa rodovima / različitih strana / od ukupno):');
  SIZES.filter((s) => SCROLL_REPORT.has(s.label)).forEach((s) => {
    const x = scrollBy[s.label];
    const total = results.filter((r) => r.w === s.label).length;
    console.log(`  ${s.label.padEnd(10)} ${String(x ? x.all : 0).padStart(4)} / ${String(x ? x.uniq.size : 0).padStart(4)} / ${total}  (${(((x ? x.all : 0) / (total || 1)) * 100).toFixed(1)}%)`);
  });
}
console.log(`\nUkupno: ${Object.values(summary).reduce((a, s) => a + s.pages, 0)} strana, ${results.length} kombinacija, ${failures.length} grešaka (${Math.round((Date.now() - startedAt) / 1000)} s).`);
process.exit(failures.length ? 1 : 0);
