import React, { useState } from 'react';
import * as S from './CardMedia.styled';

// Naslovna slika kartice (alt prazan: naslov kartice je ispisan u njoj). Ako se ne učita, ostaje gradijent teme.
export default function CardMedia({ src, position = 'center', soon = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <S.Root $soon={soon} aria-hidden="true">
      {src && !failed && (
        <S.Image
          src={`${import.meta.env.BASE_URL}${src}`}
          alt=""
          loading="lazy"
          $position={position}
          onError={() => setFailed(true)}
        />
      )}
    </S.Root>
  );
}
