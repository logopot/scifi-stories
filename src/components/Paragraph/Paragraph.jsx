import React from 'react';
import SpeakerHeader from '../SpeakerHeader';
import * as S from './Paragraph.styled';

// Pasus proze; `who` je ime govornika (sa licem `image`) koje se prikazuje iznad replike.
export default function Paragraph({ who, image, showAvatar = true, children }) {
  return (
    <S.Root>
      {who && <SpeakerHeader name={who} image={image} showAvatar={showAvatar} />}
      {children}
    </S.Root>
  );
}
