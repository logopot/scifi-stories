import styled from 'styled-components';

export const Root = styled.input`
  display: block;
  width: 100%;
  max-width: ${({ theme }) => theme.sizes.inputMax};
  border: 0;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  background: transparent;
  padding: ${({ theme }) => theme.space[40]} ${({ theme }) => theme.space[10]};
  font-family: ${({ theme }) => theme.fontBody};
  font-size: ${({ theme }) => theme.fs[125]};
  color: ${({ theme }) => theme.text};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.textFaint};
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.focusRing};
  }
`;
