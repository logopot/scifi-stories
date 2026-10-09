import React from 'react';
import * as S from './ChapterMark.styled';

// Sitna oznaka iznad naslova (poglavlje, "Kraj").
export default function ChapterMark({ children }) {
  return <S.Root>{children}</S.Root>;
}
