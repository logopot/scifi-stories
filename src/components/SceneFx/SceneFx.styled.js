import styled from 'styled-components';

export const Root = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Svetlo: screen mešanje preko slike (sloj slike i ovaj canvas dele isti stacking context u SceneBackdrop sloju).
export const Light = styled(Canvas)`
  mix-blend-mode: screen;
`;

// Materija (dim, magla, sneg, kiša): običan alfa preko slike.
export const Matter = styled(Canvas)``;
