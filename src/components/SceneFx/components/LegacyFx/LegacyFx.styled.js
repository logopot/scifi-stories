import styled from 'styled-components';
import { sceneDrift } from '../../../../styles/animations';

export const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

// Isti sloj pomeranja (drift) kao slika, pa svetla prate sliku; počinje zajedno sa slikom (isti trenutak montiranja).
export const Drift = styled.div`
  position: absolute;
  inset: 0;
  transform-origin: center;
  animation: ${sceneDrift} ${({ theme }) => theme.motion.sceneDrift} ease-in-out infinite alternate;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Pravougaonik koji slika stvarno zauzima uz object-fit: cover; efekti se pozicioniraju u procentima unutar njega.
export const Rect = styled.div`
  position: absolute;
`;
