import styled, { css } from 'styled-components';

const clamp = (lines) => css`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lines};
  overflow: hidden;
`;

// Krug sa strelicom: u mirovanju providan sa ivicom akcenta, na hover/fokus pun akcent sa belom strelicom.
export const Circle = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.cardCircle};
  height: ${({ theme }) => theme.sizes.cardCircle};
  border: 2px solid ${({ theme }) => theme.accent};
  border-radius: 50%;
  background: transparent;
  color: ${({ theme }) => theme.onImage};
  transition: background ${({ theme }) => theme.transitions.base}, border-color ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${({ theme }) => theme.sizes.cardCircleLg};
    height: ${({ theme }) => theme.sizes.cardCircleLg};
  }

  svg {
    width: ${({ theme }) => theme.sizes.cardIcon};
    height: ${({ theme }) => theme.sizes.cardIcon};
    transition: transform ${({ theme }) => theme.transitions.base};
  }
`;

const circleActive = css`
  background: ${({ theme }) => theme.accentStrong};
  border-color: ${({ theme }) => theme.accentStrong};
  color: ${({ theme }) => theme.onAccent};
`;

export const Card = styled.div`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: ${({ theme }) => theme.sizes.cardRatio};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.onImage};
  box-shadow: 0 10px 30px -18px ${({ theme }) => theme.shadow};
  text-decoration: none;
  transition: box-shadow ${({ theme }) => theme.transitions.lift};

  ${({ $soon }) =>
    $soon
      ? css`
          cursor: default;
        `
      : css`
          &:focus-visible {
            outline: 2px solid ${({ theme }) => theme.focusRing};
            outline-offset: 3px;
          }

          &:active ${Circle}, &:focus-visible ${Circle} {
            ${circleActive}
          }

          @media (hover: hover) {
            &:hover {
              color: ${({ theme }) => theme.onImage};
              text-decoration: none;
              box-shadow: 0 18px 34px -20px ${({ theme }) => theme.shadow};
            }

            &:hover ${Circle} {
              ${circleActive}
            }
          }

          @media (prefers-reduced-motion: no-preference) {
            @media (hover: hover) {
              &:hover img {
                transform: scale(${({ theme }) => theme.sizes.cardZoom});
              }

              &:hover ${Circle} svg {
                transform: translateX(${({ theme }) => theme.sizes.cardNudge});
              }
            }

            &:focus-visible ${Circle} svg {
              transform: translateX(${({ theme }) => theme.sizes.cardNudge});
            }
          }
        `}
`;

// Prelivi: gore za naslov, dole za podatke i strelicu (boja iz theme.scrim).
export const ScrimTop = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.scrim} 0%,
    ${({ theme }) => theme.scrim} ${({ theme }) => theme.scrimStops.topSolid},
    transparent ${({ theme }) => theme.scrimStops.topEnd}
  );
`;

export const ScrimBottom = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    0deg,
    ${({ theme }) => theme.scrim} 0%,
    ${({ theme }) => theme.scrim} ${({ theme }) => theme.scrimStops.bottomSolid},
    transparent ${({ theme }) => theme.scrimStops.bottomEnd}
  );
`;

export const Top = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[60]};
  padding: ${({ theme }) => theme.space[140]} ${({ $badge, theme }) => ($badge ? theme.space[600] : theme.space[140])}
    0 ${({ theme }) => theme.space[140]};
  text-shadow: 0 1px 8px ${({ theme }) => theme.scrim};
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: ${({ theme }) => theme.fs[190]};
  font-weight: 500;
  line-height: ${({ theme }) => theme.lineHeights.tight};
  color: ${({ theme }) => theme.onImage};
`;

export const Tagline = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fs[102]};
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.onImage};
  ${clamp(3)}
`;

export const BadgeSlot = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[120]};
  right: ${({ theme }) => theme.space[120]};
`;

export const Bottom = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[100]};
  padding: 0 ${({ theme }) => theme.space[140]} ${({ theme }) => theme.space[140]};
`;

export const Meta = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[74]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.onImage};
  text-shadow: 0 1px 6px ${({ theme }) => theme.scrim};
`;
