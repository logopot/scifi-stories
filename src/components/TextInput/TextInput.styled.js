import styled from 'styled-components';

export const Root = styled.input`
  display: block;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.inputMax};
  border: 1px solid color-mix(in srgb, ${({ theme }) => theme.text} 45%, transparent);
  border-radius: ${({ theme }) => theme.radii.md};
  background: color-mix(in srgb, ${({ theme }) => theme.text} 8%, transparent);
  padding: ${({ theme }) => theme.space[65]} ${({ theme }) => theme.space[90]};
  font-family: ${({ theme }) => theme.fontBody};
  font-size: ${({ theme }) => theme.fs[125]};
  color: ${({ theme }) => theme.text};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
    font-style: italic;
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.focusRing};
  }
`;
