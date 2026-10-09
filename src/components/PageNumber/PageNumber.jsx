import React from 'react';
import * as S from './PageNumber.styled';

// Broj strane u uglu strane (PageBox je njegov roditelj sa position: relative).
export default function PageNumber({ page, total }) {
  return (
    <S.Root>
      {page} / {total}
    </S.Root>
  );
}
