import styled from 'styled-components';
import { fxFire, fxSpark } from '../../../../styles/fxAnimations';

export const Outer = styled.div`
  position: absolute;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 68%);
  mix-blend-mode: screen;
  animation: ${fxFire} var(--dur) ease-in-out var(--delay) infinite;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.45;
  }
`;

// Svetla jezgra vatre, manja i blaža od spoljnog sjaja.
export const Core = styled(Outer)`
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 62%);
  opacity: 0.85;
`;

export const Spark = styled.span`
  position: absolute;
  width: 0.7%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  mix-blend-mode: screen;
  opacity: 0;
  animation: ${fxSpark} var(--dur) ease-out var(--delay) infinite;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;
