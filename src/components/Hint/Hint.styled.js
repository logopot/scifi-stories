import styled from 'styled-components';
import { fadeUp } from '../../styles/animations';

// Dugme za sledeću stranu: umesto "Dalje" prikazuje rečenicu koja nagoveštava šta sledi.
export const Root = styled.button`
  display: block;
  margin: ${({ theme }) => theme.space[200]} 0 0;
  padding: ${({ theme }) => theme.space[50]} 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: ${({ theme }) => theme.fontBody};
  font-style: italic;
  font-size: ${({ theme }) => theme.fs[102]};
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
  animation: ${fadeUp} ${({ theme }) => theme.motion.hint} ease both;
  animation-delay: 0.6s;
  transition: color ${({ theme }) => theme.transitions.base};

  &::after {
    content: ' →';
    color: ${({ theme }) => theme.accent};
  }

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: ${({ theme }) => theme.sizes.touchMin};
  }
`;
