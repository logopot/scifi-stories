import styled from 'styled-components';

export const Root = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[72]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  color: ${({ theme }) => theme.textFaint};
  opacity: ${({ theme }) => theme.opacity.soft};
`;
