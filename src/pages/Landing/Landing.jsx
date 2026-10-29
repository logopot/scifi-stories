import React from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import StoryCard from '../../components/StoryCard';
import Subtitle from '../../components/Subtitle';
import { useLang } from '../../i18n/useLocalePath';
import { storiesFor } from '../../stories';
import * as S from './Landing.styled';

export default function Landing() {
  const { t } = useTranslation();
  const lang = useLang();
  const list = storiesFor(lang);

  return (
    <Page variant="wide">
      <S.Intro>
        <Heading variant="title">{t('site.name')}</Heading>
        <Subtitle>{t('landing.subtitle')}</Subtitle>
      </S.Intro>
      {list.length === 0 && <Subtitle>{t('landing.empty')}</Subtitle>}
      <div className="row g-4">
        {list.map((entry, i) => (
          <div key={entry.slug} className="col-12 col-md-6 col-lg-4">
            <S.Slot>
              <StoryCard entry={entry} priority={i === 0} />
            </S.Slot>
          </div>
        ))}
      </div>
    </Page>
  );
}
