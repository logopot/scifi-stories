import styled from 'styled-components';

export const Confirm = styled.div`
  margin-top: ${({ theme }) => theme.space[150]};
  padding: ${({ theme }) => theme.space[120]} ${({ theme }) => theme.space[140]};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.surface};
`;

export const Question = styled.p`
  margin: 0 0 ${({ theme }) => theme.space[100]};
  font-size: ${({ theme }) => theme.fs[102]};
  line-height: ${({ theme }) => theme.lineHeights.text};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[100]};
`;
