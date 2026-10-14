import React from 'react';
import Speaker from '../Speaker';
import * as S from './Paragraph.styled';

// Pasus proze; `who` je ime govornika (sa licem `image`) koji se prikazuje uz repliku.
// `nameOnly`: samo red sa imenom (strana već ima veliki portret tog lika ili isti lik govori uzastopno).
export default function Paragraph({ who, image, reader = false, follow = false, nameOnly = false, children }) {
  return (
    <S.Root>
      {who ? (
        <Speaker name={who} image={image} reader={reader} follow={follow} nameOnly={nameOnly}>
          <S.Text>{children}</S.Text>
        </Speaker>
      ) : (
        <S.Text>{children}</S.Text>
      )}
    </S.Root>
  );
}
