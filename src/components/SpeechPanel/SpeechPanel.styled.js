import styled, { css } from 'styled-components';
import { speakerIn } from '../../styles/animations';

const md = ({ theme }) => `@media (min-width: ${theme.breakpoints.md})`;

// Telefon: gde se završava slika (od početka sadržaja strane, koji počinje ispod gornjeg razmaka stranice).
const imageEdge = ({ theme }) =>
  `calc(${theme.sizes.sceneImageHeightFallback} - ${theme.space[350]})`;
const imageEdgeDvh = ({ theme }) => `calc(${theme.sizes.sceneImageHeight} - ${theme.space[350]})`;

// Telefon: običan tok ispod slike, bez ploče. Od md: ploča pri dnu ekrana (fiksirana).
export const Root = styled.div`
  position: relative;
  padding-top: ${imageEdge};
  padding-top: ${imageEdgeDvh};
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);

  ${md} {
    --scene-pw: ${({ theme }) => theme.sizes.scenePortrait};
    position: fixed;
    left: 0;
    right: 0;
    bottom: max(${({ theme }) => theme.space[200]}, env(safe-area-inset-bottom));
    z-index: ${({ theme }) => theme.zIndex.floating};
    width: ${({ theme }) => theme.sizes.scenePanelWidth};
    max-width: ${({ theme }) => theme.sizes.scenePanelMaxWidth};
    margin: 0 auto;
    padding: 0;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.scrim};
    color: ${({ theme }) => theme.text}; /* tekst pasusa nasleđuje boju; uz svetlu temu to je onImage (OnImage) */
    backdrop-filter: blur(${({ theme }) => theme.sizes.sceneBlur});
    -webkit-backdrop-filter: blur(${({ theme }) => theme.sizes.sceneBlur});
    ${({ $portrait, theme }) =>
      $portrait &&
      css`
        /* ploča je visoka bar dve trećine portreta, pa on viri iznad nje za otprilike trećinu svoje visine */
        min-height: calc(var(--scene-pw) * 4 / 3 * ${theme.sizes.scenePanelShare} + ${theme.space[150]});
      `}

    @media (max-height: ${({ theme }) => theme.sizes.sceneShortScreen}) {
      --scene-pw: ${({ theme }) => theme.sizes.scenePortraitShort};
      bottom: max(${({ theme }) => theme.space[100]}, env(safe-area-inset-bottom));
    }
  }
`;

export const Portrait = styled.div`
  position: absolute;
  top: ${imageEdge};
  top: ${imageEdgeDvh};
  ${({ $right }) => ($right ? 'right: 0;' : 'left: 0;')}
  width: ${({ $both, theme }) => ($both ? theme.sizes.scenePortraitMobileBoth : theme.sizes.scenePortraitMobile)};
  aspect-ratio: ${({ theme }) => theme.sizes.ratioPortrait};
  translate: 0 -${({ theme }) => theme.sizes.sceneOverlap}; /* posebno svojstvo: animacija pojave koristi transform */
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 10px 30px -14px ${({ theme }) => theme.shadow};
  animation: ${speakerIn} ${({ theme }) => theme.motion.speaker} ease both;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
  }

  ${md} {
    /* vrh portreta je iznad ploče za trećinu svoje visine */
    top: calc(var(--scene-pw) * 4 / 3 * -${({ theme }) => theme.sizes.scenePortraitRise});
    bottom: auto;
    ${({ $right, theme }) => ($right ? `right: ${theme.space[200]}; left: auto;` : `left: ${theme.space[200]}; right: auto;`)}
    width: var(--scene-pw);
    translate: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Desktop: unutrašnji skrol (ploča ne prelazi oko 70% visine ekrana); portret je izvan njega, pa ne sme da se odseče.
// Uz portret ostaje prazan prostor sa njegove strane.
export const Scroll = styled.div`
  ${md} {
    max-height: ${({ theme }) => theme.sizes.scenePanelMax};
    overflow-y: auto;
    padding: ${({ theme }) => theme.space[200]} ${({ theme }) => theme.space[250]};
    ${({ $left, $right, theme }) => {
      const clear = `calc(var(--scene-pw) + ${theme.space[200]} + ${theme.space[250]})`;
      return `${$left ? `padding-left: ${clear};` : ''}${$right ? `padding-right: ${clear};` : ''}`;
    }}
    /* uski prozori (tableti): oba portreta ne ostavljaju dovoljno mesta za tekst, pa stoje iznad teksta, jedan pored drugog */
    ${({ $both, theme }) =>
      $both &&
      css`
        @media (max-width: 899px) {
          padding: calc(var(--scene-pw) * 4 / 3 * ${theme.sizes.scenePanelShare} + ${theme.space[150]}) ${theme.space[250]} ${theme.space[200]};
        }
      `}

    /* niski laptop prozori: viša ploča (portret viri iznad nje, pa se njegov deo oduzima), manji razmaci i tekst */
    @media (max-height: ${({ theme }) => theme.sizes.sceneShortScreen}) {
      max-height: max(${({ theme }) => theme.sizes.scenePanelMax}, calc(${({ theme }) => theme.sizes.scenePanelMaxShort} - var(--scene-pw) * 4 / 3 * ${({ theme }) => theme.sizes.scenePortraitRise}));
      padding-top: ${({ theme }) => theme.space[120]};
      padding-bottom: ${({ theme }) => theme.space[100]};
      font-size: 1.08rem;
      line-height: 1.55;
    }
  }
