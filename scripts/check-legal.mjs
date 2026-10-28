// Provera da su podaci odgovorne osobe u src/config.js (LEGAL) popunjeni.
// Upotreba: npm run check-legal (radi i kao "prebuild" korak).
// Lokalno samo upozorava (izlaz 0); u Cloudflare Pages build-u (promenljiva CF_PAGES) prekida build.
import { LEGAL } from '../src/config.js';

const empty = Object.entries(LEGAL).filter(([, v]) => typeof v === 'string' && v.trim().startsWith('['));
if (!empty.length) {
  console.log('check-legal: podaci odgovorne osobe su popunjeni.');
} else if (process.env.CF_PAGES) {
  console.error(
    `\ncheck-legal: GREŠKA: u src/config.js (LEGAL) nisu popunjena polja: ${empty.map(([k]) => k).join(', ')}.\n` +
      'Popuni ih pre objave (stranice „Politika privatnosti“ i „Odricanje odgovornosti“ koriste ove podatke). Build je prekinut.\n'
  );
  process.exit(1);
} else {
  console.warn(`\ncheck-legal: UPOZORENJE: u src/config.js (LEGAL) nisu popunjena polja: ${empty.map(([k]) => k).join(', ')}. (Na Cloudflare Pages build bi pukao.)\n`);
}
