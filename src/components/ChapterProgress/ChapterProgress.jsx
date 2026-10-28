import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import { useStory } from '../../engine/StoryContext';
import { chapterIds, createTracker } from '../../engine/chapterProgress';
import useMediaQuery from '../../hooks/useMediaQuery';
import OnImage from '../OnImage';
import * as S from './ChapterProgress.styled';

// Napredak po poglavljima: tanka linija pri dnu ekrana, jedan segment po poglavlju, bez teksta.
// Prošla poglavlja su puna, tekuće se puni po stranama (vidi engine/chapterProgress.js), ostala su prazna.
// Ne prikazuje se kad priča ima manje od dva poglavlja ili se napredak ne može odrediti (bez greške).
const trackers = new Map(); // po priči, da popuna ne opada pri prelasku među scenama

export default function ChapterProgress({ nodeId, picks = [], player, page = 0, pagesCount = 1, done = false }) {
  const { story, engine } = useStory();
  const slug = engine.saveId; // po jeziku, da se popuna srpske i engleske verzije ne mešaju
  const { t } = useTranslation();
  const theme = useTheme();
  const onPanel = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const ids = chapterIds(story);
  const info = useMemo(() => {
    if (ids.length < 2) return null;
    if (done) return { index: ids.length, total: ids.length, value: 1, done: true };
    if (!trackers.has(slug)) trackers.set(slug, createTracker());
    try {
      return trackers.get(slug).update({ story, engine, slug, nodeId, picks, player, page, pagesCount });
    } catch {
      return null;
    }
  }, [story, engine, slug, nodeId, picks, player, page, pagesCount, done]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!info) return null;
  return (
    <OnImage active={onPanel}>
      <S.Strip>
        <S.Root
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={info.total}
          aria-valuenow={info.index}
          aria-label={t('progress.label', { index: info.index, total: info.total })}
        >
          {ids.map((id, i) => {
            const fill = info.done || i + 1 < info.index ? 1 : i + 1 === info.index ? info.value : 0;
            return (
              <S.Segment key={id}>
                <S.Fill style={{ transform: `scaleX(${fill})` }} />
              </S.Segment>
            );
          })}
        </S.Root>
      </S.Strip>
    </OnImage>
  );
}
