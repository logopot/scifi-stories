import React, { useLayoutEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { i18nByLang } from './index';
import { langFromPath } from '../stories';

// Jezik dolazi samo iz adrese (/en/... = engleski, ostalo srpski); postavlja i <html lang>, i pri prelasku bez ponovnog učitavanja.
export default function LanguageProvider({ children }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  useLayoutEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <I18nextProvider i18n={i18nByLang[lang]}>{children}</I18nextProvider>;
}
