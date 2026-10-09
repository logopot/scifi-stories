import { useEffect } from 'react';

const setMeta = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

// Naslov i opis stranice po ruti (bez dodatnih biblioteka).
export default function useDocumentMeta(title, description) {
  useEffect(() => {
    document.title = title;
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description);
      setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
  }, [title, description]);
}
