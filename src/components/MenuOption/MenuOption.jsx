import React from 'react';
import * as S from './MenuOption.styled';

// Jedna ponuđena opcija; `ghost` je skrivena opcija, `index` određuje redosled pojavljivanja.
export default function MenuOption({ index = 0, ghost = false, onClick, children }) {
  return (
    <S.Root type="button" $i={index} $ghost={ghost} onClick={onClick}>
      <span>{children}</span>
    </S.Root>
  );
}
