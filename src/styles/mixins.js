import { css } from 'styled-components';

// Dvostruka senka naslova: jedna u boji akcenta, druga u sekundarnoj boji teme.
export const doubleShadow = css`
  text-shadow: 2px 2px 0 ${({ theme }) => theme.selection},
    -2px 2px 0 ${({ theme }) => theme.secondarySoft};
`;

// Izgled dugmeta (okvir, slova); deli ga Button i dugme unutar kartice.
export const buttonLook = css`
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.text};
  background: transparent;
  color: ${({ theme }) => theme.text};
  padding: ${({ theme }) => theme.space[75]} ${({ theme }) => theme.space[180]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[82]};
  letter-spacing: ${({ theme }) => theme.tracking[24]};
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base}, color ${({ theme }) => theme.transitions.base};
`;

export const buttonHover = css`
  background: ${({ theme }) => theme.text};
  color: ${({ theme }) => theme.bg};
`;

export const visuallyHidden = css`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
