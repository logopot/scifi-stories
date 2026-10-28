import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLang } from '../../../../i18n/useLocalePath';
import { legalPages, legalPath } from '../../../../legalPages';
import TextLink from '../../../TextLink';
import * as S from './SiteFooter.styled';

export default function SiteFooter() {
  const { t } = useTranslation();
  const lang = useLang();
  return (
    <S.Bar>
      <div className="container">
        <S.Line>
          {t('site.name')} · {t('site.footer')}
        </S.Line>
        <S.Links aria-label={t('legal.label')}>
          {legalPages.map((page) => (
            <TextLink key={page.key} to={legalPath(lang, page)}>
              {t(`legal.${page.key}`)}
            </TextLink>
          ))}
        </S.Links>
      </div>
    </S.Bar>
  );
}
