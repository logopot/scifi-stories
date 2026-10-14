import styled, { css } from 'styled-components';
import { turnIn } from '../../styles/animations';

// Jedna strana priče.
export const Root = styled.section`
  position: relative;
  min-height: ${({ $compact, theme }) => ($compact ? '0' : theme.sizes.pageMinHeight)};
  padding-bottom: ${({ theme }) => theme.space[250]};
  ${({ $compact, theme }) =>
    $compact &&
    css`
      padding-bottom: ${theme.space[200]};
    `}
  animation: ${turnIn} ${({ theme }) => theme.motion.paragraph} ease both;

  &:focus {
    outline: none;
  }
`;
