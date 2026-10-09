import styled from 'styled-components';

export const Root = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 ${({ theme }) => theme.space[250]};
`;
