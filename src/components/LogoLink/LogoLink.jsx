import React from 'react';
import { SITE_NAME } from '../../config';
import Logo from '../Logo';
import * as S from './LogoLink.styled';

// Samo logo kao link na početnu stranu (ime je u aria-label).
export default function LogoLink({ size = 'sm', variant = 'default', className }) {
  return (
    <S.Root to="/" aria-label={`${SITE_NAME}, početna`} className={className}>
      <Logo size={size} variant={variant} />
    </S.Root>
  );
}
