import styled from 'styled-components';
import { fxSmoke } from '../../../../styles/fxAnimations';

// Pramen dima: mek krug koji se diže, širi i nestaje (tri pramena sa pomerenim fazama).
export const Puff = styled.div`
  position: absolute;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, ${({ $color }) => $color} 0%, transparent 65%);
  mix-blend-mode: screen;
  opacity: 0;
  animation: ${fxSmoke} var(--dur) ease-out var(--delay) infinite;
  will-change: opacity, transform;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;
