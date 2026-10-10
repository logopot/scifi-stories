import React from 'react';
import Avatar from '../Avatar';
import * as S from './SpeakerHeader.styled';

// Ime govornika sa licem pored njega. `showAvatar` je false kad strana već prikazuje veliki portret tog lika.
export default function SpeakerHeader({ name, image, showAvatar = true }) {
  return (
    <S.Root $avatar={showAvatar} data-speaker={name} data-avatar={showAvatar}>
      {showAvatar && <Avatar name={name} image={image} decorative />}
      <S.Name>{name}</S.Name>
    </S.Root>
  );
}
