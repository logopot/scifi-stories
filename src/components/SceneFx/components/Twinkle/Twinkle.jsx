import React from 'react';
import { useTheme } from 'styled-components';
import { between, spot, useRandom } from '../../../../styles/fxUtils';
import * as S from './Twinkle.styled';

// twinkle: { points: [[x, y], ...], color?, r? }. Svaka tačka titra svojim ritmom (r = prečnik tačke u % širine slike).
export default function Twinkle({ points, color = 'fxWarm', r = 1.4 }) {
  const theme = useTheme();
  const vars = useRandom(() =>
    points.map(() => {
      const dur = between(2, 6);
      return { '--dur': `${dur}s`, '--delay': `-${between(0, dur)}s` };
    })
  );
  return points.map(([x, y], i) => <S.Dot key={i} style={{ ...spot(x, y, r), ...(vars[i] || vars[0]) }} $color={theme[color]} />);
}
