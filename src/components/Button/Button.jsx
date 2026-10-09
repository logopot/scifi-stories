import React from 'react';
import { Link } from 'react-router-dom';
import * as S from './Button.styled';

// variant: 'primary' | 'quiet'. Sa `to` postaje link (react-router), inače je <button>.
export default function Button({ variant = 'primary', to, type = 'button', children, ...rest }) {
  if (to) {
    return (
      <S.Root as={Link} to={to} $variant={variant} {...rest}>
        {children}
      </S.Root>
    );
  }
  return (
    <S.Root type={type} $variant={variant} {...rest}>
      {children}
    </S.Root>
  );
}
