import styled from 'styled-components';

export const Root = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[10]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[74]};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;
