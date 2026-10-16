import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import OnImage from '../OnImage';
import * as S from './SpeechPanel.styled';

// Panel sa tekstom strane. Od md: pri dnu ekrana (tamna staklasta ploča); na telefonu: običan tok ispod slike.
// Govornici strane (`speakers`: do dva, { side: 'left' | 'right', portrait }) staju uz ploču: lik koji nije čitalac levo,
// čitalac desno; kad govore oba, vide se oba portreta. `name` je ime u zaglavlju, uz portret na strani `nameSide`.
// Lik bez slike (ili slika koja se ne učita) ostaje samo ime. `resetKey` vraća unutrašnji skrol na vrh.
// `title` (naslov početnog i završnog ekrana) na telefonu stoji preko donjeg dela slike, na ploči je prvi u tekstu.
// `columns` (početni ekran): od md je ploča mreža sa dve kolone; naslov je u prvoj, a deca (display: contents) u mreži.
export default function SpeechPanel({ name, nameSide = 'left', speakers = [], resetKey, title, columns = false, children }) {
  const theme = useTheme();
  // Od md tekst stoji na tamnoj ploči preko slike; na telefonu na pozadini teme.
  const onPanel = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const [failed, setFailed] = useState([]);
  const scroll = useRef(null);
  const shown = speakers.filter((s) => s.portrait && !failed.includes(s.portrait));
  const hasPortrait = shown.length > 0;
  const both = shown.length > 1;
  const left = shown.some((s) => s.side === 'left');
  const right = shown.some((s) => s.side === 'right');
  const nameBeside = shown.some((s) => s.side === nameSide);

  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = 0;
  }, [resetKey]);

  return (
    <OnImage active={onPanel}>
      <S.Root $portrait={hasPortrait} data-scene-panel>
        {shown.map((s) => (
          <S.Portrait key={s.portrait} $right={s.side === 'right'} $both={both}>
            <img
              src={`${import.meta.env.BASE_URL}${s.portrait}`}
              alt=""
              onError={() => setFailed((f) => [...f, s.portrait])}
            />
          </S.Portrait>
        ))}
        <S.Scroll ref={scroll} $left={left} $right={right} $both={both}>
          <S.Inner $columns={columns}>
            {title && (
              <OnImage>
                <S.Title>{title}</S.Title>
              </OnImage>
            )}
            {name && (
              <S.Head $portrait={nameBeside} $right={nameSide === 'right'} $both={both}>
                <S.Name $portrait={nameBeside} $right={nameSide === 'right'} $both={both}>
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
