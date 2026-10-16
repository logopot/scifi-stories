import styled from 'styled-components';

export const Root = styled.div`
  margin-top: ${({ theme }) => theme.space[240]};
  padding-top: ${({ theme }) => theme.space[160]};
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[35]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) and (max-height: ${({ theme }) => theme.sizes.sceneShortScreen}) {
    margin-top: ${({ theme }) => theme.space[120]};
    padding-top: ${({ theme }) => theme.space[90]};
    gap: 0;
  }
`;
