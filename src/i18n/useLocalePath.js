import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getStoryEntry, hasLang, homePath, storyPath } from '../stories';

// Jezik trenutne strane ('sr' | 'en').
export const useLang = () => (useTranslation().i18n.language === 'en' ? 'en' : 'sr');

// Vraća funkciju localePath(key): adresa na jeziku trenutne strane. Bez ključa (ili 'home') je početna strana,
// inače je ključ interni slug priče. Priča koje nema na tom jeziku vodi na početnu stranu tog jezika.
export default function useLocalePath() {
  const lang = useLang();
  return useCallback(
    (key) => {
      if (!key || key === 'home') return homePath(lang);
      const entry = getStoryEntry(key);
      return entry && hasLang(entry, lang) ? storyPath(lang, entry) : homePath(lang);
    },
    [lang]
  );
}
