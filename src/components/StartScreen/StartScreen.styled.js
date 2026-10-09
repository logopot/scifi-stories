import styled from 'styled-components';
import MenuLabel from '../MenuLabel';

export const FieldLabel = styled(MenuLabel)`
  && {
    display: block;
    margin-top: ${({ theme }) => theme.space[150]};
  }
`;

export const Status = styled.p`
  margin: ${({ theme }) => theme.space[50]} 0 ${({ theme }) => theme.space[100]};
  font-size: ${({ theme }) => theme.fs[90]};
  min-height: 1.4em;
`;

export const Muted = styled.span`
  opacity: ${({ theme }) => theme.opacity.muted};
`;

export const Soft = styled.span`
  opacity: ${({ theme }) => theme.opacity.soft};
`;

export const Note = styled.p`
  margin: ${({ theme }) => theme.space[150]} 0 ${({ theme }) => theme.space[100]};
  font-style: italic;
  opacity: ${({ theme }) => theme.opacity.soft};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[100]};
  margin-top: ${({ theme }) => theme.space[150]};
`;

export const Tip = styled.p`
  margin: ${({ theme }) => theme.space[300]} 0 ${({ theme }) => theme.space[100]};
  font-size: ${({ theme }) => theme.fs[85]};
  opacity: ${({ theme }) => theme.opacity.muted};
`;
