import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sky from '../Sky';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import * as S from './Layout.styled';

// Okvir sajta (početna, stranica priče, "nema takve priče"). Čitač ima svoj, čistiji okvir.
export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <Sky />
      <S.Shell>
        <SiteHeader />
        {children || <Outlet />}
        <SiteFooter />
      </S.Shell>
    </>
  );
}
