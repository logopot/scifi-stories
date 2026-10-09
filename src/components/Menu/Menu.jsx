import React from 'react';
import * as S from './Menu.styled';

// Okvir za rečenicu iznad opcija i same opcije.
export default function Menu({ onClick, children }) {
  return <S.Root onClick={onClick}>{children}</S.Root>;
}
