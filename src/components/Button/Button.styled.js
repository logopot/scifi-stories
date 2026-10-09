import styled from 'styled-components';
import { buttonHover, buttonLook } from '../../styles/mixins';

export const Root = styled.button`
  ${buttonLook}
  ${({ $variant, theme }) =>
    $variant === 'quiet' &&
    `
      border-color: ${theme.border};
      color: ${theme.textMuted};
    `}

  &:disabled {
    opacity: ${({ theme }) => theme.opacity.disabled};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    ${buttonHover}
  }
`;
