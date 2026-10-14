import React from 'react';
import { ThemeProvider } from 'styled-components';
import { onImageTheme } from '../../styles/onImageTheme';
import * as S from './OnImage.styled';

// Deca se crtaju sa bojama za tekst preko slike (vidi onImageTheme). `active={false}` ne menja ništa.
export default function OnImage({ active = true, children }) {
  if (!active) return <S.Root>{children}</S.Root>;
  return (
    <ThemeProvider theme={onImageTheme}>
      <S.Root>{children}</S.Root>
    </ThemeProvider>
  );
}
