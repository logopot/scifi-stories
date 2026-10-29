import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import { coverRect, parseFocus } from '../../../../styles/fxSignals';
import Fire from '../Fire';
import Glow from '../Glow';
import Mist from '../Mist';
import Particles from '../Particles';
import Smoke from '../Smoke';
import Sun from '../Sun';
import Twinkle from '../Twinkle';
import * as S from './LegacyFx.styled';

const PARTICLE_TYPES = ['snow', 'dust', 'rain'];

// STARI izgled efekata (DOM + CSS animacije), zadržan samo kao referenca za poređenje u /dev/fx ("stari / novi izgled").
// Učitava se lenjo i samo u razvoju (vidi SceneFx.jsx); u produkcionom build-u ga nema.
export default function LegacyFx({ fx, imgSize, focus, startedAt, still = false }) {
  const theme = useTheme();
  const desktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const rootRef = useRef(null);
  const [box, setBox] = useState(null);
  const driftDelay = useRef(startedAt ? -(performance.now() - startedAt) / 1000 : 0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const read = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rect =
    box && imgSize && box.w && box.h
      ? coverRect(box.w, box.h, imgSize.w, imgSize.h, parseFocus(focus || (desktop ? theme.sizes.sceneFocusDesktop : theme.sizes.sceneFocusMobile)))
      : null;
  const lights = (fx || []).filter((e) => !PARTICLE_TYPES.includes(e.type));
  const particles = (fx || []).filter((e) => PARTICLE_TYPES.includes(e.type));

  return (
    <S.Root ref={rootRef} aria-hidden="true">
      {rect && (
        <S.Drift style={still ? { animation: 'none' } : { animationDelay: `${driftDelay.current}s` }}>
          <S.Rect style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}>
            {lights.map((e, i) => {
              const { type, ...p } = e;
              if (type === 'glow') return <Glow key={i} {...p} />;
              if (type === 'fire') return <Fire key={i} {...p} />;
              if (type === 'sun') return <Sun key={i} {...p} />;
              if (type === 'smoke') return <Smoke key={i} {...p} />;
              if (type === 'twinkle') return <Twinkle key={i} {...p} />;
              if (type === 'mist') return <Mist key={i} {...p} />;
              return null;
            })}
          </S.Rect>
        </S.Drift>
      )}
      {particles.length > 0 && <Particles items={particles} />}
    </S.Root>
  );
}
