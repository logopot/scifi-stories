import React, { useState } from 'react';
import * as S from './Figure.styled';

// Slika se prikazuje samo ako fajl postoji; ako ga nema, strana izgleda kao i bez slike.
// image: { src, alt, kind, caption } iz `images` u story.json; variant: 'place' | 'portrait'.
export default function Figure({ image, variant = 'place' }) {
  const [ok, setOk] = useState(true);
  if (!image || !ok) return null;
  return (
    <S.Root $variant={variant}>
      <img
        src={`${import.meta.env.BASE_URL}${image.src}`}
        alt={image.alt || ''}
        loading="lazy"
        onError={() => setOk(false)}
      />
      {image.kind === 'portrait' && image.caption && <figcaption>{image.caption}</figcaption>}
    </S.Root>
  );
}
