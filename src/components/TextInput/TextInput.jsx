import React from 'react';
import * as S from './TextInput.styled';

export default function TextInput(props) {
  return <S.Root type="text" {...props} />;
}
