import React from 'react';
import * as S from './Paragraph.styled';

// Pasus običnog teksta (početni ekran, kraj, stranice sajta). Tekst priče crta Scene (SceneLine).
export default function Paragraph({ children }) {
  return <S.Root>{children}</S.Root>;
}
