import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import { createFxEngine } from '../../styles/fxEngine';
import * as S from './SceneFx.styled';

// Stari izgled (CSS animacije) postoji samo u razvoju, za poređenje u /dev/fx; u produkciji se ne uključuje u build.
const LegacyFx = import.meta.env.DEV ? lazy(() => import('./components/LegacyFx')) : null;

// Efekti preko slike mesta (images[id].fx, vidi stories/fx.js). Dva canvasa preko slike (svetlo sa screen mešanjem, materija),
// jedna rAF petlja; koordinate efekata su procenti SLIKE. imgSize je prirodna veličina slike, focus (opciono) prepisuje
// object-position (razvojni alat). Pomeranje (drift) se čita iz susedne <img>, pa efekti prate sliku. look="old": stari izgled (samo razvoj).
export default function SceneFx({ fx, imgSize, focus, startedAt, still = false, look = 'new', onEngine }) {
  const theme = useTheme();
  const desktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const phone = useMediaQuery('(max-width: 767px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const rootRef = useRef(null);
  const lightRef = useRef(null);
  const matterRef = useRef(null);
  const focusValue = focus || (desktop ? theme.sizes.sceneFocusDesktop : theme.sizes.sceneFocusMobile);
  const fxKey = JSON.stringify(fx);
  const old = import.meta.env.DEV && look === 'old';

  useEffect(() => {
    if (old || !imgSize || !fx || !fx.length) return undefined;
    const engine = createFxEngine({ light: lightRef.current, matter: matterRef.current, root: rootRef.current, fx, theme, phone, reduced, imgSize, focus: focusValue });
    if (onEngine) onEngine(engine);
    return () => engine.destroy();
  }, [fxKey, theme, phone, reduced, imgSize, focusValue, old]); // eslint-disable-line react-hooks/exhaustive-deps

  if (old) {
    return (
      <Suspense fallback={null}>
        <LegacyFx fx={fx} imgSize={imgSize} focus={focus} startedAt={startedAt} still={still} />
      </Suspense>
    );
  }
  return (
    <S.Root ref={rootRef} aria-hidden="true">
      <S.Light ref={lightRef} />
      <S.Matter ref={matterRef} />
    </S.Root>
  );
}
