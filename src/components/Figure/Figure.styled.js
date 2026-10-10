import styled, { css } from 'styled-components';
import { fadeUp } from '../../styles/animations';

const picture = css`
  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: ${({ $variant, theme }) => ($variant === 'portrait' ? theme.sizes.ratioPortrait : theme.sizes.ratioPlace)};
    object-fit: cover;
    object-position: top;
    border-radius: ${({ theme }) => theme.radii.sm};
    box-shadow: 0 10px 30px -18px ${({ theme }) => theme.shadow};
    animation: ${fadeUp} ${({ theme }) => theme.motion.figure} ease both;
  }
`;

// place: široka slika mesta na vrhu prve strane; portrait: manja slika lika uz desnu ivicu teksta.
export const Root = styled.figure`
  ${picture}
  ${({ $variant, theme }) =>
    $variant === 'portrait'
      ? css`
          float: right;
          width: ${theme.sizes.portraitFluid};
          margin: ${theme.space[20]} 0 ${theme.space[80]} ${theme.space[140]};

          figcaption {
            margin-top: ${theme.space[40]};
            text-align: right;
            font-family: ${theme.fonts.ui};
            font-size: ${theme.fs[68]};
            letter-spacing: ${theme.tracking[22]};
            text-transform: uppercase;
            color: ${theme.textFaint};
          }
        `
      : css`
          margin: 0 0 ${theme.space[180]};
        `}
`;
