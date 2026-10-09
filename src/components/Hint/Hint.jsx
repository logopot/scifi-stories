import React from 'react';
import * as S from './Hint.styled';

export default function Hint({ onClick, children }) {
  return (
    <S.Root type="button" onClick={onClick}>
      {children}
    </S.Root>
  );
}
