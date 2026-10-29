import React from 'react';
import { useTheme } from 'styled-components';
import { between, useRandom } from '../../../../styles/fxUtils';
import * as S from './Mist.styled';

const BANDS = [
  { top: 50, opacity: 0.16 },
  { top: 64, opacity: 0.12 },
  { top: 76, opacity: 0.15 },
];

// mist: { color? }. Bez koordinata: pramenovi u donjoj polovini slike.
export default function Mist({ color = 'fxCold' }) {
  const theme = useTheme();
  const vars = useRandom(() =>
    BANDS.map(() => {
      const dur = between(40, 70);
      return { '--dur': `${dur}s`, '--delay': `-${between(0, dur)}s` };
    })
  );
  return BANDS.map((b, i) => <S.Band key={i} style={{ top: `${b.top}%`, opacity: b.opacity, ...vars[i] }} $color={theme[color]} />);
}
