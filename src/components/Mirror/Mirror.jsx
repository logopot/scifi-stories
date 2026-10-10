import React from 'react';
import { tr } from '../../engine/engine';
import { useStory } from '../../engine/StoryContext';
import useScrollReset from '../../hooks/useScrollReset';
import Button from '../Button';
import ChapterMark from '../ChapterMark';
import Heading from '../Heading';
import PageBox from '../PageBox';
import Paragraph from '../Paragraph';
import * as S from './Mirror.styled';

// Završni ekran: samo kraj priče, bez brojeva i statistike.
export default function Mirror({ ending, player, onRestart }) {
  const { story } = useStory();
  const { ui, endings } = story;
  const data = endings[ending];

  useScrollReset([]);

  return (
    <PageBox>
      <ChapterMark>{ui.mirror.kicker}</ChapterMark>
      <Heading>{data.title}</Heading>

      {data.closing.map((t, i) => (
        <Paragraph key={i}>{tr(t, data.closingf && data.closingf[i], player)}</Paragraph>
      ))}

      <S.Actions>
        <Button onClick={onRestart}>{ui.mirror.restart}</Button>
      </S.Actions>
    </PageBox>
  );
}
