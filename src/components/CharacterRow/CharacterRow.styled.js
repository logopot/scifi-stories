import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[120]};
  margin-bottom: ${({ theme }) => theme.space[100]};
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[70]};
`;

export const Name = styled.span`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[74]};
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  color: ${({ theme }) => theme.textMuted};
`;
