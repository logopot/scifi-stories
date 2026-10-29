import styled from 'styled-components';
import { fxTwinkle } from '../../../../styles/fxAnimations';

export const Dot = styled.div`
  position: absolute;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 70%);
  mix-blend-mode: screen;
  animation: ${fxTwinkle} var(--dur) ease-in-out var(--delay) infinite;
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.45;
  }
`;
