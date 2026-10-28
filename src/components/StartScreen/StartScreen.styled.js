import styled from 'styled-components';
import MenuLabel from '../MenuLabel';

const md = ({ theme }) => `@media (min-width: ${theme.breakpoints.md})`;
const phone = ({ theme }) => `@media (max-width: calc(${theme.breakpoints.md} - 1px))`;

// Telefon: jedna kolona. Od md: Layout nestaje (display: contents), pa su Copy, Form i Tip ćelije mreže ploče
// (vidi SpeechPanel `columns`): naslov i tekst levo, obrazac desno, nagoveštaj preko cele širine.
export const Layout = styled.div`
  ${md} {
    display: contents;
  }
`;

export const Copy = styled.div`
  ${md} {
    grid-column: 1;
    grid-row: 2;
  }
`;

export const Form = styled.div`
  min-width: 0;

  ${md} {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
`;

export const FieldLabel = styled(MenuLabel)`
  && {
    display: block;
    margin-top: ${({ theme }) => theme.space[150]};
  }

  &&:first-child {
    margin-top: 0;
  }
`;

export const Status = styled.p`
  margin: ${({ theme }) => theme.space[50]} 0 ${({ theme }) => theme.space[100]};
  font-size: ${({ theme }) => theme.fs[90]};
  min-height: 1.4em;
`;

export const PortraitHint = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[40]};
  font-size: ${({ theme }) => theme.fs[86]};
  color: ${({ theme }) => theme.textMuted};
`;

export const Muted = styled.span`
  opacity: ${({ theme }) => theme.opacity.muted};
`;

export const Soft = styled.span`
  opacity: ${({ theme }) => theme.opacity.soft};
`;

export const Note = styled.p`
  margin: ${({ theme }) => theme.space[150]} 0 ${({ theme }) => theme.space[100]};
  font-style: italic;
  opacity: ${({ theme }) => theme.opacity.soft};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[100]};
  margin-top: ${({ theme }) => theme.space[150]};

  ${phone} {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const Tip = styled.p`
  margin: ${({ theme }) => theme.space[300]} 0 ${({ theme }) => theme.space[100]};
  font-size: ${({ theme }) => theme.fs[85]};
  opacity: ${({ theme }) => theme.opacity.muted};

  ${md} {
    grid-column: 1 / -1;
    grid-row: 3;
    margin-top: ${({ theme }) => theme.space[200]};
  }
`;
