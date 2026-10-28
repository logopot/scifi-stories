import styled from 'styled-components';

export const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[80]};
  margin: 0 0 ${({ theme }) => theme.space[40]};
`;

// Kartica sa portretom; izabrana ima debeo obris u boji izbora, neizabrana je blago prigušena.
export const Card = styled.button`
  flex: none;
  width: ${({ theme }) => theme.sizes.portraitChoice};
  padding: 0;
  overflow: hidden;
  border: 3px solid ${({ theme, $on }) => ($on ? theme.choiceBgSelected : `color-mix(in srgb, ${theme.text} 45%, transparent)`)};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.choiceBg};
  cursor: pointer;
  opacity: ${({ theme, $on }) => ($on ? 1 : theme.opacity.soft)};
  transition: opacity ${({ theme }) => theme.transitions.fast}, border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.focusRing};
    outline-offset: 3px;
  }
`;

export const Image = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: ${({ theme }) => theme.sizes.cardRatio};
  object-fit: cover;
`;
