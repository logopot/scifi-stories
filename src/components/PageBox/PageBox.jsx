import React, { forwardRef } from 'react';
import * as S from './PageBox.styled';

// `ref` služi da se fokus prebaci na novu stranu (tabIndex -1: fokusira se skriptom, ne tasterom Tab).
const PageBox = forwardRef(function PageBox({ compact = false, children }, ref) {
  return (
    <S.Root ref={ref} tabIndex={-1} $compact={compact}>
      {children}
    </S.Root>
  );
});

export default PageBox;
