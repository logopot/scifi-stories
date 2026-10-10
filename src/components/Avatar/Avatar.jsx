import React, { useState } from 'react';
import * as S from './Avatar.styled';

// Okrugla slika lika. Bez slike (ili ako se ne učita) prikazuje se prvo slovo imena u boji akcenta.
// `decorative`: ime je već ispisano pored, pa slika dobija prazan alt.
export default function Avatar({ name, image, decorative = false }) {
  const [failed, setFailed] = useState(false);
  const letter = [...(name || '?')][0];
  const showImage = image && image.src && !failed;
  return (
    <S.Root>
      {showImage ? (
        <img
          src={`${import.meta.env.BASE_URL}${image.src}`}
          alt={decorative ? '' : name}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{letter}</span>
      )}
    </S.Root>
  );
}
