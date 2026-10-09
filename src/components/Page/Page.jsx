import React from 'react';
import * as S from './Page.styled';

const COLUMNS = {
  reader: 'col-12 col-lg-9 col-xl-8',
  narrow: 'col-12 col-lg-10',
  wide: 'col-12',
};

// Okvir sadržaja: 'reader' (kolona za čitanje), 'narrow' (stranica priče) ili 'wide' (mreža kartica).
export default function Page({ variant = 'reader', children }) {
  return (
    <S.Main id="sadrzaj" $variant={variant}>
      <div className="container">
        <div className="row justify-content-center">
          <div className={COLUMNS[variant]}>
            <S.Column $variant={variant}>{children}</S.Column>
          </div>
        </div>
      </div>
    </S.Main>
  );
}
