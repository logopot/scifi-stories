import styled from 'styled-components';

export const Root = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[90]};
  margin-bottom: ${({ $avatar, theme }) => ($avatar ? theme.space[60] : theme.space[10])};
`;

export const Name = styled.span`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[74]};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
`;
