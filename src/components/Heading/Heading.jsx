import React from 'react';
import * as S from './Heading.styled';

// variant 'title' = veliki naslov (h1 po podrazumevanju), 'section' = naslov odeljka (h2).
export default function Heading({ variant = 'section', as, children, ...rest }) {
  const tag = as || (variant === 'title' ? 'h1' : 'h2');
  return (
    <S.Root as={tag} $variant={variant} {...rest}>
      {children}
    </S.Root>
  );
}
