import React, { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import * as S from './Sky.styled';

// Prvo crtanje stranice bez prelaza; kasnije promene teme pozadina uvodi mekim prelivanjem.
let firstPaint = true;

// Pozadina priče (dva sunca, zvezde ili obična); izgled bira theme.sky.
export default function Sky() {
  const theme = useTheme();
  const fade = useRef(!firstPaint);

  useEffect(() => {
    firstPaint = false;
  }, []);

  return <S.Root key={theme.name} $variant={theme.sky} $fade={fade.current} aria-hidden="true" />;
}
