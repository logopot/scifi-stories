import { css } from 'styled-components';

// Dvostruka senka naslova: jedna u boji akcenta, druga u sekundarnoj boji teme.
export const doubleShadow = css`
  text-shadow: 2px 2px 0 ${({ theme }) => theme.selection},
    -2px 2px 0 ${({ theme }) => theme.secondarySoft};
`;

// Dugme: sva stanja dolaze iz btn* tokena teme (promena boje, bez promene dimenzija).
export const buttonLook = css`
  display: inline-block;
  border: 1px solid ${({ theme }) => theme.btnBorder};
  background: ${({ theme }) => theme.btnBg};
  color: ${({ theme }) => theme.btnText};
  padding: ${({ theme }) => theme.space[75]} ${({ theme }) => theme.space[180]};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[82]};
  letter-spacing: ${({ theme }) => theme.tracking[24]};
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.base}, color ${({ theme }) => theme.transitions.base},
    border-color ${({ theme }) => theme.transitions.base};
`;

export const buttonHover = css`
  background: ${({ theme }) => theme.btnBgHover};
  color: ${({ theme }) => theme.btnTextHover};
  border-color: ${({ theme }) => theme.btnBorderHover};
`;

export const buttonActive = css`
  background: ${({ theme }) => theme.btnBgActive};
  color: ${({ theme }) => theme.btnTextHover};
  border-color: ${({ theme }) => theme.btnBorderHover};
`;

export const buttonQuiet = css`
  background: transparent;
  color: ${({ theme }) => theme.btnQuietText};
  border-color: ${({ theme }) => theme.btnQuietBorder};
`;

export const buttonQuietHover = css`
  background: ${({ theme }) => theme.btnQuietBgHover};
  color: ${({ theme }) => theme.btnQuietTextHover};
  border-color: ${({ theme }) => theme.btnQuietBgHover};
`;

export const buttonDisabled = css`
  background: ${({ theme }) => theme.btnDisabledBg};
  color: ${({ theme }) => theme.btnDisabledText};
  border-color: ${({ theme }) => theme.border};
  cursor: not-allowed;
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
