import React from 'react';
import * as S from './Badge.styled';

// Mala oznaka ("Nastavi", "Uskoro"). variant: 'accent' | 'muted'.
export default function Badge({ variant = 'muted', className, children }) {
  return (
    <S.Root $variant={variant} className={className}>
      {children}
    </S.Root>
  );
}
