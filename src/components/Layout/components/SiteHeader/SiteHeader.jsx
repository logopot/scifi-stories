import React from 'react';
import { useTranslation } from 'react-i18next';
import useLocalePath from '../../../../i18n/useLocalePath';
import LangSwitch from '../../../LangSwitch';
import Logo from '../../../Logo';
import SiteName from '../../../SiteName';
import * as S from './SiteHeader.styled';

export default function SiteHeader() {
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const name = t('site.name');
  return (
    <S.Bar>
      <S.Skip href="#sadrzaj">{t('site.skip')}</S.Skip>
      <S.Row className="container">
        <S.Brand to={localePath()} aria-label={t('site.home', { name })}>
          <Logo size="lg" />
          <S.BrandName>
            <SiteName collapse />
          </S.BrandName>
        </S.Brand>
        <LangSwitch />
      </S.Row>
    </S.Bar>
  );
}
