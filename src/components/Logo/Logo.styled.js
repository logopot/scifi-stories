import styled, { css } from 'styled-components';

const SIZES = {
  lg: { desktop: 'logoLg', mobile: 'logoLgMobile' },
  sm: { desktop: 'logoSm', mobile: 'logoSm' },
  xs: { desktop: 'logoXs', mobile: 'logoXs' },
};

const defaultColors = (theme) => css`
  --logo-body: ${theme.logoBody};
  --logo-accent: ${theme.logoAccent};
  --logo-gap: ${theme.logoGap};
`;
const onImageColors = (theme) => css`
  --logo-body: ${theme.logoBodyOnImage};
  --logo-accent: ${theme.logoAccentOnImage};
  --logo-gap: ${theme.logoGapOnImage};
`;

// Boje znaka (CSS promenljive za LogoMark) dolaze iz teme; `onImage` je svetla varijanta za znak preko slike.
export const Root = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.sizes.logoPad};
  border-radius: 50%;
  ${({ $onImage, theme }) => ($onImage ? onImageColors(theme) : defaultColors(theme))}

  svg {
    display: block;
    ${({ $size, theme }) => css`
      width: ${theme.sizes[SIZES[$size].mobile]};
      height: ${theme.sizes[SIZES[$size].mobile]};

      @media (min-width: ${theme.breakpoints.md}) {
        width: ${theme.sizes[SIZES[$size].desktop]};
        height: ${theme.sizes[SIZES[$size].desktop]};
      }
    `}
  }
`;
