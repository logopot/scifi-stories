import styled from 'styled-components';
import { fadeUp } from '../../styles/animations';

export const Root = styled.button`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space[90]};
  width: 100%;
  text-align: left;
  border: 0;
  background: none;
  padding: ${({ theme }) => theme.space[70]} ${({ theme }) => theme.space[20]};
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  font-family: ${({ theme }) => theme.fonts.menu};
  font-size: ${({ theme }) => theme.fs[98]};
  line-height: ${({ theme }) => theme.lineHeights.text};
  opacity: ${({ $ghost, theme }) => ($ghost ? theme.opacity.ghost : 1)};
  border-bottom: 1px dashed transparent;
  animation: ${fadeUp} ${({ theme }) => theme.motion.option} ease both;
  animation-delay: ${({ $i }) => `${0.4 + $i * 0.35}s`};
  transition: border-color ${({ theme }) => theme.transitions.base}, padding-left ${({ theme }) => theme.transitions.base},
    color ${({ theme }) => theme.transitions.base};

  &::before {
    content: ${({ $ghost }) => ($ghost ? "'—'" : "'◦'")};
    color: ${({ theme }) => theme.accent};
    flex: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-height: ${({ theme }) => theme.sizes.touchMin};
  }

  &:hover,
  &:focus-visible {
    padding-left: ${({ theme }) => theme.space[70]};
    border-bottom-color: ${({ theme }) => theme.secondary};
  }
`;
