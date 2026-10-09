import styled from 'styled-components';

// Naslovna slika 16:9. Ako slike nema (ili se ne učita), ostaje gradijent iz boja teme.
export const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: ${({ $rounded, theme }) => ($rounded ? theme.radii.sm : theme.radii.none)};
  background: linear-gradient(135deg, ${({ theme }) => theme.bgSoft}, ${({ theme }) => theme.glowA}, ${({ theme }) => theme.glowB});

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
