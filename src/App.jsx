import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Reader from './pages/Reader';
import ThemeController from './styles/ThemeController';

// Stara adresa čitača (/:slug/citaj) preusmerava na /:slug, da stari linkovi rade.
function LegacyReaderRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/${slug}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeController>
        <Routes>
          <Route path="/:slug" element={<Reader />} />
          <Route path="/:slug/citaj" element={<LegacyReaderRedirect />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeController>
    </BrowserRouter>
  );
}
