import styled, { css } from 'styled-components';
import { speakerIn } from '../../styles/animations';

// Prvi govornik na strani dobija veliki portret; sledeći (kratke uzastopne replike) manji.
const size = ({ $follow, theme }) => ($follow ? theme.sizes.speakerPortraitSm : theme.sizes.speakerPortrait);

const md = ({ theme }) => `@media (min-width: ${theme.breakpoints.md})`;

const modes = {
  portrait: css`
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'pic' 'text';

    ${md} {
      grid-template-columns: ${({ theme, $reader, $follow }) =>
        $reader ? `minmax(0, 1fr) ${size({ $follow, theme })}` : `${size({ $follow, theme })} minmax(0, 1fr)`};
      grid-template-rows: auto 1fr;
      grid-template-areas: ${({ $reader }) => ($reader ? "'name pic' 'text pic'" : "'pic name' 'pic text'")};
      column-gap: ${({ theme }) => theme.space[200]};
    }
  `,
  plaque: css`
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'name' 'text';
    border-left: ${({ theme }) => theme.sizes.speakerBar} solid ${({ theme }) => theme.accent};
    padding-left: ${({ theme }) => theme.space[120]};
  `,
  name: css`
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'name' 'text';
  `,
};

export const Root = styled.div`
  display: grid;
  animation: ${speakerIn} ${({ theme }) => theme.motion.speaker} ease both;
  ${({ $mode }) => modes[$mode]}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Baner (telefon) / portret 3:4 (od md). Prostor se rezerviše samo kad slika postoji.
export const Picture = styled.div`
  grid-area: pic;
  position: relative;
  overflow: hidden;
  width: 100%;
  aspect-ratio: ${({ theme }) => theme.sizes.speakerBannerRatio};
  max-height: ${({ $follow, theme }) => ($follow ? theme.sizes.speakerBannerFollowMaxVh : theme.sizes.speakerBannerMaxVh)};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 30px -18px ${({ theme }) => theme.shadow};

  img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      ${({ theme }) => theme.scrim} ${({ theme }) => theme.scrimStops.bottomSolid},
      transparent ${({ theme }) => theme.scrimStops.bottomEnd}
    );
  }

  ${md} {
    width: min(${size}, ${({ theme }) => theme.sizes.speakerPortraitMaxVh});
    max-height: none;
    aspect-ratio: ${({ theme }) => theme.sizes.ratioPortrait};
    align-self: start;
    justify-self: ${({ $reader }) => ($reader ? 'end' : 'start')};

    &::after {
      display: none;
    }
  }
`;

const line = css`
  &::after {
    content: '';
    display: block;
    width: ${({ theme }) => theme.sizes.speakerLine};
    height: 2px;
    margin-top: ${({ theme }) => theme.space[50]};
    background: ${({ theme }) => theme.accent};
  }
`;

export const Name = styled.span`
  grid-area: name;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  color: ${({ theme }) => theme.accent};
  margin-bottom: ${({ theme }) => theme.space[60]};

  ${({ $mode }) =>
    $mode === 'name' &&
    css`
      ${line}
      margin-bottom: ${({ theme }) => theme.space[60]};
    `}

  ${({ $mode }) =>
    $mode === 'portrait' &&
    css`
      /* telefon: ime preko donjeg levog ugla banera, u istoj ćeliji mreže kao slika */
      grid-area: pic;
      align-self: end;
      justify-self: start;
      z-index: 1;
      margin: 0;
      padding: ${({ theme }) => theme.space[90]} ${({ theme }) => theme.space[100]};
      color: ${({ theme }) => theme.onImage};

      ${md} {
        grid-area: name;
        align-self: start;
        padding: 0;
        margin-bottom: ${({ theme }) => theme.space[90]};
        color: ${({ theme }) => theme.accent};
        ${line}
      }
    `}
`;

export const Speech = styled.div`
  grid-area: text;
  margin-top: ${({ $mode, theme }) => ($mode === 'portrait' ? theme.space[90] : '0')};

  ${md} {
    margin-top: 0;
  }
`;
