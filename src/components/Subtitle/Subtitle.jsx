import React from 'react';
import * as S from './Subtitle.styled';

export default function Subtitle({ children, ...rest }) {
  return <S.Root {...rest}>{children}</S.Root>;
}
