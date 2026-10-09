import React, { useEffect } from 'react';
import story, { tr } from '../engine/engine';
import { ChapterMark, Heading, PageBox, Paragraph, Primary } from './ui';

// Završni ekran: samo kraj priče, bez brojeva i statistike.
export default function Mirror({ ending, player, onRestart }) {
  const { ui, endings } = story;
  const data = endings[ending];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <PageBox>
      <ChapterMark>{ui.mirror.kicker}</ChapterMark>
      <Heading>{data.title}</Heading>

      {data.closing.map((t, i) => (
        <Paragraph key={i}>{tr(t, data.closingf && data.closingf[i], player)}</Paragraph>
      ))}

      <div className="mt-5">
        <Primary type="button" onClick={onRestart}>{ui.mirror.restart}</Primary>
      </div>
    </PageBox>
  );
}
