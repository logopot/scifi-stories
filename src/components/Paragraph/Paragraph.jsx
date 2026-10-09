import React from 'react';
import Speaker from './components/Speaker';
import * as S from './Paragraph.styled';

// Pasus proze; `who` je ime govornika koje se prikazuje iznad replike.
export default function Paragraph({ who, children }) {
  return (
    <S.Root>
      {who && <Speaker>{who}</Speaker>}
      {children}
    </S.Root>
  );
}
