import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { visuallyHidden } from '../../../../styles/mixins';

export const Bar = styled.header`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.page};
  padding: ${({ theme }) => theme.space[150]} 0 0;
`;

export const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: ${({ theme }) => theme.fs[110]};
  letter-spacing: ${({ theme }) => theme.tracking[4]};
  text-decoration: none;
  color: ${({ theme }) => theme.text};

  &:hover {
    color: ${({ theme }) => theme.text};
    text-decoration: underline;
  }
`;

export const Skip = styled.a`
  ${visuallyHidden}

  &:focus {
    position: fixed;
    top: ${({ theme }) => theme.space[50]};
    left: ${({ theme }) => theme.space[50]};
    z-index: ${({ theme }) => theme.zIndex.floating};
    width: auto;
    height: auto;
    margin: 0;
    padding: ${({ theme }) => theme.space[50]} ${({ theme }) => theme.space[100]};
    clip: auto;
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    font-family: ${({ theme }) => theme.fonts.ui};
    font-size: ${({ theme }) => theme.fs[90]};
  }
`;
