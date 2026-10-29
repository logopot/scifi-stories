import React from 'react';
import { useTheme } from 'styled-components';
import { between, flickerVars, spot, useRandom } from '../../../../styles/fxUtils';
import * as S from './Fire.styled';

const SPARKS = 5;

// fire: { x, y, r, color? }. Jače, nepravilno treperenje, "disanje" oblika i povremene iskre koje se dižu.
export default function Fire({ x, y, r, color = 'fxWarm' }) {
  const theme = useTheme();
  const vars = useRandom(() => flickerVars(0.55, between(1.6, 2.6)));
  const coreVars = useRandom(() => flickerVars(0.4, between(1.2, 2)));
  const sparks = useRandom(() =>
    Array.from({ length: SPARKS }, () => {
      const dur = between(2, 4);
      return { '--dur': `${dur}s`, '--delay': `-${between(0, dur)}s`, '--dx': `${between(-900, 900)}%`, '--dy': `${between(-2600, -1400)}%` };
    })
  );
  return (
    <>
      <S.Outer style={{ ...spot(x, y, r * 2), ...vars }} $color={theme[color]} />
      <S.Core style={{ ...spot(x, y, r * 0.9), ...coreVars }} $color={theme.fxSun} />
      {sparks.map((s, i) => (
        <S.Spark key={i} style={{ left: `${x}%`, top: `${y}%`, ...s }} $color={theme.fxSun} />
      ))}
    </>
  );
}
