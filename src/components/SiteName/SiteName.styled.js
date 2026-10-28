import styled from 'styled-components';
import { visuallyHidden } from '../../styles/mixins';

const narrow = ({ theme }) => `@media (max-width: calc(${theme.breakpoints.nameFull} - 1px))`;
const narrowest = ({ theme }) => `@media (max-width: calc(${theme.breakpoints.nameShort} - 1px))`;

export const Root = styled.span`
  white-space: nowrap;
`;

// Pun naziv: ispod nameFull ostaje samo za čitač ekrana.
export const Full = styled.span`
  ${narrow} {
    ${visuallyHidden}
  }
`;

// Kratak naziv: samo ispod nameFull; uz `collapse` ispod nameShort nestaje (ostaje pun naziv za čitač ekrana).
export const Short = styled.span`
  display: none;

  ${narrow} {
    display: inline;
  }

  ${narrowest} {
    ${({ $collapse }) => ($collapse ? 'display: none;' : '')}
  }
`;
