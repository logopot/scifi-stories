import styled from 'styled-components';

// Okvir scene. Uvodna animacija strane (turnIn) pomera je udesno za nekoliko piksela: bez isecanja bi to na
// telefonu proširilo stranicu i pojavilo bi se vodoravno pomeranje.
export const Article = styled.article`
  display: block;
  overflow-x: clip;
`;
