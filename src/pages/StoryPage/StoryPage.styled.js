import styled from 'styled-components';

export const Back = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[100]};
  margin-bottom: ${({ theme }) => theme.space[150]};
`;

export const Body = styled.div`
  margin-top: ${({ theme }) => theme.space[240]};
`;

export const Details = styled.p`
  margin: ${({ theme }) => theme.space[200]} 0 ${({ theme }) => theme.space[200]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[82]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space[100]};
`;

export const Description = styled.div`
  min-height: ${({ theme }) => theme.space[500]};
`;
