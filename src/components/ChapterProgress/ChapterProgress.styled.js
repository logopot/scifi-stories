import styled from 'styled-components';

const md = ({ theme }) => `@media (min-width: ${theme.breakpoints.md})`;
const BOTTOM = 'max(10px, env(safe-area-inset-bottom))';

// Traka iza linije: na telefonu boja pozadine teme, od md scrim ploče; bledi ka vrhu (čitljivost preko slika).
export const Strip = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(${BOTTOM} + 17px);
  z-index: 1; /* iznad pozadine, ispod ploče (zIndex.floating) i dugmadi */
  pointer-events: none;
  background: linear-gradient(to top, ${({ theme }) => theme.bg}, transparent);

  ${md} {
    background: linear-gradient(to top, ${({ theme }) => theme.scrim}, transparent);
  }
`;

// Linija: ista širina i margine kao ploča (od md); na telefonu margine stranice.
export const Root = styled.div`
  position: absolute;
  bottom: ${BOTTOM};
  left: calc(var(--bs-gutter-x, 1.5rem) / 2 + env(safe-area-inset-left));
  right: calc(var(--bs-gutter-x, 1.5rem) / 2 + env(safe-area-inset-right));
  display: flex;
  gap: 4px;
  height: 3px;

  ${md} {
    left: 0;
    right: 0;
    margin: 0 auto;
    width: ${({ theme }) => theme.sizes.scenePanelWidth};
    max-width: ${({ theme }) => theme.sizes.scenePanelMaxWidth};
  }
`;

export const Segment = styled.div`
  flex: 1 1 0;
  height: 100%;
  overflow: hidden;
  border-radius: 2px;
  background: ${({ theme }) => theme.border};
`;

// btnBorder je akcenat koji check-themes proverava (bar 3:1 prema pozadini teme); uz OnImage je prilagođen za ploču.
export const Fill = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background: ${({ theme }) => theme.btnBorder};
  transform-origin: left center;
  transition: transform 250ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
