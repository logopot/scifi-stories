import styled from 'styled-components';
import TextLink from '../../../../components/TextLink';

// Tih link nazad: van toka teksta, pa ne menja raspored čitanja i nestaje sa skrolom.
export const BackLink = styled(TextLink)`
  position: absolute;
  top: ${({ theme }) => theme.space[100]};
  left: ${({ theme }) => theme.space[100]};
  opacity: ${({ theme }) => theme.opacity.muted};

  &:hover,
  &:focus-visible {
    opacity: 1;
  }
`;
