import styled from 'styled-components';
import { turnIn } from '../../styles/animations';

// Jedna strana priče.
export const Root = styled.section`
  position: relative;
  min-height: ${({ theme }) => theme.sizes.pageMinHeight};
  padding-bottom: ${({ theme }) => theme.space[250]};
  animation: ${turnIn} ${({ theme }) => theme.motion.paragraph} ease both;

  &:focus {
    outline: none;
  }
`;
