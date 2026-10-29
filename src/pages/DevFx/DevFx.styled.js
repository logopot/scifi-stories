import styled from 'styled-components';

// SAMO ZA RAZVOJ: alat za postavljanje efekata (/dev/fx).
export const Wrap = styled.div`
  min-height: 100vh;
  padding: 12px;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  font-family: ${({ theme }) => theme.fontHeading};
  font-size: 14px;
`;

export const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;

  select,
  input,
  button {
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 6px;
    padding: 6px 8px;
    font: inherit;
  }

  input[type='number'] {
    width: 5.5em;
  }

  button[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }
`;

export const Stage = styled.div`
  position: relative;
  width: 100%;
  max-width: 1100px;
  aspect-ratio: ${({ $ratio }) => $ratio};
  overflow: hidden;
  background: ${({ theme, $black }) => ($black ? 'black' : theme.bgSoft)};
  cursor: crosshair;
  touch-action: none;
  user-select: none;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    pointer-events: none;
  }
`;

export const Marker = styled.button`
  position: absolute;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid ${({ $selected, theme }) => ($selected ? theme.accent : theme.text)};
  background: transparent;
  cursor: grab;
  touch-action: none;
`;

// Pravougaonik vode (isprekidan) ili izuzetka (tačkast), i vertikalna linija stuba odsjaja.
export const Box = styled.div`
  position: absolute;
  box-sizing: border-box;
  border: 1px ${({ $exclude }) => ($exclude ? 'dotted' : 'dashed')} ${({ theme, $selected, $exclude }) => ($exclude ? theme.text : $selected ? theme.accent : theme.text)};
  opacity: 0.8;
  pointer-events: none;
`;

// SVG sloj za prikaz ekrana (pravougaonik ili quad)
export const Overlay = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  polygon {
    fill: none;
    stroke: ${({ theme }) => theme.accent};
    stroke-width: 1.5px;
    opacity: 0.9;
  }
`;

// Izuzete oblasti ekrana (isprekidano, tekst boja)
export const ExcludeOverlay = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  rect,
  polygon,
  ellipse {
    fill: none;
    stroke: ${({ theme }) => theme.text};
    stroke-width: 1.5px;
    stroke-dasharray: 4 3;
    opacity: 0.9;
  }
`;

export const Line = styled.div`
  position: absolute;
  width: 0;
  border-left: 1px dashed ${({ theme }) => theme.accent};
  opacity: 0.8;
  pointer-events: none;
`;

export const Ring = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.text};
  opacity: 0.5;
  pointer-events: none;
  transform: translate(-50%, -50%);
`;

export const Json = styled.textarea`
  width: 100%;
  max-width: 1100px;
  min-height: 6em;
  margin-top: 10px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-family: monospace;
  font-size: 12px;
`;
