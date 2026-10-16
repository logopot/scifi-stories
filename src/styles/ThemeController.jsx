import React, { useEffect, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { useLocation } from 'react-router-dom';
import GlobalStyle from './GlobalStyle';
import { getTheme } from './themes';

// Tema se bira iz prvog segmenta URL-a, bez čekanja na JSON priče, pa nema treptaja pogrešne teme.
export default function ThemeController({ children }) {
  const { pathname } = useLocation();
  const parts = pathname.split('/');
  // razvojna ruta /dev/scene/:slug/... koristi temu svoje priče
  const slug = (parts[1] === 'dev' && parts[2] === 'scene' ? parts[3] : parts[1]) || '';
  const theme = useMemo(() => getTheme(slug), [slug]);

  useEffect(() => {
    // Privremeni stil iz index.html (boja pozadine pre učitavanja skripte) više nije potreban.
    document.getElementById('boot-theme')?.remove();
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme.bg;
  }, [theme]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
