import styled from 'styled-components';

// Čitak jedan stub: najviše 70 znakova po redu.
export const Article = styled.article`
  max-width: 52ch;
  padding: ${({ theme }) => theme.space[200]} 0 ${({ theme }) => theme.space[200]};
`;

export const Back = styled.div`
  margin-bottom: ${({ theme }) => theme.space[150]};
`;

export const Updated = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[200]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[86]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  color: ${({ theme }) => theme.textMuted};
`;

export const H2 = styled.h2`
  margin: ${({ theme }) => theme.space[240]} 0 ${({ theme }) => theme.space[100]};
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: ${({ theme }) => theme.fs[150]};
  font-weight: 500;
  line-height: ${({ theme }) => theme.lineHeights.tight};
`;

export const List = styled.ul`
  margin: 0 0 ${({ theme }) => theme.space[135]};
  padding-left: ${({ theme }) => theme.space[150]};

  li + li {
    margin-top: ${({ theme }) => theme.space[70]};
  }
`;
