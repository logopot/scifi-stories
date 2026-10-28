import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { visuallyHidden } from '../../../../styles/mixins';

export const Bar = styled.header`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.page};
  padding: ${({ theme }) => theme.space[150]} 0 0;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[100]};
`;

// Pun naziv na svim širinama: tečna veličina, a na uskim ekranima sme u dva reda (bez seckanja).
export const BrandName = styled.span`
  min-width: 0;
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: clamp(0.95rem, 3.6vw, 1.25rem);
  line-height: 1.15;
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: ${({ theme }) => theme.space[100]};
  font-family: ${({ theme }) => theme.fontHeading};
  letter-spacing: ${({ theme }) => theme.tracking[4]};
  text-decoration: none;
  color: ${({ theme }) => theme.text};

  &:hover,
  &:focus-visible {
    color: ${({ theme }) => theme.text};
    text-decoration: none; /* bez podvlačenja; obris fokusa je globalni */
  }

  &:hover ${BrandName} {
    opacity: 0.85;
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
