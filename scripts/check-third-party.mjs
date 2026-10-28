// Provera da sajt ne šalje nijedan zahtev ka tuđem hostu (fontovi, skripte, slike... sve sa našeg domena).
// Upotreba: npm run build && npm run check-third-party [-- http://localhost:4173]
// Bez adrese pokreće `vite preview` nad dist/ (potreban je prethodni build). Otvara početnu (sr i en), jednu priču (sr i en)
// i obe pravne stranice (sr i en) i beleži sve mrežne zahteve; greška ako ijedan ide na host različit od hosta sajta.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const given = process.argv.slice(2).find((a) => /^https?:/.test(a));
const PORT = 4173;
const PAGES = ['/', '/en', '/tamni-sat', '/privatnost', '/odricanje-odgovornosti', '/en/privacy', '/en/disclaimer'];

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
  }
  return null;
};

let server = null;
let base = given ? given.replace(/\/$/, '') : `http://localhost:${PORT}`;
if (!given) {
  if (!fs.existsSync(path.join(root, 'dist/index.html'))) {
    console.error('Nema dist/: prvo pokreni npm run build.');
    process.exit(2);
  }
  server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore' });
  for (let i = 0; i < 50; i += 1) {
    try {
      const r = await fetch(base);
      if (r.ok) break;
    } catch {
      /* server se još podiže */
    }
    await new Promise((res) => setTimeout(res, 200));
  }
}

const exe = findChromium();
if (!exe) {
  console.error('Nije nađen Chromium. Postavi CHROMIUM_PATH.');
  server?.kill();
  process.exit(2);
}
const siteHost = new URL(base).host;
const hosts = new Map(); // host -> broj zahteva
const foreign = [];
const browser = await chromium.launch({ executablePath: exe, args: ['--disable-gpu'] });
try {
  for (const p of PAGES) {
    const page = await browser.newPage();
    page.on('request', (req) => {
      const url = req.url();
      if (/^(data|blob|about):/.test(url)) return;
      const host = new URL(url).host;
      hosts.set(host, (hosts.get(host) || 0) + 1);
      if (host !== siteHost) foreign.push(`${p}: ${url}`);
    });
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.close();
  }
} finally {
  await browser.close();
  server?.kill();
}

console.log(`Zahtevi po hostu: ${[...hosts].map(([h, n]) => `${h} = ${n}`).join(', ')}`);
if (foreign.length) {
  console.error(`GREŠKA: ${foreign.length} zahteva ka tuđim hostovima:\n- ${foreign.join('\n- ')}`);
  process.exit(1);
}
console.log(`check-third-party: ${PAGES.length} strana, svi zahtevi idu samo na ${siteHost}.`);
