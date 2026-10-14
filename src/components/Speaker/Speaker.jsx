import React, { useState } from 'react';
import * as S from './Speaker.styled';

// Govornik: veliki portret (baner na telefonu, kolona na većim ekranima) + ime + replika.
// Tri izgleda: 'portrait' (slika postoji), 'plaque' (bez slike ili se nije učitala: ime sa trakom),
// 'name' (strana već prikazuje veliki portret tog lika ili isti lik govori uzastopno: samo red sa imenom).
// `reader`: na širokom ekranu portrait ide desno, pa se razgovor vidljivo smenjuje levo/desno.
export default function Speaker({ name, image, reader = false, follow = false, nameOnly = false, children }) {
  const [failed, setFailed] = useState(false);
  const hasImage = Boolean(image && image.src) && !failed;
  const mode = nameOnly ? 'name' : hasImage ? 'portrait' : 'plaque';
  return (
    <S.Root $mode={mode} $reader={reader} $follow={follow} data-speaker={name} data-mode={mode}>
      {mode === 'portrait' && (
        <S.Picture $reader={reader} $follow={follow}>
          <img src={`${import.meta.env.BASE_URL}${image.src}`} alt="" onError={() => setFailed(true)} />
        </S.Picture>
      )}
      <S.Name $mode={mode}>{name}</S.Name>
      <S.Speech $mode={mode}>{children}</S.Speech>
    </S.Root>
  );
}
