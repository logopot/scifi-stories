import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './SiteFooter.styled';

export default function SiteFooter() {
  const { t } = useTranslation();
  return (
    <S.Bar>
      <div className="container">
        {t('site.name')} · {t('site.footer')}
      </div>
    </S.Bar>
  );
}
