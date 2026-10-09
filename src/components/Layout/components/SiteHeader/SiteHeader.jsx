import React from 'react';
import * as S from './SiteHeader.styled';

export default function SiteHeader() {
  return (
    <S.Bar>
      <S.Skip href="#sadrzaj">Idi na sadržaj</S.Skip>
      <div className="container">
        <S.Brand to="/">Scifi priče</S.Brand>
      </div>
    </S.Bar>
  );
}
