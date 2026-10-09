import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteTheme, themes } from './src/styles/themes.js';

// Boja pozadine i theme-color po ruti, ubačeni u index.html pre učitavanja skripte,
// da pri tvrdom osvežavanju nema treptaja pogrešne teme. Izvor boja je src/styles/themes.js.
const bootTheme = () => ({
  name: 'boot-theme',
  transformIndexHtml(html) {
    const bgBySlug = Object.fromEntries(Object.entries(themes).map(([slug, t]) => [slug, t.bg]));
    const script = `(function(){var m=${JSON.stringify(bgBySlug)};var s=location.pathname.split('/')[1]||'';var c=Object.prototype.hasOwnProperty.call(m,s)?m[s]:${JSON.stringify(siteTheme.bg)};var st=document.createElement('style');st.id='boot-theme';st.textContent='html,body{background:'+c+'}';document.head.appendChild(st);var mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.setAttribute('content',c);})();`;
    return html
      .replace('<meta name="theme-color" content="" />', `<meta name="theme-color" content="${siteTheme.bg}" />`)
      .replace('</head>', `    <script>${script}</script>\n  </head>`);
  },
});

export default defineConfig({
  plugins: [react(), bootTheme()],
  base: '/',
});
