import React from 'react';
import { useTheme } from 'styled-components';
import { between, spot, useRandom } from '../../../../styles/fxUtils';
import * as S from './Sun.styled';

// sun: { x, y, r, color?, rays? }. Veliki mek sjaj koji se vrlo sporo menja (period 8–14 s).
export default function Sun({ x, y, r, color = 'fxSun', rays = false }) {
  const theme = useTheme();
  const vars = useRandom(() => {
    const dur = between(8, 14);
    return { '--dur': `${dur}s`, '--delay': `-${between(0, dur)}s` };
  });
  return (
    <>
      {rays && <S.Rays style={spot(x, y, r * 4)} $color={theme[color]} />}
      <S.Disc style={{ ...spot(x, y, r * 2), ...vars }} $color={theme[color]} />
    </>
  );
}
