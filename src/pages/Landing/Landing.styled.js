import styled from 'styled-components';

export const Intro = styled.div`
  margin-bottom: ${({ theme }) => theme.space[300]};
  padding-top: ${({ theme }) => theme.space[200]};
`;

// Na telefonu jedna kolona, kartica najviše ~420px i centrirana.
export const Slot = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: ${({ theme }) => theme.sizes.cardMaxMobile};
    margin: 0 auto;
  }
`;
