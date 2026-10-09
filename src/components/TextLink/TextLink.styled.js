import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Root = styled(Link)`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  text-decoration: none;
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.text};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.accent};
  }
`;
