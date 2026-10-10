import React from 'react';
import * as S from './Menu.styled';

// Okvir za rečenicu iznad opcija i same opcije.
export default function Menu({ children }) {
  return <S.Root>{children}</S.Root>;
}
