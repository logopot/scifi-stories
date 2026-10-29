import { keyframes } from 'styled-components';

// Efekti preko slika mesta (components/SceneFx). Instance dobijaju slučajno trajanje, fazu i dubinu treperenja
// preko CSS promenljivih (--lo, --mid, --dx, --dy), a animiraju se samo opacity i transform.

export const fxFlicker = keyframes`
  0%   { opacity: 1; }
  9%   { opacity: var(--mid); }
  18%  { opacity: 1; }
  31%  { opacity: var(--lo); }
  44%  { opacity: var(--mid); }
  58%  { opacity: 1; }
  71%  { opacity: var(--lo); }
  85%  { opacity: var(--mid); }
  100% { opacity: 1; }
`;

export const fxFire = keyframes`
  0%   { opacity: 1;          transform: translate(-50%, -50%) scale(1, 1); }
  14%  { opacity: var(--mid); transform: translate(-50%, -50%) scale(0.95, 1.06); }
  27%  { opacity: 1;          transform: translate(-50%, -52%) scale(1.05, 0.96); }
  41%  { opacity: var(--lo);  transform: translate(-50%, -50%) scale(0.97, 1.04); }
  57%  { opacity: 1;          transform: translate(-51%, -50%) scale(1.03, 1); }
  73%  { opacity: var(--mid); transform: translate(-50%, -51%) scale(0.96, 1.05); }
  100% { opacity: 1;          transform: translate(-50%, -50%) scale(1, 1); }
`;

export const fxBreathe = keyframes`
  from { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 1;   transform: translate(-50%, -50%) scale(1.07); }
`;

export const fxSpin = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
`;

export const fxSmoke = keyframes`
  0%   { opacity: 0;   transform: translate(-50%, 0) scale(0.5); }
  25%  { opacity: 0.5; }
  100% { opacity: 0;   transform: translate(-30%, -260%) scale(1.7); }
`;

export const fxTwinkle = keyframes`
  0%   { opacity: 0.3; }
  20%  { opacity: 1; }
  35%  { opacity: 0.5; }
  60%  { opacity: 0.95; }
  80%  { opacity: 0.35; }
  100% { opacity: 0.3; }
`;

export const fxMist = keyframes`
  from { transform: translateX(-6%); }
  to   { transform: translateX(6%); }
`;

export const fxSpark = keyframes`
  0%   { opacity: 0; transform: translate(0, 0) scale(1); }
  12%  { opacity: 1; }
  100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.4); }
`;
