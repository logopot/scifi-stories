import styled from 'styled-components';

// Jedan canvas po sceni za sneg, prašinu i kišu; ne hvata klikove.
export const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;
