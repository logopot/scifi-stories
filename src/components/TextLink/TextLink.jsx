import React from 'react';
import * as S from './TextLink.styled';

// Tih, sitan link (npr. "← Sve priče"); className dozvoljava roditelju da ga pozicionira.
export default function TextLink({ to, className, children }) {
  return (
    <S.Root to={to} className={className}>
      {children}
    </S.Root>
  );
}
