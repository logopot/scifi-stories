import styled from 'styled-components';

// Stub celog ekrana: zaglavlje, sadržaj koji se razvlači i podnožje.
export const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${({ theme }) => theme.sizes.screenMinHeight};
`;
