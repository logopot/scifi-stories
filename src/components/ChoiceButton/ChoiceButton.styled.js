import styled from 'styled-components';

// Izbor jednog od nekoliko (npr. rod): neizabran, hover i izabran dolaze iz choice* tokena.
export const Root = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[70]};
  border: 2px solid ${({ theme, $on }) => ($on ? theme.choiceBgSelected : theme.choiceBorder)};
  background: ${({ theme, $on }) => ($on ? theme.choiceBgSelected : theme.choiceBg)};
  color: ${({ theme, $on }) => ($on ? theme.choiceTextSelected : theme.text)};
  padding: ${({ theme }) => theme.space[65]} ${({ theme }) => theme.space[150]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[86]};
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  letter-spacing: ${({ theme }) => theme.tracking[24]};
  text-transform: uppercase;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast};

  &::before {
    content: ${({ $on }) => ($on ? "'●'" : "'○'")};
    font-size: ${({ theme }) => theme.fs[80]};
    letter-spacing: 0;
    color: ${({ theme, $on }) => ($on ? theme.choiceTextSelected : theme.choiceDot)};
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme, $on }) => ($on ? theme.choiceBgSelected : theme.btnQuietBorder)};
  }
`;
