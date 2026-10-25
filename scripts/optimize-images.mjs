// Pretvara slike priče (.jpg, .jpeg, .png) u .webp i premešta originale van public/.
// Upotreba: npm run images -- <slug>   |   npm run images -- --all   [--force]
// Ulaz: public/img/<slug>/*.jpg|jpeg|png. Izlaz: .webp pod istim imenom u istom folderu.
// Originali idu u originals/<slug>/ (folder je u .gitignore). Mesta i naslovna: najviše 2200 px širine, portreti: 900 px.
// Postojeći .webp se preskače osim sa --force. Ako je .webp veći od originala, original ostaje u public/img/ i prijavljuje se.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = path.join(root, 'public/img');
const origDir = path.join(root, 'originals');
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const ALL = args.includes('--all');
const slugArg = args.find((a) => !a.startsWith('--'));
const EXT = /\.(jpe?g|png)$/i;
const MAX_PLACE = 2200;
const MAX_PORTRAIT = 900;

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const pad = (s, n) => String(s).padEnd(n);

const slugs = ALL
  ? fs.readdirSync(imgDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
  : slugArg ? [slugArg] : [];
if (!slugs.length) {
  console.error('Upotreba: npm run images -- <slug>  ili  npm run images -- --all  [--force]');
  process.exit(1);
}

const convert = async (src, dest) => {
  const meta = await sharp(src).metadata();
  const portrait = meta.height > meta.width;
  const maxW = portrait ? MAX_PORTRAIT : MAX_PLACE;
  const out = await sharp(src)
    .rotate() // poštuje EXIF orijentaciju; metapodaci se ne upisuju u izlaz
    .resize({ width: maxW, withoutEnlargement: true })
    .webp({ quality: portrait ? 80 : 78, effort: 5 })
    .toBuffer({ resolveWithObject: true });
  return { buf: out.data, w: out.info.width, h: out.info.height, from: meta, portrait };
};

let totalBefore = 0;
let totalAfter = 0;
const problems = [];

for (const slug of slugs) {
  const dir = path.join(imgDir, slug);
  if (!fs.existsSync(dir)) { console.log(`\n${slug}: nema foldera public/img/${slug}, preskačem.`); continue; }
  const od = path.join(origDir, slug);
  // izvori: slike u public/img/<slug>; sa --force i originali čiji je .webp već napravljen
  const sources = new Map();
  for (const f of fs.readdirSync(dir).filter((f) => EXT.test(f))) sources.set(f, path.join(dir, f));
  if (FORCE && fs.existsSync(od)) {
    for (const f of fs.readdirSync(od).filter((f) => EXT.test(f))) if (!sources.has(f)) sources.set(f, path.join(od, f));
  }
  if (!sources.size) { console.log(`\n${slug}: nema slika za pretvaranje, preskačem.`); continue; }

  console.log(`\n${slug}`);
  console.log(`${pad('fajl', 24)}${pad('pre (px)', 14)}${pad('posle (px)', 14)}${pad('pre', 10)}${pad('posle', 10)}`);
  let before = 0;
  let after = 0;
  for (const [file, src] of [...sources].sort()) {
    const base = file.replace(EXT, '');
    const dest = path.join(dir, `${base}.webp`);
    if (fs.existsSync(dest) && !FORCE) { console.log(`${pad(file, 24)}preskočeno (${base}.webp već postoji)`); continue; }
    const size = fs.statSync(src).size;
    try {
      const r = await convert(src, dest);
      if (r.buf.length >= size) {
        problems.push(`${slug}/${file}: .webp (${kb(r.buf.length)}) je veći od originala (${kb(size)}); original zadržan`);
        console.log(`${pad(file, 24)}webp veći od originala, zadržavam original`);
        continue;
      }
      fs.writeFileSync(dest, r.buf);
      if (path.dirname(src) === dir) {
        fs.mkdirSync(od, { recursive: true });
        fs.renameSync(src, path.join(od, file));
      }
      before += size;
      after += r.buf.length;
      console.log(`${pad(file, 24)}${pad(`${r.from.width}x${r.from.height}`, 14)}${pad(`${r.w}x${r.h}`, 14)}${pad(kb(size), 10)}${pad(kb(r.buf.length), 10)}`);
    } catch (e) {
      problems.push(`${slug}/${file}: ${e.message}`);
      console.log(`${pad(file, 24)}GREŠKA: ${e.message}`);
    }
  }
  if (before) console.log(`ukupno ${slug}: ${kb(before)} -> ${kb(after)} (ušteda ${(100 - (after / before) * 100).toFixed(0)}%)`);
  totalBefore += before;
  totalAfter += after;
}

if (totalBefore) console.log(`\nSVE: ${kb(totalBefore)} -> ${kb(totalAfter)} (ušteda ${kb(totalBefore - totalAfter)}, ${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%)`);
if (problems.length) {
  console.error(`\nUpozorenja:\n- ${problems.join('\n- ')}`);
  process.exitCode = 1;
}
