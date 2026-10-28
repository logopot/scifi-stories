import React from 'react';
import { useTranslation } from 'react-i18next';
import SiteName from '../../../SiteName';
import * as S from './SiteFooter.styled';

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <S.Bar>
      <div className="container">
        <SiteName /> · {t('site.footer')}
      </div>
    </S.Bar>
  );
}
