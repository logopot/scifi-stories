import React from 'react';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import StoryCard from '../../components/StoryCard';
import Subtitle from '../../components/Subtitle';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import { stories } from '../../stories';
import * as S from './Landing.styled';

const SUBTITLE = 'Kratke interaktivne naučnofantastične priče. Ti si glavni lik.';

export default function Landing() {
  useDocumentMeta('Scifi priče', SUBTITLE);

  return (
    <Page variant="wide">
      <S.Intro>
        <Heading variant="title">Scifi priče</Heading>
        <Subtitle>{SUBTITLE}</Subtitle>
      </S.Intro>
      <div className="row g-4">
        {stories.map((entry) => (
          <div key={entry.slug} className="col-12 col-md-6 col-lg-4">
            <StoryCard entry={entry} />
          </div>
        ))}
      </div>
    </Page>
  );
}
