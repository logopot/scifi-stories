import styled from 'styled-components';

// Krug fiksne veličine (nema skakanja rasporeda dok se slika učitava).
export const Root = styled.span`
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.sizes.avatarSm};
  height: ${({ theme }) => theme.sizes.avatarSm};
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: ${({ theme }) => theme.fs[110]};
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    width: ${({ theme }) => theme.sizes.avatarMd};
    height: ${({ theme }) => theme.sizes.avatarMd};
    font-size: ${({ theme }) => theme.fs[125]};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
`;
