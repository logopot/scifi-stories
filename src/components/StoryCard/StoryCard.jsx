import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { Link } from 'react-router-dom';
import { hasSave } from '../../engine/storage';
import { metaLine } from '../../stories/format';
import { getTheme } from '../../styles/themes';
import Badge from '../Badge';
import Cover from '../Cover';
import * as S from './StoryCard.styled';

// Kartica priče, iscrtana u temi te priče (ugnježdeni ThemeProvider). Cela kartica je link;
// priče sa status 'soon' su prigušene i nisu otvorive.
export default function StoryCard({ entry }) {
  const theme = useMemo(() => getTheme(entry.slug), [entry.slug]);
  const soon = entry.status === 'soon';
  const saved = !soon && hasSave(entry.slug);

  return (
    <ThemeProvider theme={theme}>
      <S.Card as={soon ? 'div' : Link} to={soon ? undefined : `/${entry.slug}`} $soon={soon}>
        <Cover src={entry.cover} alt={entry.coverAlt}>
          {(soon || saved) && (
            <S.BadgeSlot>
              <Badge variant={soon ? 'muted' : 'accent'}>{soon ? 'Uskoro' : 'Nastavi'}</Badge>
            </S.BadgeSlot>
          )}
        </Cover>
        <S.Body>
          <S.Title>{entry.title}</S.Title>
          <S.Tagline>{entry.tagline}</S.Tagline>
          <S.Spacer />
          <S.Meta>{metaLine(entry)}</S.Meta>
          {!soon && <S.Cta aria-hidden="true">Otvori</S.Cta>}
        </S.Body>
      </S.Card>
    </ThemeProvider>
  );
}
