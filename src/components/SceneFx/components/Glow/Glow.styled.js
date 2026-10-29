import styled from 'styled-components';
import { fxFlicker } from '../../../../styles/fxAnimations';

// Meki izvor svetla (lampa, prozor, ekran): radijalni gradijent, screen mešanje, treperi samo preko opacity.
export const Dot = styled.div`
  position: absolute;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 68%);
  mix-blend-mode: screen;
  animation: ${fxFlicker} var(--dur) linear var(--delay) infinite;
  will-change: opacity;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 0.45;
  }
`;
