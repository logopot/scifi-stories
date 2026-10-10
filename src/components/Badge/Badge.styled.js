import styled from 'styled-components';

export const Root = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.space[20]} ${({ theme }) => theme.space[70]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[68]};
  font-weight: 600;
  line-height: ${({ theme }) => theme.lineHeights.text};
  letter-spacing: ${({ theme }) => theme.tracking[20]};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ $variant, theme }) => ($variant === 'accent' ? theme.accentStrong : theme.border)};
  background: ${({ $variant, theme }) => ($variant === 'accent' ? theme.accentStrong : theme.surface)};
  color: ${({ $variant, theme }) => ($variant === 'accent' ? theme.onAccent : theme.textMuted)};
`;
