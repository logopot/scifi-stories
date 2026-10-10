import styled, { css } from 'styled-components';

export const Main = styled.main`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.page};
  overflow-anchor: none;
  ${({ $variant, theme }) =>
    $variant === 'reader'
      ? css`
          min-height: ${theme.sizes.screenMinHeight};
          min-height: ${theme.sizes.screenMinHeightDynamic};
          padding: ${theme.space[350]} 0 ${theme.space[600]};
        `
      : css`
          flex: 1 0 auto;
          padding: ${theme.space[200]} 0 ${theme.space[400]};
        `}
`;

export const Column = styled.div`
  ${({ $variant, theme }) => {
    if ($variant === 'reader') return css`max-width: ${theme.sizes.readWidth}; margin: 0 auto;`;
    if ($variant === 'narrow') return css`max-width: ${theme.sizes.pageWidth}; margin: 0 auto;`;
    return '';
  }}
`;
