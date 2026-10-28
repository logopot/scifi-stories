import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { saveLangPref } from '../../engine/storage';
import { findLegalByPath, legalPath } from '../../legalPages';
import { getStoryEntry, hasLang, homePath, keyFromPathname, LANGS, storyPath } from '../../stories';
import * as S from './LangSwitch.styled';

// Prekidač jezika "SR | EN". Aktivni jezik (iz adrese) je istaknut, drugi je link na istu stranicu na tom jeziku:
// početna → početna, priča → ista priča ako postoji na tom jeziku, inače početna tog jezika. Napredak se ne prenosi.
export default function LangSwitch() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const current = i18n.language === 'en' ? 'en' : 'sr';
  const key = keyFromPathname(pathname);
  const entry = key ? getStoryEntry(key) : null;

  // pravna stranica (na bilo kom jeziku adrese) → ista stranica na drugom jeziku
  const first = pathname.split('/').filter(Boolean)[current === 'en' ? 1 : 0];
  const legal = first ? findLegalByPath(current, first) || findLegalByPath(current === 'en' ? 'sr' : 'en', first) : null;

  const target = (lang) => {
    if (legal) return legalPath(lang, legal);
    return entry && hasLang(entry, lang) ? storyPath(lang, entry) : homePath(lang);
  };

  return (
    <S.Root role="group" aria-label={t('lang.label')}>
      {LANGS.map((lang, i) => (
        <React.Fragment key={lang}>
          {i > 0 && <S.Sep aria-hidden="true">|</S.Sep>}
          {lang === current ? (
            <S.Current lang={lang} aria-current="true">
              {lang.toUpperCase()}
            </S.Current>
          ) : (
            <S.Other to={target(lang)} lang={lang} hrefLang={lang} onClick={() => saveLangPref(lang)}>
              {lang.toUpperCase()}
            </S.Other>
          )}
        </React.Fragment>
      ))}
    </S.Root>
  );
}
