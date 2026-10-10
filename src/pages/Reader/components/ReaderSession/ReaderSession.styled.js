import styled from 'styled-components';

// Tih povratak na sajt: van toka teksta, pa ne menja raspored čitanja i nestaje sa skrolom.
export const BackBar = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space[100]};
  left: ${({ theme }) => theme.space[100]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[70]};
  opacity: ${({ theme }) => theme.opacity.muted};
  transition: opacity ${({ theme }) => theme.transitions.base};

  &:hover,
  &:focus-within {
    opacity: 1;
  }
`;
