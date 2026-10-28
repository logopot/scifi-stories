// Provera preusmeravanja iz functions/_middleware.js.
// Upotreba: npm run check-redirects
import { onRequest } from '../functions/_middleware.js';

const NEXT = Symbol('next');
const run = (url) => onRequest({ request: new Request(url), next: () => NEXT });

const cases = [
  { url: 'https://scifi-stories.pages.dev/tamni-sat?x=1', redirect: 'https://otherworldstories.com/tamni-sat?x=1' },
  { url: 'https://www.otherworldstories.com/', redirect: 'https://otherworldstories.com/' },
  { url: 'https://otherworldstories.com/tamni-sat', redirect: null },
  { url: 'https://abc123.scifi-stories.pages.dev/', redirect: null },
];

let failed = false;
for (const { url, redirect } of cases) {
  const res = await run(url);
  const ok = redirect
    ? res instanceof Response && res.status === 301 && res.headers.get('location') === redirect
    : res === NEXT;
  if (!ok) failed = true;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${url} -> ${redirect ? `301 ${redirect}` : 'next()'}`);
}
if (failed) process.exit(1);
console.log('Preusmeravanja su u redu.');
