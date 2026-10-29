import styled from 'styled-components';
import { fxBreathe, fxSpin } from '../../../../styles/fxAnimations';

export const Disc = styled.div`
  position: absolute;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 68%);
  mix-blend-mode: screen;
  animation: ${fxBreathe} var(--dur) ease-in-out var(--delay) infinite alternate;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.45;
  }
`;

// Blagi zraci: ponavljajući konusni gradijent, vrlo sporo se okreće.
export const Rays = styled.div`
  position: absolute;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: repeating-conic-gradient(${({ $color }) => $color} 0deg 3deg, transparent 3deg 15deg);
  mask-image: radial-gradient(circle, black 12%, transparent 68%);
  -webkit-mask-image: radial-gradient(circle, black 12%, transparent 68%);
  mix-blend-mode: screen;
  opacity: 0.22;
  animation: ${fxSpin} 140s linear infinite;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.12;
  }
`;
