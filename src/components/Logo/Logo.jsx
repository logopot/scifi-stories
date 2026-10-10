import React from 'react';
import * as S from './Logo.styled';

// Znak sajta (dekorativan: naziv se uvek ispisuje pored ili u aria-label linka). size: 'lg' | 'sm' | 'xs'.
export default function Logo({ size = 'lg' }) {
  return (
    <S.Root $size={size}>
      <img src={`${import.meta.env.BASE_URL}img/logo-192.png`} alt="" width="192" height="192" />
    </S.Root>
  );
}
