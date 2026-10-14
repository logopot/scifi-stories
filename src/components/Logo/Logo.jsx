import React from 'react';
import LogoMark from '../LogoMark';
import * as S from './Logo.styled';

// Znak sajta (dekorativan: naziv se uvek ispisuje pored ili u aria-label linka). size: 'lg' | 'sm' | 'xs'; variant: 'default' | 'onImage' (svetle boje za znak preko slike).
export default function Logo({ size = 'lg', variant = 'default' }) {
  return (
    <S.Root $size={size} $onImage={variant === 'onImage'}>
      <LogoMark />
    </S.Root>
  );
}
