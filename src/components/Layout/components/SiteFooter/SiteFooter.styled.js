import styled from 'styled-components';

export const Bar = styled.footer`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.page};
  padding: ${({ theme }) => theme.space[200]} 0 ${({ theme }) => theme.space[300]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
`;
