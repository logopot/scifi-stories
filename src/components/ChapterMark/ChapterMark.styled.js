import styled from 'styled-components';

export const Root = styled.div`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[28]};
  text-transform: uppercase;
  color: ${({ theme }) => theme.textFaint};
  margin-bottom: ${({ theme }) => theme.space[40]};
`;
