import React, { useEffect, useRef, useState } from 'react';
import SceneFx from '../SceneFx';
import * as S from './SceneBackdrop.styled';

const FADE_MS = 1000; // malo duže od prelaza, pa se prethodna slika uklanja tek kad nova potpuno pokrije

// Slika mesta iza strane. U DOM-u su najviše dve slike (nova i ona koja nestaje).
// Slika koja se ne učita se odmah uklanja, pa nema ikone pokvarene slike: ostaje pozadina teme.
// fx (opciono): efekti preko slike, images[id].fx (vidi stories/fx.js); crtaju se tek kad je slika učitana (treba njena veličina).
export default function SceneBackdrop({ src, fx }) {
  const seq = useRef(0);
  const [layers, setLayers] = useState(() => (src ? [{ id: 0, src, fx, t0: performance.now() }] : []));

  useEffect(() => {
    if (!src) return;
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.src === src) return prev;
      seq.current += 1;
      return [...prev.slice(-1), { id: seq.current, src, fx, t0: performance.now() }];
    });
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (layers.length < 2) return undefined;
    const t = setTimeout(() => setLayers((prev) => prev.slice(-1)), FADE_MS);
    return () => clearTimeout(t);
  }, [layers]);

  const drop = (id) => setLayers((prev) => prev.filter((l) => l.id !== id));
  const loaded = (id, img) => setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, size: { w: img.naturalWidth, h: img.naturalHeight } } : l)));

  return (
    <S.Root aria-hidden="true">
      {layers.map((l) => (
        <S.Layer key={l.id}>
          <img src={`${import.meta.env.BASE_URL}${l.src}`} alt="" decoding="async" onError={() => drop(l.id)} onLoad={(e) => loaded(l.id, e.currentTarget)} />
          {l.fx && l.fx.length > 0 && l.size && <SceneFx fx={l.fx} imgSize={l.size} startedAt={l.t0} />}
        </S.Layer>
      ))}
      <S.Shade />
    </S.Root>
  );
}
