import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import LanguageProvider from './i18n/LanguageProvider';
import useLocalePath, { useLang } from './i18n/useLocalePath';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Reader from './pages/Reader';
import { findByPath } from './stories';
import ThemeController from './styles/ThemeController';

// Razvojna ruta za proveru izgleda strana (scripts/check-layout.mjs); u produkcijskom build-u je nema.
const DevScene = import.meta.env.DEV ? React.lazy(() => import('./pages/DevScene')) : null;

// Stara adresa čitača (/:path/citaj, /en/:path/citaj) preusmerava na adresu priče, da stari linkovi rade.
function LegacyReaderRedirect() {
  const { path } = useParams();
  const lang = useLang();
  const localePath = useLocalePath();
  const entry = findByPath(lang, path);
  // Nepoznata adresa ostaje na istoj putanji (bez /citaj), pa je dočeka 404 na jeziku adrese.
  return <Navigate to={entry ? localePath(entry.slug) : `${lang === 'en' ? '/en' : ''}/${path}`} replace />;
}

// Srpski je na korenu (/, /:path), engleski pod /en (/en, /en/:path); jezik se čita iz adrese (LanguageProvider).
export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeController>
          <Routes>
            {DevScene && (
              <Route
                path="/dev/scene/:slug/:node/:page"
                element={
                  <React.Suspense fallback={null}>
                    <DevScene />
                  </React.Suspense>
                }
              />
            )}
            <Route path="/en/:path" element={<Reader />} />
            <Route path="/en/:path/citaj" element={<LegacyReaderRedirect />} />
            <Route path="/:path" element={<Reader />} />
            <Route path="/:path/citaj" element={<LegacyReaderRedirect />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/en" element={<Landing />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ThemeController>
      </LanguageProvider>
    </BrowserRouter>
  );
}
