import styled from 'styled-components';
import { sceneDrift, sceneFade } from '../../styles/animations';

const md = ({ theme }) => `@media (min-width: ${theme.breakpoints.md})`;

// Telefon: gornja polovina sadržaja (nije fiksirana). Od md: fiksirana pozadina preko celog ekrana.
export const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.sizes.sceneImageHeightFallback};
  height: ${({ theme }) => theme.sizes.sceneImageHeight};
  overflow: hidden;
  z-index: ${({ theme }) => theme.zIndex.sceneBack};
  pointer-events: none;

  ${md} {
    position: fixed;
    inset: 0;
    height: auto;
  }
`;

export const Layer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  animation: ${sceneFade} ${({ theme }) => theme.motion.sceneFade} ease both;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${({ theme }) => theme.sizes.sceneFocusMobile};
    transform-origin: center;
    animation: ${sceneDrift} ${({ theme }) => theme.motion.sceneDrift} ease-in-out infinite alternate;
    will-change: transform;

    ${md} {
      object-position: ${({ theme }) => theme.sizes.sceneFocusDesktop};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;

    img {
      animation: none;
    }
  }
`;

// Telefon: gore tamniji rub zbog logotipa, dole prelaz u boju pozadine teme.
// Od md: vinjeta + senka pri dnu (ispod panela) + senka pri vrhu (logo, meni, broj strane).
export const Shade = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, ${({ theme }) => theme.scrim} 8%, transparent 32%),
    linear-gradient(to bottom, transparent 45%, ${({ theme }) => theme.bg} 100%);

  ${md} {
    background: linear-gradient(to bottom, ${({ theme }) => theme.scrim} 6%, transparent 24%),
      linear-gradient(to top, ${({ theme }) => theme.scrim}, transparent 55%),
      radial-gradient(ellipse at center, transparent 55%, ${({ theme }) => theme.scrim} 135%);
  }
`;
