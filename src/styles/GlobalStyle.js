import { createGlobalStyle } from 'styled-components';

// Jedino mesto za globalna pravila. Bootstrap (reboot + grid) se uvozi jednom u main.jsx,
// a ovde se dopunjuje tako da boje, fontovi i linkovi uvek dolaze iz aktivne teme.
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    color-scheme: ${({ theme }) => theme.mode};
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.textFaint} transparent;
  }

  html, body, #root {
    min-height: 100%;
  }

  html {
    scroll-behavior: auto !important;
    background: ${({ theme }) => theme.bg};
  }

  body {
    margin: 0;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: ${({ theme }) => theme.fontBody};
    font-size: ${({ theme }) => theme.sizes.prose};
    line-height: ${({ theme }) => theme.lineHeights.prose};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
    transition: background-color ${({ theme }) => theme.transitions.theme},
      color ${({ theme }) => theme.transitions.theme};
  }

  ::selection {
    background: ${({ theme }) => theme.selection};
  }

  button, input {
    font-family: inherit;
  }

  a {
    color: ${({ theme }) => theme.text};
    text-decoration-color: ${({ theme }) => theme.border};
    text-underline-offset: 0.2em;
  }

  a:hover {
    color: ${({ theme }) => theme.text};
    text-decoration-color: ${({ theme }) => theme.accent};
  }

  button {
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.focusRing};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default GlobalStyle;