`;

export const Inner = styled.div`
  padding-top: ${({ theme }) => theme.space[100]};

  ${md} {
    padding-top: 0;
    ${({ $columns, theme }) =>
      $columns
        ? css`
            display: grid;
            grid-template-columns: minmax(0, ${theme.sizes.sceneTextMax}) minmax(${theme.sizes.startFieldMin}, 1fr);
            column-gap: ${theme.sizes.startColumnGap};
            align-items: start;
          `
        : css`
            max-width: ${theme.sizes.sceneTextMax};
            min-width: min(34ch, 100%);

            @media (max-height: ${theme.sizes.sceneShortScreen}) {
              max-width: ${theme.sizes.sceneTextMaxShort};
            }
          `}
  }
`;

// Telefon: naslov stoji u donjem delu slike, na tamnoj podlozi (scrim); od md je običan početak teksta u ploči.
export const Title = styled.div`
  --title-bleed: calc(var(--bs-gutter-x, 1.5rem) / 2); /* do ivice ekrana, a tekst ostaje poravnat sa ostalim */
  position: absolute;
  top: 0;
  left: calc(env(safe-area-inset-left) - var(--title-bleed));
  right: calc(env(safe-area-inset-right) - var(--title-bleed));
  height: calc(${imageEdge} - ${({ theme }) => theme.sizes.sceneTitleLift});
  height: calc(${imageEdgeDvh} - ${({ theme }) => theme.sizes.sceneTitleLift});
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 var(--title-bleed) ${({ theme }) => theme.space[200]};
  background: linear-gradient(
    to bottom,
    transparent,
    color-mix(in srgb, ${({ theme }) => theme.scrim} 72%, transparent) 40%,
    color-mix(in srgb, ${({ theme }) => theme.scrim} 72%, transparent) 80%,
    transparent
  );
  z-index: 1;
  color: ${({ theme }) => theme.text}; /* uz svetlu temu: onImage (OnImage), jer stoji preko slike */

  @media (max-width: calc(${({ theme }) => theme.breakpoints.md} - 1px)) {
    > * > :last-child {
      margin-bottom: 0;
    }
  }

  ${md} {
    position: static;
    left: auto;
    right: auto;
    height: auto;
    display: block;
    padding: 0;
    background: none;
    grid-column: 1;
    grid-row: 1;
  }
`;

// Telefon: zaglavlje rezerviše mesto za deo portreta ispod ivice slike (procenat širine), a ime stoji pored portreta.
export const Head = styled.div`
  ${({ $portrait, $right, $both, theme }) =>
    $portrait
      ? css`
          position: relative;
          margin-top: ${theme.space[40]};
          padding-bottom: ${$both ? theme.sizes.sceneHeadSpacerBoth : theme.sizes.sceneHeadSpacer};
          text-align: ${$right ? 'right' : 'left'};
        `
      : css`
          margin-bottom: ${theme.space[60]};
        `}

  ${md} {
    position: static;
    margin: 0 0 ${({ theme }) => theme.space[60]};
    padding-bottom: 0;
    text-align: left;
  }
`;

export const Name = styled.span`
  display: block;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: ${({ theme }) => theme.fs[78]};
  font-weight: 600;
  letter-spacing: ${({ theme }) => theme.tracking[22]};
  text-transform: uppercase;
  /* btnText: akcenat koji je proveren na pozadini teme (check-themes) */
  color: ${({ theme }) => theme.btnText};

  ${({ $portrait, $right, $both, theme }) =>
    $portrait &&
    css`
      position: absolute;
      top: ${theme.space[10]};
      ${$right ? 'right' : 'left'}: calc(${$both ? theme.sizes.scenePortraitMobileBoth : theme.sizes.scenePortraitMobile} + ${theme.space[100]});
    `}

  ${md} {
    position: static;
  }
`;
