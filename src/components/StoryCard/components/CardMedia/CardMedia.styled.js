import styled, { css } from 'styled-components';

// Slika preko cele kartice; bez slike ostaje gradijent iz boja teme. Zumiranje na hover radi roditelj (Card).
export const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  background-color: ${({ theme }) => theme.bg};
  background-image: linear-gradient(150deg, ${({ theme }) => theme.bgSoft}, ${({ theme }) => theme.glowA}, ${({ theme }) => theme.glowB});

  ${({ $soon }) =>
    $soon &&
    css`
      filter: grayscale(0.6) brightness(0.7);
    `}
`;

export const Image = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${({ $position }) => $position};
  transform-origin: center;
  transition: transform ${({ theme }) => theme.transitions.zoom};
`;
