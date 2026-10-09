import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[80]};
  margin: 0 0 ${({ theme }) => theme.space[40]};
`;
