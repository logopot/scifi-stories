import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { langFromPath } from '../stories';
import { headModel, jsonLd, MANAGED_SELECTOR } from './head';
import { messages, resolveRoute } from './index';

// Pri svakoj promeni rute zamenjuje sve SEO oznake u <head> (title, description, canonical, hreflang, Open Graph, Twitter, robots, JSON-LD).
// Isti model gradi i scripts/prerender.mjs, pa je statički HTML i stanje posle navigacije isto.
export default function useSeo() {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  useLayoutEffect(() => {
    const route = resolveRoute(pathname, lang);
    const siteName = messages[lang].site.name;
    const { title, tags } = headModel(route, siteName);
    document.title = title;
    document.head.querySelectorAll(MANAGED_SELECTOR).forEach((el) => el.remove());
    for (const { tag, attrs } of tags) {
      const el = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      document.head.appendChild(el);
    }
    const homeName = messages[lang].seo.breadcrumbHome;
    for (const data of jsonLd(route, siteName, homeName)) {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.textContent = JSON.stringify(data);
      document.head.appendChild(el);
    }
  }, [pathname, lang]);
}
