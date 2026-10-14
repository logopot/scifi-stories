import React from 'react';
import useMediaQuery from '../../hooks/useMediaQuery';
import * as S from './LogoMark.styled';

// Znak sajta kao SVG: velika planeta, nagnuta orbita (-15°) i mala planeta koja kruži po njoj. Dekorativan.
// Boje: CSS promenljive --logo-body, --logo-accent, --logo-gap (postavlja Logo iz tema: logoBody, logoAccent, logoGap).
// Geometrija je prepisana sa public/img/logo-512.png (viewBox 512 × 512), a ista statička verzija je public/img/logo.svg.
// Dubina: orbita je podeljena na zadnji luk (ispod velike planete) i prednji luk (iznad nje); mala planeta ima dva
// primerka (zadnji i prednji sloj) čija se vidljivost menja tačno na krajevima orbite, gde je izvan velike planete.
// Kretanje je SMIL animateMotion (radi u Chrome, Firefox i Safari), samo pomera po putanji (transform), bez rasporeda.
// Uz `prefers-reduced-motion` nema animacije: mala planeta stoji gore desno, kao u starom logou.
const CX = 256;
const CY = 250;
const A = 245; // velika poluosa orbite
const B = 72; // mala poluosa orbite
const TILT = -15;
const PLANET_R = 63;
const DURATION = '14s';
const REST_OFFSET = '-11.94s'; // početni položaj na orbiti blizu položaja iz starog logoa

const BIG = 'var(--logo-body)';
const ACCENT = 'var(--logo-accent)';
const GAP = 'var(--logo-gap)';

// Put u koordinatama orbite (centar u 0,0): prednja polovina (od desnog kraja kroz dno do levog), pa zadnja.
const FRONT = `M ${A} 0 A ${A} ${B} 0 0 1 ${-A} 0`;
const BACK = `M ${-A} 0 A ${A} ${B} 0 0 1 ${A} 0`;
const FULL = `${FRONT} A ${A} ${B} 0 0 1 ${A} 0`;

const orbit = { fill: 'none', stroke: ACCENT, strokeWidth: 7, strokeLinecap: 'round' };
const planet = { fill: ACCENT, stroke: GAP, strokeWidth: 12, paintOrder: 'stroke' };

function Moving({ show }) {
  // show: [vrednost u prvoj polovini ciklusa, vrednost u drugoj]
  return (
    <circle r={PLANET_R} style={planet} opacity={show[0]}>
      <animateMotion dur={DURATION} begin={REST_OFFSET} repeatCount="indefinite" path={FULL} calcMode="linear" />
      <animate
        attributeName="opacity"
        dur={DURATION}
        begin={REST_OFFSET}
        repeatCount="indefinite"
        calcMode="discrete"
        values={`${show[0]};${show[1]}`}
        keyTimes="0;0.5"
      />
    </circle>
  );
}

export default function LogoMark({ className }) {
  const still = useMediaQuery('(prefers-reduced-motion: reduce)');
  return (
    <S.Svg
      className={className}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`translate(${CX} ${CY}) rotate(${TILT})`}>
        <path d={BACK} style={orbit} />
        {!still && <Moving show={[0, 1]} />}
      </g>
      <circle cx="257" cy="260" r="139" style={{ fill: BIG }} />
      <g transform={`translate(${CX} ${CY}) rotate(${TILT})`}>
        <path d={FRONT} style={orbit} />
        {!still && <Moving show={[1, 0]} />}
      </g>
      {still && <circle cx="363" cy="177" r={PLANET_R} style={planet} />}
    </S.Svg>
  );
}
