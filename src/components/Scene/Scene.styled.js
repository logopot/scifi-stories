import styled from 'styled-components';

// Okvir scene. Uvodna animacija strane (turnIn) pomera je udesno za nekoliko piksela: bez isecanja bi to na
// telefonu proširilo stranicu i pojavilo bi se vodoravno pomeranje.
export const Article = styled.article`
  display: block;
  overflow-x: clip;
`;

// Sitan nagoveštaj ispod dugmeta za sledeću stranu (samo telefon, prvih par strana po sesiji); bez animacije.
export const SwipeNote = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  color: ${({ theme }) => theme.textMuted};
  opacity: 0.8;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;
