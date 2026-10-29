import React, { useState } from 'react';
import { COVER_SIZE } from '../../../../config';
import * as S from './CardMedia.styled';

// Naslovna slika kartice (sakrivena od čitača ekrana: kartica ima svoj naziv; alt služi pretraživačima). Ako se ne učita, ostaje gradijent teme.
// width/height su stvarne mere naslovnih slika (COVER_SIZE), prva kartica se ne učitava lenjo.
export default function CardMedia({ src, alt = '', position = 'center', soon = false, priority = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <S.Root $soon={soon} aria-hidden="true">
      {src && !failed && (
        <S.Image
          src={`${import.meta.env.BASE_URL}${src}`}
          alt={alt}
          width={COVER_SIZE.width}
          height={COVER_SIZE.height}
          loading={priority ? 'eager' : 'lazy'}
          $position={position}
          onError={() => setFailed(true)}
        />
      )}
    </S.Root>
  );
}
