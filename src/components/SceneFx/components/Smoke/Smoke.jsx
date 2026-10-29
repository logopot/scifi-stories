import React from 'react';
import { useTheme } from 'styled-components';
import { between, useRandom } from '../../../../styles/fxUtils';
import * as S from './Smoke.styled';

const PUFFS = 3;

// smoke: { x, y, w, color? }. w je širina izvora u % širine slike; dim se kreće polako naviše uz nestajanje.
export default function Smoke({ x, y, w, color = 'fxCold' }) {
  const theme = useTheme();
  const puffs = useRandom(() => {
    const dur = between(9, 13);
    return Array.from({ length: PUFFS }, (_, i) => ({ '--dur': `${dur}s`, '--delay': `-${(dur / PUFFS) * i + between(0, 1.5)}s` }));
  });
  return puffs.map((vars, i) => <S.Puff key={i} style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, ...vars }} $color={theme[color]} />);
}
