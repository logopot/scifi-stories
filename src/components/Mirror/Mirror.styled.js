import styled from 'styled-components';
import ChapterMark from '../ChapterMark';

// Oznaka "Kraj": textMuted je proveren naspram pozadine teme (bar 4.5:1), za razliku od sitnog textFaint.
export const Kicker = styled(ChapterMark)`
  && {
    color: ${({ theme }) => theme.textMuted};
  }
`;

export const Actions = styled.div`
  margin-top: ${({ theme }) => theme.space[300]};

  @media (max-width: calc(${({ theme }) => theme.breakpoints.md} - 1px)) {
    button {
      width: 100%;
    }
  }
`;
