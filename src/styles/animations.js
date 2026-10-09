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
