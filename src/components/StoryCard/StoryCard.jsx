import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { hasSave, saveId } from '../../engine/storage';
import useLocalePath, { useLang } from '../../i18n/useLocalePath';
import { metaLine } from '../../stories/format';
import { getTheme } from '../../styles/themes';
import Badge from '../Badge';
import CardMedia from './components/CardMedia';
import * as S from './StoryCard.styled';

// Plakat-kartica: slika preko cele kartice, naslov gore, podaci i krug sa strelicom dole, sve u temi te priče
// (ugnježdeni ThemeProvider). Cela kartica je link; priče sa status 'soon' su prigušene i nisu otvorive.
export default function StoryCard({ entry, priority = false }) {
  const { t } = useTranslation();
  const lang = useLang();
  const localePath = useLocalePath();
  const theme = useMemo(() => getTheme(entry.slug), [entry.slug]);
  const soon = entry.status === 'soon';
  const saved = !soon && hasSave(saveId(entry.slug, lang));
  const badge = soon || saved;

  const linkProps = soon
    ? { as: 'div', 'aria-disabled': 'true' }
    : { as: Link, to: localePath(entry.slug), 'aria-label': t('card.open', { title: entry.title }) };

  return (
    <ThemeProvider theme={theme}>
      <S.Card $soon={soon} {...linkProps}>
        <CardMedia src={entry.cover} alt={entry.coverAlt} position={entry.coverPosition || 'center'} soon={soon} priority={priority} />
        <S.ScrimTop />
        <S.ScrimBottom />
        <S.Top $badge={badge}>
          <S.Title>{entry.title}</S.Title>
          <S.Tagline>{entry.tagline}</S.Tagline>
        </S.Top>
        {badge && (
          <S.BadgeSlot>
            <Badge variant={soon ? 'muted' : 'accent'}>{soon ? t('card.soon') : t('card.continue')}</Badge>
          </S.BadgeSlot>
        )}
        <S.Bottom>
          <S.Meta>{metaLine(entry, t)}</S.Meta>
          {!soon && (
            <S.Circle aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </S.Circle>
          )}
        </S.Bottom>
      </S.Card>
    </ThemeProvider>
  );
}
