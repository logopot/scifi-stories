import React from 'react';
import { SITE_NAME } from '../../../../config';
import Logo from '../../../Logo';
import * as S from './SiteHeader.styled';

export default function SiteHeader() {
  return (
    <S.Bar>
      <S.Skip href="#sadrzaj">Idi na sadržaj</S.Skip>
      <div className="container">
        <S.Brand to="/" aria-label={`${SITE_NAME}, početna`}>
          <Logo size="lg" />
          <S.BrandName>{SITE_NAME}</S.BrandName>
        </S.Brand>
      </div>
    </S.Bar>
  );
}
