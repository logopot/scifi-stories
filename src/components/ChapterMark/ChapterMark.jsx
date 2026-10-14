import React from 'react';
import * as S from './ChapterMark.styled';

// Sitna oznaka iznad naslova (poglavlje, "Kraj").
export default function ChapterMark({ className, children }) {
  return <S.Root className={className}>{children}</S.Root>;
}
