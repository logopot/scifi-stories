// Provera strukture: svaka komponenta ima svoj folder sa Name.jsx i Name.styled.js,
// komponente ne uvoze tuđe .styled.js, a u .jsx/.styled.js nema sirovih boja ni CSS fajlova.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');
const errors = [];
const rel = (p) => relative(root, p).replaceAll('\\', '/');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// --- komponentni folderi: src/components/** i src/pages/** (folder "components" je samo grupa) ---
const componentDirs = (dir) =>
  readdirSync(dir)
    .map((n) => join(dir, n))
    .filter((p) => statSync(p).isDirectory())
    .flatMap((p) => {
      if (basename(p) === 'components') return componentDirs(p);
      return [p, ...(readdirSync(p).includes('components') ? componentDirs(join(p, 'components')) : [])];
    });

for (const group of ['components', 'pages']) {
  for (const dir of componentDirs(join(src, group))) {
    const name = basename(dir);
    const files = readdirSync(dir).filter((f) => statSync(join(dir, f)).isFile());
    if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) errors.push(`${rel(dir)}: ime foldera mora biti PascalCase`);
    if (!files.includes(`${name}.jsx`)) errors.push(`${rel(dir)}: nedostaje ${name}.jsx`);
    if (!files.includes(`${name}.styled.js`)) errors.push(`${rel(dir)}: nedostaje ${name}.styled.js`);
    const extra = files.filter((f) => ![`${name}.jsx`, `${name}.styled.js`, 'index.js'].includes(f));
    if (extra.length) errors.push(`${rel(dir)}: neočekivani fajlovi: ${extra.join(', ')} (dozvoljeno: ${name}.jsx, ${name}.styled.js, index.js)`);
  }
}

const files = walk(src);
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/;
const TOKEN_KEYS = {};
const tokensText = readFileSync(join(src, 'styles/tokens.js'), 'utf8');
for (const group of ['space', 'fs', 'tracking']) {
  const block = tokensText.match(new RegExp(`export const ${group} = \\{([\\s\\S]*?)\\n\\};`));
  TOKEN_KEYS[group] = new Set(block ? [...block[1].matchAll(/^\s*(\d+):/gm)].map((m) => m[1]) : []);
}

for (const file of files) {
  const r = rel(file);
  if (file.endsWith('.css')) errors.push(`${r}: CSS fajlovi nisu dozvoljeni (koristi styled-components)`);
  const isComponentFile = file.endsWith('.jsx') || file.endsWith('.styled.js');
  if (!isComponentFile) continue;
  const text = readFileSync(file, 'utf8');
  const code = text.replace(/^\s*\/\/.*$/gm, '');

  if (RAW_COLOR.test(code)) errors.push(`${r}: sirova boja (hex/rgb/hsl); boje idu samo u src/styles/themes.js`);

  if (file.endsWith('.jsx')) {
    // .jsx bez CSS-a: nema <style>, css`` ni styled`` šablona
    if (/\bstyled\b[.(`]|\bcss`|<style/.test(code)) errors.push(`${r}: CSS ne ide u .jsx; prebaci ga u .styled.js`);
    for (const m of code.matchAll(/from\s+['"]([^'"]+\.styled(?:\.js)?)['"]/g)) {
      const target = resolve(dirname(file), m[1]);
      const own = join(dirname(file), `${basename(dirname(file))}.styled`);
      if (!target.startsWith(own)) errors.push(`${r}: uvozi tuđi .styled.js (${m[1]}); komponuj komponentu umesto toga`);
    }
  } else {
    for (const m of code.matchAll(/from\s+['"]([^'"]+\.styled(?:\.js)?)['"]/g)) {
      errors.push(`${r}: .styled.js ne uvozi tuđi .styled.js (${m[1]})`);
    }
    // tokeni koji se koriste moraju da postoje u tokens.js
    for (const m of code.matchAll(/theme\.(space|fs|tracking)\[(\d+)\]/g)) {
      if (!TOKEN_KEYS[m[1]].has(m[2])) errors.push(`${r}: theme.${m[1]}[${m[2]}] ne postoji u src/styles/tokens.js`);
    }
  }
}

if (errors.length) {
  console.error(`GREŠKE u strukturi (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Struktura: ${files.length} fajlova proverena, sve prošlo.`);
