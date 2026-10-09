import React, { useState } from 'react';
import * as S from './Cover.styled';

// src je putanja unutar public/ (npr. 'img/bez-opcije/cover.jpg'); children se slažu preko slike (npr. oznaka).
export default function Cover({ src, alt = '', rounded = false, children }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  return (
    <S.Frame $rounded={rounded}>
      {showImage && (
        <img src={`${import.meta.env.BASE_URL}${src}`} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {children}
    </S.Frame>
  );
}
