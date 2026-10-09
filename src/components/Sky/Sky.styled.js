import styled, { css } from 'styled-components';
import { drift, fadeIn } from '../../styles/animations';

const blob = css`
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(${({ theme }) => theme.skyDecor.blobA.blur});
  animation: ${drift} ${({ theme }) => theme.skyDecor.blobA.duration} ease-in-out infinite;
`;

// Zvezdano polje: tačkice rasute po pozadini, boje teksta teme.
const starField = ({ theme }) =>
  theme.skyDecor.stars
    .split(', ')
    .map((at) => `radial-gradient(1.5px 1.5px at ${at}, ${theme.text}, transparent)`)
    .join(', ');

export const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.sky};
  pointer-events: none;
  overflow: hidden;
  background: ${({ $variant, theme }) => ($variant === 'stars' ? `${starField({ theme })}, ` : '')}
    linear-gradient(180deg, ${({ theme }) => theme.bg} 0%, ${({ theme }) => theme.bgSoft} 100%);

  ${({ $fade, theme }) =>
    $fade &&
    css`
      animation: ${fadeIn} ${theme.motion.sky} ease both;
    `}

  ${({ $variant }) =>
    $variant !== 'plain' &&
    css`
      &::before,
      &::after {
        ${blob}
      }
      &::before {
        width: ${({ theme }) => theme.skyDecor.blobA.size};
        height: ${({ theme }) => theme.skyDecor.blobA.size};
        top: ${({ theme }) => theme.skyDecor.blobA.top};
        left: ${({ theme }) => theme.skyDecor.blobA.left};
        background: radial-gradient(
          circle,
          ${({ theme }) => theme.glowA},
          transparent ${({ theme }) => theme.skyDecor.fade}
        );
      }
      &::after {
        width: ${({ theme }) => theme.skyDecor.blobB.size};
        height: ${({ theme }) => theme.skyDecor.blobB.size};
        top: ${({ theme }) => theme.skyDecor.blobB.top};
        right: ${({ theme }) => theme.skyDecor.blobB.right};
        background: radial-gradient(
          circle,
          ${({ theme }) => theme.glowB},
          transparent ${({ theme }) => theme.skyDecor.fade}
        );
        animation-duration: ${({ theme }) => theme.skyDecor.blobB.duration};
        animation-direction: reverse;
      }
    `}
`;
