import React from 'react';
import { SITE_NAME } from '../../../../config';
import * as S from './SiteFooter.styled';

export default function SiteFooter() {
  return (
    <S.Bar>
      <div className="container">{SITE_NAME} · Napredak se čuva samo u tvom pregledaču</div>
    </S.Bar>
  );
}
