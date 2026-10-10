import React, { forwardRef } from 'react';
import * as S from './PageBox.styled';

// `ref` služi da se fokus prebaci na novu stranu (tabIndex -1: fokusira se skriptom, ne tasterom Tab).
const PageBox = forwardRef(function PageBox({ children }, ref) {
  return (
    <S.Root ref={ref} tabIndex={-1}>
      {children}
    </S.Root>
  );
});

export default PageBox;
