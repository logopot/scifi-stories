import React from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './SiteName.styled';

// Naziv sajta: pun naziv kad stane, na užim ekranima kratak (site.shortName). Pun naziv ostaje dostupan čitaču ekrana.
// `collapse`: na najužim ekranima ne prikazuje ništa (zaglavlje: ostaju logo i prekidač jezika; naziv je u aria-label linka).
export default function SiteName({ collapse = false, className }) {
  const { t } = useTranslation();
  return (
    <S.Root className={className}>
      <S.Full>{t('site.name')}</S.Full>
      <S.Short $collapse={collapse} aria-hidden="true">
        {t('site.shortName')}
      </S.Short>
    </S.Root>
  );
}
