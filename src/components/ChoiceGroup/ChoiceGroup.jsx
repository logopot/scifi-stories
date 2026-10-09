import React from 'react';
import * as S from './ChoiceGroup.styled';

// Red dugmadi za jedan izbor (npr. rod).
export default function ChoiceGroup({ labelledBy, children }) {
  return (
    <S.Root role="radiogroup" aria-labelledby={labelledBy}>
      {children}
    </S.Root>
  );
}
