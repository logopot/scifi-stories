import styled from 'styled-components';
import {
  buttonActive,
  buttonDisabled,
  buttonHover,
  buttonLook,
  buttonQuiet,
  buttonQuietHover,
} from '../../styles/mixins';

const quiet = ({ $variant }) => $variant === 'quiet';

// Hover i fokus tastaturom menjaju samo boje; obris fokusa je globalni (theme.focusRing).
export const Root = styled.button`
  ${buttonLook}
  ${(props) => quiet(props) && buttonQuiet}

  &:hover:not(:disabled),
  &:focus-visible:not(:disabled) {
    ${(props) => (quiet(props) ? buttonQuietHover : buttonHover)}
  }

  &:active:not(:disabled) {
    ${(props) => (quiet(props) ? buttonQuietHover : buttonActive)}
  }

  &:disabled {
    ${buttonDisabled}
  }
`;
