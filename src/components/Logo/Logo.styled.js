import styled, { css } from 'styled-components';

const SIZES = {
  lg: { desktop: 'logoLg', mobile: 'logoLgMobile' },
  sm: { desktop: 'logoSm', mobile: 'logoSm' },
  xs: { desktop: 'logoXs', mobile: 'logoXs' },
};

// Okrugla pozadina (theme.logoBackdrop) čini logo vidljivim i na tamnim temama.
export const Root = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.sizes.logoPad};
  border-radius: 50%;
  background: ${({ theme }) => theme.logoBackdrop};

  img {
    display: block;
    object-fit: contain;
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
