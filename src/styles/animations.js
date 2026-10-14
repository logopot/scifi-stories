import { keyframes } from 'styled-components';

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const turnIn = keyframes`
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
`;

export const drift = keyframes`
  0%   { transform: translate3d(0, 0, 0); }
  50%  { transform: translate3d(14px, 10px, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const speakerIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const sceneFade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// Vrlo sporo "disanje" slike mesta.
export const sceneDrift = keyframes`
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(1.08) translate(-1%, -0.8%); }
`;
