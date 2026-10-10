import React from 'react';
import { SITE_NAME } from '../../../../config';
import * as S from './SiteHeader.styled';

export default function SiteHeader() {
  return (
    <S.Bar>
      <S.Skip href="#sadrzaj">Idi na sadržaj</S.Skip>
      <div className="container">
        <S.Brand to="/">{SITE_NAME}</S.Brand>
      </div>
    </S.Bar>
  );
}
