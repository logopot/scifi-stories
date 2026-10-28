import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Root = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[50]};
  flex-shrink: 0;
  margin-left: auto;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights.text};
`;

export const Sep = styled.span`
  color: ${({ theme }) => theme.textFaint};
`;

export const Current = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 700;
`;

export const Other = styled(Link)`
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.base};

  &:hover {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
  }
`;
