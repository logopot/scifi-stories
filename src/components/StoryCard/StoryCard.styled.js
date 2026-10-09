import styled, { css } from 'styled-components';
import { buttonHover, buttonLook } from '../../styles/mixins';

export const Cta = styled.span`
  ${buttonLook}
  align-self: flex-start;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: transform ${({ theme }) => theme.transitions.lift}, box-shadow ${({ theme }) => theme.transitions.lift},
    border-color ${({ theme }) => theme.transitions.lift};

  ${({ $soon, theme }) =>
    $soon
      ? css`
          opacity: ${theme.opacity.dim};
          cursor: default;
        `
      : css`
          &:hover,
          &:focus-visible {
            color: ${theme.text};
            text-decoration: none;
            border-color: ${theme.accent};
            box-shadow: 0 18px 32px -22px ${theme.shadow};
          }

          &:hover ${Cta}, &:focus-visible ${Cta} {
            ${buttonHover}
          }

          &:focus-visible {
            outline: 2px solid ${theme.focusRing};
            outline-offset: 3px;
          }

          @media (prefers-reduced-motion: no-preference) {
            &:hover,
            &:focus-visible {
              transform: translateY(-4px);
            }
          }
        `}
`;

export const BadgeSlot = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[70]};
  right: ${({ theme }) => theme.space[70]};
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[70]};
  padding: ${({ theme }) => theme.space[120]} ${({ theme }) => theme.space[140]} ${({ theme }) => theme.space[140]};
`;

export const Title = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: ${({ theme }) => theme.fs[150]};
  font-weight: 500;
  line-height: ${({ theme }) => theme.lineHeights.heading};
`;

export const Tagline = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fs[102]};
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
`;

export const Meta = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[50]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
`;

export const Spacer = styled.div`
  flex: 1;
`;
