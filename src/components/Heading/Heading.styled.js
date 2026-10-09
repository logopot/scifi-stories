import styled, { css } from 'styled-components';
import { doubleShadow } from '../../styles/mixins';

export const Root = styled.h1`
  font-family: ${({ theme }) => theme.fontHeading};
  font-weight: 500;
  ${doubleShadow}
  ${({ $variant, theme }) =>
    $variant === 'title'
      ? css`
          letter-spacing: ${theme.tracking[4]};
          font-size: ${theme.sizes.titleFluid};
          line-height: ${theme.lineHeights.tight};
          margin: 0 0 ${theme.space[100]};
        `
      : css`
          font-size: ${theme.fs[190]};
          margin: 0 0 ${theme.space[200]};
        `}
`;
