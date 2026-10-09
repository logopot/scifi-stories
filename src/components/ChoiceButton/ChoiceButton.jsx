import React from 'react';
import * as S from './ChoiceButton.styled';

// Dugme-izbor sa radio ponašanjem (jedan od nekoliko).
export default function ChoiceButton({ selected, onClick, children }) {
  return (
    <S.Root type="button" role="radio" aria-checked={selected} $on={selected} onClick={onClick}>
      {children}
    </S.Root>
  );
}
