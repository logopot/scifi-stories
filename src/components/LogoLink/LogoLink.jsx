import React from 'react';
import { useTranslation } from 'react-i18next';
import useLocalePath from '../../i18n/useLocalePath';
import Logo from '../Logo';
import * as S from './LogoLink.styled';

// Samo logo kao link na početnu stranu jezika (ime je u aria-label).
export default function LogoLink({ size = 'sm', variant = 'default', className }) {
  const { t } = useTranslation();
  const localePath = useLocalePath();
  return (
    <S.Root to={localePath()} aria-label={t('site.home', { name: t('site.name') })} className={className}>
      <Logo size={size} variant={variant} />
    </S.Root>
  );
}
