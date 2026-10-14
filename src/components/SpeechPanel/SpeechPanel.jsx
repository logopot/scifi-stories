import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import OnImage from '../OnImage';
import * as S from './SpeechPanel.styled';

// Panel sa tekstom strane. Od md: pri dnu ekrana (tamna staklasta ploča); na telefonu: običan tok ispod slike.
// Govornik prve replike (`name`) staje uz panel: lik levo, čitalac (`side="right"`) desno.
// Lik bez slike (ili slika koja se ne učita) ostaje samo ime. `resetKey` vraća unutrašnji skrol na vrh.
// `title` (naslov početnog i završnog ekrana) na telefonu stoji preko donjeg dela slike, na ploči je prvi u tekstu.
// `columns` (početni ekran): od md je ploča mreža sa dve kolone; naslov je u prvoj, a deca (display: contents) u mreži.
export default function SpeechPanel({ name, portrait, side = 'left', resetKey, title, columns = false, children }) {
  const theme = useTheme();
  // Od md tekst stoji na tamnoj ploči preko slike; na telefonu na pozadini teme.
  const onPanel = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const [failed, setFailed] = useState(null);
  const scroll = useRef(null);
  const hasPortrait = Boolean(portrait) && failed !== portrait;
  const right = side === 'right';

  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [resetKey]);

  return (
    <OnImage active={onPanel}>
      <S.Root $portrait={hasPortrait} $right={right} data-scene-panel>
        {hasPortrait && (
          <S.Portrait key={portrait} $right={right}>
            <img src={`${import.meta.env.BASE_URL}${portrait}`} alt="" onError={() => setFailed(portrait)} />
          </S.Portrait>
        )}
        <S.Scroll ref={scroll} $portrait={hasPortrait} $right={right}>
          <S.Inner $columns={columns}>
            {title && (
              <OnImage>
                <S.Title>{title}</S.Title>
              </OnImage>
            )}
            {name && (
              <S.Head $portrait={hasPortrait} $right={right}>
                <S.Name $portrait={hasPortrait} $right={right}>
                  {name}
                </S.Name>
              </S.Head>
            )}
            {children}
          </S.Inner>
        </S.Scroll>
      </S.Root>
    </OnImage>
  );
}
