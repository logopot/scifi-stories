import styled from 'styled-components';
import { fadeUp } from '../../styles/animations';

// Rečenica koja uokviruje opcije (umesto naslova liste).
export const Root = styled.p`
  font-style: italic;
  font-size: ${({ theme }) => theme.fs[102]};
  line-height: ${({ theme }) => theme.lineHeights.text};
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 ${({ theme }) => theme.space[80]};
  animation: ${fadeUp} ${({ theme }) => theme.motion.option} ease both;
`;
