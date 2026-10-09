import { createGlobalStyle, keyframes } from 'styled-components';

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const drift = keyframes`
  0%   { transform: translate3d(0, 0, 0); }
  50%  { transform: translate3d(14px, 10px, 0); }
  100% { transform: translate3d(0, 0, 0); }
`;

const GlobalStyle = createGlobalStyle`
  :root {
    --paper: ${({ theme }) => theme.colors.paper};
    --ink: ${({ theme }) => theme.colors.ink};
    --amber: ${({ theme }) => theme.colors.amber};
    --steel: ${({ theme }) => theme.colors.steel};
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.paper};
    color: ${({ theme }) => theme.colors.ink};
    font-family: ${({ theme }) => theme.fonts.prose};
    font-size: ${({ theme }) => theme.sizes.prose};
    line-height: 1.85;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.amberSoft};
  }

  button {
    font-family: inherit;
  }

  button:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.steel};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyle;
