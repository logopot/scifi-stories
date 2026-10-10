import React from 'react';
import Avatar from '../Avatar';
import * as S from './CharacterRow.styled';

// Red lica koja se pojavljuju na strani a ne govore (polje `with` na pasusu).
export default function CharacterRow({ characters }) {
  return (
    <S.Root>
      {characters.map(({ name, image }) => (
        <S.Item key={name}>
          <Avatar name={name} image={image} decorative />
          <S.Name>{name}</S.Name>
        </S.Item>
      ))}
    </S.Root>
  );
}
