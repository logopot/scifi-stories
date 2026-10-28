// Provera: nijedna stranica ne sme imati vodoravno pomeranje na telefonu (320–430 px).
// Upotreba: npm run dev (u drugom terminalu), pa npm run check-overflow [-- http://localhost:5173] [--widths 320,390] [--stories slug1,slug2]
// Pregledač: CHROMIUM_PATH, inače Playwright-ov instalirani Chromium ili poznata putanja (ništa se ne instalira).
// Meri document.documentElement.scrollWidth naspram clientWidth više puta po stranici (i tokom uvodne animacije).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { legalPages } from '../src/legalPages.js';

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:/.test(a)) || 'http://localhost:5173').replace(/\/$/, '');
const wIdx = args.indexOf('--widths');
const WIDTHS = (wIdx >= 0 ? args[wIdx + 1] : '320,360,375,390,412,430').split(',').map(Number);
const sIdx = args.indexOf('--stories');
const ONLY = sIdx >= 0 ? args[sIdx + 1].split(',') : null; // npr. --stories tri-i-deset
const SAMPLES_MS = [100, 600, 1000]; // tokom i posle animacije strane (traje oko 0,9 s)
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

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

const slugs = fs
  .readdirSync(path.join(root, 'src/stories'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && fs.existsSync(path.join(root, 'src/stories', d.name, 'story.json')))
  .map((d) => d.name)
  .filter((n) => !ONLY || ONLY.includes(n));

// Po priči: početna scena, scena sa govornikom sa portretom, bez portreta, sa čitaocem, sa izborima i kraj.
const pickNodes = (story) => {
  const chars = story.characters || {};
  // scene sa praznim izborima (state bez izbora) moraju imati bar jedan bezuslovni pasus
  const pick = (pred) => Object.entries(story.nodes).find(([, n]) => (n.paragraphs || []).some((p) => !p.if) && pred(n))?.[0];
  const speaks = (n, f) => (n.paragraphs || []).some((p) => p.who && f(p.who));
  const found = {
    start: story.start,
    portrait: pick((n) => speaks(n, (w) => w !== 'Ti' && chars[w]?.img)),
    noPortrait: pick((n) => speaks(n, (w) => w !== 'Ti' && chars[w] && !chars[w].img)),
    reader: pick((n) => speaks(n, (w) => w === 'Ti')),
    choices: pick((n) => (n.choices || []).length > 0 && n.hidden),
    ending: pick((n) => n.end),
  };
  return [...new Set(Object.values(found).filter(Boolean))];
};

const measure = (page) =>
  page.evaluate(() => {
    const de = document.documentElement;
    const cw = de.clientWidth;
    const bad = [];
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue;
      if (b.right > cw + 1 || b.left < -1) {
        const cs = getComputedStyle(el);
        const cls = typeof el.className === 'string' && el.className ? `.${el.className.split(' ').slice(0, 2).join('.')}` : '';
        bad.push(`${el.tagName.toLowerCase()}${cls} [${b.left.toFixed(0)}..${b.right.toFixed(0)}] width=${cs.width} margin=${cs.marginLeft}/${cs.marginRight} position=${cs.position}`);
      }
    }
    return { sw: de.scrollWidth, cw, bad: bad.slice(0, 6) };
  });

const exe = findChromium();
if (!exe) {
  console.error('Nije nađen Chromium. Postavi CHROMIUM_PATH na izvršni fajl pregledača.');
  process.exit(2);
}
let browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu'] });
const failures = [];
let checked = 0;

const check = async (page, label, w) => {
  if (process.env.VERBOSE) console.log('  ' + label);
  for (const ms of SAMPLES_MS) {
    await page.waitForTimeout(ms === SAMPLES_MS[0] ? ms : ms - SAMPLES_MS[SAMPLES_MS.indexOf(ms) - 1]);
    const r = await measure(page);
    checked += 1;
    if (r.sw > r.cw) {
      failures.push(`${w}px ${label} (nakon ~${ms} ms): scrollWidth ${r.sw} > clientWidth ${r.cw}\n      ${r.bad.join('\n      ') || '(nijedan element ne prelazi ivicu; proveri transform/pseudo-elemente)'}`);
      return;
    }
  }
};

for (const w of WIDTHS) {
  console.log(`širina ${w}px ...`);
  const newPage = async (init) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    if (init) await page.addInitScript(init.fn, init.arg);
    return { ctx, page };
  };
  let t = await newPage();
  await t.page.goto(`${base}/`);
  await check(t.page, '/', w);
  // početna na engleskom i pravne stranice na oba jezika
  for (const extra of ['/en', ...legalPages.flatMap((p) => [`/${p.path.sr}`, `/en/${p.path.en}`])]) {
    await t.page.goto(`${base}${extra}`);
    await check(t.page, extra, w);
  }
  await t.ctx.close();
  for (const slug of slugs) {
    await browser.close();
    browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu'] });
    const story = JSON.parse(fs.readFileSync(path.join(root, 'src/stories', slug, 'story.json'), 'utf8'));
    t = await newPage();
    await t.page.goto(`${base}/${slug}`);
    await check(t.page, `/${slug} (početni ekran)`, w);
    await t.ctx.close();
    for (const node of pickNodes(story)) {
      for (const gender of ['m', 'f']) {
        if (gender === 'f' && node !== story.start) continue;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            t = await newPage({ fn: ([s, n, g]) => localStorage.setItem(`scifi-${s}-v1`, JSON.stringify({ node: n, picks: [], gender: g, name: '' })), arg: [slug, node, gender] });
            await t.page.goto(`${base}/${slug}`);
            await t.page.getByRole('button', { name: /nastavi/i }).first().click();
            // sve strane scene: prva se meri za vreme animacije, ostale posle okretanja
            let last = '';
            for (let i = 0; i < 14; i++) {
              await check(t.page, `/${slug} scena ${node} strana ${i + 1}`, w);
              const text = await t.page.evaluate(() => document.querySelector('section')?.innerText.slice(0, 80) || '');
              if (text === last) break;
              last = text;
              await t.page.keyboard.press('ArrowRight');
              await t.page.waitForTimeout(300);
            }
            await t.ctx.close();
            break;
          } catch (e) {
            // zna da se desi (srušen renderer headless Chromium-a); jedan ponovni pokušaj
            await t.ctx.close().catch(() => {});
            if (attempt === 1) throw e;
          }
        }
      }
    }
  }
}
await browser.close();

if (failures.length) {
  console.error(`\nVodoravno pomeranje na ${failures.length} stranica (od ${checked} merenja):\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}
console.log(`Nema vodoravnog pomeranja: ${checked} merenja, širine ${WIDTHS.join(', ')} px, ${slugs.length} priče.`);
