import React, { useEffect, useRef, useState } from 'react';
import * as S from './SceneBackdrop.styled';

const FADE_MS = 1000; // malo duže od prelaza, pa se prethodna slika uklanja tek kad nova potpuno pokrije

// Slika mesta iza strane. U DOM-u su najviše dve slike (nova i ona koja nestaje).
// Slika koja se ne učita se odmah uklanja, pa nema ikone pokvarene slike: ostaje pozadina teme.
export default function SceneBackdrop({ src }) {
  const seq = useRef(0);
  const [layers, setLayers] = useState(() => (src ? [{ id: 0, src }] : []));

  useEffect(() => {
    if (!src) return;
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top && top.src === src) return prev;
      seq.current += 1;
      return [...prev.slice(-1), { id: seq.current, src }];
    });
  }, [src]);

  useEffect(() => {
    if (layers.length < 2) return undefined;
    const t = setTimeout(() => setLayers((prev) => prev.slice(-1)), FADE_MS);
    return () => clearTimeout(t);
  }, [layers]);

  const drop = (id) => setLayers((prev) => prev.filter((l) => l.id !== id));

  return (
    <S.Root aria-hidden="true">
      {layers.map((l) => (
        <S.Layer key={l.id}>
          <img src={`${import.meta.env.BASE_URL}${l.src}`} alt="" decoding="async" onError={() => drop(l.id)} />
        </S.Layer>
      ))}
      <S.Shade />
    </S.Root>
  );
}
