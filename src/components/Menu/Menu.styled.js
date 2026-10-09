import styled from 'styled-components';

export const Root = styled.div`
  margin-top: ${({ theme }) => theme.space[240]};
  padding-top: ${({ theme }) => theme.space[160]};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[35]};
`;
