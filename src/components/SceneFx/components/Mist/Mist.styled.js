import styled from 'styled-components';
import { fxMist } from '../../../../styles/fxAnimations';

// Spori horizontalni pramenovi magle u donjoj polovini slike.
export const Band = styled.div`
  position: absolute;
  left: -30%;
  width: 160%;
  height: 24%;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, ${({ $color }) => $color} 0%, transparent 70%);
  mix-blend-mode: screen;
  animation: ${fxMist} var(--dur) ease-in-out var(--delay) infinite alternate;
  will-change: transform;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
