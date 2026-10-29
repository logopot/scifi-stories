import React from 'react';
import { useTheme } from 'styled-components';
import { between, flickerVars, spot, useRandom } from '../../../../styles/fxUtils';
import * as S from './Glow.styled';

// glow: { x, y, r, color?, flicker? (0–1, podrazumevano 0.3) }. r je poluprečnik u % širine slike.
export default function Glow({ x, y, r, color = 'fxWarm', flicker = 0.3 }) {
  const theme = useTheme();
  const vars = useRandom(() => flickerVars(flicker, between(3.5, 6.5)));
  return <S.Dot style={{ ...spot(x, y, r * 2), ...vars }} $color={theme[color]} />;
}
