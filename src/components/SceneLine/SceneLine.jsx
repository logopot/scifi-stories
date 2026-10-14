import React from 'react';
import * as S from './SceneLine.styled';

// Jedan pasus u panelu scene. `label` je ime govornika kad ga ne prikazuje zaglavlje panela
// (replika usred strane ili drugi govornik); pasusi bez govornika nemaju ime.
export default function SceneLine({ label, children }) {
  return (
    <S.Root>
      {label && <S.Label>{label}</S.Label>}
      <S.Text>{children}</S.Text>
    </S.Root>
  );
}
