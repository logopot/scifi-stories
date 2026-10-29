import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../hooks/useMediaQuery';
import Fire from './components/Fire';
import Glow from './components/Glow';
import Mist from './components/Mist';
import Particles from './components/Particles';
import Smoke from './components/Smoke';
import Sun from './components/Sun';
import Twinkle from './components/Twinkle';
import * as S from './SceneFx.styled';

const PARTICLE_TYPES = ['snow', 'dust', 'rain'];

// 'center 55%' → [0.5, 0.55] (object-position kao razlomci)
const parseFocus = (value) => {
  const [x = 'center', y = 'center'] = String(value).trim().split(/\s+/);
  const f = (v) => (v === 'center' ? 0.5 : v === 'left' || v === 'top' ? 0 : v === 'right' || v === 'bottom' ? 1 : parseFloat(v) / 100);
  return [f(x), f(y)];
};

// Pravougaonik koji slika (iw × ih) zauzima u kontejneru (cw × ch) uz cover i object-position.
export const coverRect = (cw, ch, iw, ih, [px, py]) => {
  const scale = Math.max(cw / iw, ch / ih);
  const w = iw * scale;
  const h = ih * scale;
  return { left: (cw - w) * px, top: (ch - h) * py, width: w, height: h };
};

// Efekti preko slike mesta (images[id].fx, vidi stories/fx.js). Zauzima ceo sloj slike (inset 0); koordinate efekata su
// procenti SLIKE. startedAt je trenutak (performance.now) kad je sloj slike montiran. imgSize je prirodna veličina slike; still isključuje drift (razvojni alat); focus (opciono) prepisuje object-position (razvojni alat).
export default function SceneFx({ fx, imgSize, focus, startedAt, still = false }) {
  const theme = useTheme();
  const desktop = useMediaQuery(`(min-width: ${theme.breakpoints.md})`);
  const rootRef = useRef(null);
  const [box, setBox] = useState(null);
  // drift slike počinje kad se sloj montira, a efekti tek kad se slika učita: pomeraj faze da se kreću zajedno
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
