import React from 'react';
import { tr } from '../../engine/engine';
import { useStory } from '../../engine/StoryContext';
import useScrollReset from '../../hooks/useScrollReset';
import Button from '../Button';
import Heading from '../Heading';
import PageBox from '../PageBox';
import Paragraph from '../Paragraph';
import SpeechPanel from '../SpeechPanel';
import * as S from './Mirror.styled';

// Završni ekran: samo kraj priče, bez brojeva i statistike. Izgled je isti kao stranice priče (SpeechPanel).
export default function Mirror({ ending, player, onRestart }) {
  const { story } = useStory();
  const { ui, endings } = story;
  const data = endings[ending];

  useScrollReset([]);

  return (
    <SpeechPanel
      resetKey="mirror"
      title={
        <>
          <S.Kicker>{ui.mirror.kicker}</S.Kicker>
          <Heading>{data.title}</Heading>
        </>
      }
    >
      <PageBox compact>
        {data.closing.map((t, i) => (
          <Paragraph key={i}>{tr(t, data.closingf && data.closingf[i], player)}</Paragraph>
        ))}

        <S.Actions>
          <Button onClick={onRestart}>{ui.mirror.restart}</Button>
        </S.Actions>
      </PageBox>
    </SpeechPanel>
  );
}
