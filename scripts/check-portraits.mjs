// Provera: svaki lik koji govori (pasus sa "who") treba da ima sliku, a fajl slike da postoji.
// Upotreba: npm run check-portraits. Ispisuje spisak likova bez slike; greška (exit 1) samo za sliku koja je navedena a fajla nema.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const storiesDir = path.join(root, 'src/stories');
const slugs = fs
  .readdirSync(storiesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_') && fs.existsSync(path.join(storiesDir, d.name, 'story.json')))
  .map((d) => d.name);

const broken = [];
const missing = [];
for (const slug of slugs) {
  const story = JSON.parse(fs.readFileSync(path.join(storiesDir, slug, 'story.json'), 'utf8'));
  const chars = story.characters || {};
  const reader = chars.__reader__;
  const speakers = new Set();
  for (const node of Object.values(story.nodes)) {
    for (const p of node.paragraphs || []) {
      if (p.who) speakers.add(p.who);
      (p.with || []).forEach((w) => speakers.add(w));
    }
  }
  const fileOk = (id) => {
    const img = story.images && story.images[id];
    return Boolean(img && img.src && fs.existsSync(path.join(root, 'public', img.src)));
  };
  for (const who of speakers) {
    if (reader && (who === (reader.who || 'Ti') || /^{(ime|IME)}$/.test(who))) {
      for (const id of [reader.imgM, reader.imgF]) if (id && !fileOk(id)) broken.push(`${slug}: čitalac (${id})`);
      continue;
    }
    const c = chars[who];
    if (!c || !c.img) missing.push(`${slug}: ${who}`);
    else if (!fileOk(c.img)) broken.push(`${slug}: ${who} (img "${c.img}" nije u images ili fajl ne postoji)`);
  }
}
console.log(missing.length ? `Likovi bez slike (samo ime):\n  - ${missing.join('\n  - ')}` : 'Svi likovi imaju sliku.');
if (broken.length) {
  console.error(`\nSlika ne postoji:\n  - ${broken.join('\n  - ')}`);
  process.exit(1);
}
