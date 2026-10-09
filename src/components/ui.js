import styled, { css, keyframes } from 'styled-components';
import { fadeUp, drift } from '../styles/GlobalStyle';

const turnIn = keyframes`
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ---------- Pozadina: dva sunca ----------
export const Sky = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.paper} 0%, ${({ theme }) => theme.colors.paperDeep} 100%);

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    animation: ${drift} 40s ease-in-out infinite;
  }
  &::before {
    width: 46vmax;
    height: 46vmax;
    top: -22vmax;
    left: -12vmax;
    background: radial-gradient(circle, rgba(236, 160, 60, 0.55), rgba(236, 160, 60, 0) 68%);
  }
  &::after {
    width: 30vmax;
    height: 30vmax;
    top: -14vmax;
    right: -8vmax;
    background: radial-gradient(circle, rgba(130, 175, 215, 0.55), rgba(130, 175, 215, 0) 68%);
    animation-duration: 55s;
    animation-direction: reverse;
  }
`;

export const Page = styled.main`
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: 3.5rem 0 6rem;
`;

export const Column = styled.div`
  max-width: ${({ theme }) => theme.sizes.readWidth};
  margin: 0 auto;
`;

// ---------- Jedna strana priče ----------
export const PageBox = styled.section`
  position: relative;
  min-height: 62vh;
  padding-bottom: 2.5rem;
  animation: ${turnIn} ${({ theme }) => theme.motion.paragraph} ease both;
`;

export const PageNo = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: ${({ theme }) => theme.colors.inkFaint};
  opacity: 0.8;
`;

// ---------- Naslovi sa dvostrukom senkom ----------
export const DoubleShadow = css`
  text-shadow: 2px 2px 0 ${({ theme }) => theme.colors.amberSoft},
    -2px 2px 0 ${({ theme }) => theme.colors.steelSoft};
`;

export const Title = styled.h1`
  font-weight: 500;
  letter-spacing: 0.04em;
  font-size: clamp(2.6rem, 8vw, 4.2rem);
  line-height: 1.1;
  margin: 0 0 1rem;
  ${DoubleShadow}
`;

export const Subtitle = styled.p`
  font-style: italic;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 0 0 2.5rem;
`;

export const ChapterMark = styled.div`
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 0.78rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.inkFaint};
  margin-bottom: 0.4rem;
`;

export const Heading = styled.h2`
  font-weight: 500;
  font-size: 1.9rem;
  margin: 0 0 2rem;
  ${DoubleShadow}
`;

// ---------- Slike ----------
// Slika mesta: široka, na vrhu prve strane scene.
export const PlaceFigure = styled.figure`
  margin: 0 0 1.8rem;
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 3px;
    box-shadow: 0 10px 30px -18px rgba(60, 40, 20, 0.5);
    animation: ${fadeUp} 1.2s ease both;
  }
`;

// Slika lika: manja, uz desnu ivicu teksta, sa imenom ispod.
export const PortraitFigure = styled.figure`
  float: right;
  width: clamp(120px, 28%, 190px);
  margin: 0.2rem 0 0.8rem 1.4rem;
  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 3px;
    box-shadow: 0 10px 30px -18px rgba(60, 40, 20, 0.5);
    animation: ${fadeUp} 1.2s ease both;
  }
  figcaption {
    margin-top: 0.4rem;
    text-align: right;
    font-family: ${({ theme }) => theme.fonts.ui};
    font-size: 0.68rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.inkFaint};
  }
`;

// ---------- Proza ----------
export const Paragraph = styled.p`
  margin: 0 0 1.35rem;
`;

// Ime govornika iznad replike.
export const Speaker = styled.span`
  display: block;
  margin-bottom: 0.1rem;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.amber};
`;

// Dugme za sledeću stranu: umesto "Dalje" prikazuje rečenicu koja nagoveštava šta sledi.
export const Hint = styled.button`
  display: block;
  margin: 2rem 0 0;
  padding: 0.5rem 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
  font-family: ${({ theme }) => theme.fonts.prose};
  font-style: italic;
  font-size: 1.02rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.inkSoft};
  animation: ${fadeUp} 1.4s ease both;
  animation-delay: 0.6s;
  transition: color 0.25s ease;

  &::after {
    content: ' →';
    color: ${({ theme }) => theme.colors.amber};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.ink};
  }
`;

// ---------- Izbori ----------
export const MenuWrap = styled.div`
  margin-top: 2.4rem;
  padding-top: 1.6rem;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

// Rečenica koja uokviruje opcije (umesto naslova liste).
export const MenuLabel = styled.p`
  font-style: italic;
  font-size: 1.02rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.inkSoft};
  margin: 0 0 0.8rem;
  animation: ${fadeUp} ${({ theme }) => theme.motion.option} ease both;
`;

export const Option = styled.button`
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  width: 100%;
  text-align: left;
  border: 0;
  background: none;
  padding: 0.7rem 0.2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.menu};
  font-size: 0.98rem;
  line-height: 1.5;
  opacity: ${({ $ghost }) => ($ghost ? 0.7 : 1)};
  border-bottom: 1px dashed transparent;
  animation: ${fadeUp} ${({ theme }) => theme.motion.option} ease both;
  animation-delay: ${({ $i }) => `${0.4 + $i * 0.35}s`};
  transition: border-color 0.25s ease, padding-left 0.25s ease, color 0.25s ease;

  &::before {
    content: '${({ $ghost }) => ($ghost ? '—' : '◦')}';
    color: ${({ theme }) => theme.colors.amber};
    flex: none;
  }

  &:hover,
  &:focus-visible {
    padding-left: 0.7rem;
    border-bottom-color: ${({ theme }) => theme.colors.steel};
  }
`;

// ---------- Izbor lika na početku ----------
export const ChoiceRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 0 0 0.4rem;
`;

export const Choice = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  border: 2px solid ${({ theme, $on }) => ($on ? theme.colors.ink : theme.colors.line)};
  background: ${({ theme, $on }) => ($on ? theme.colors.ink : 'transparent')};
  color: ${({ theme, $on }) => ($on ? theme.colors.paper : theme.colors.ink)};
  padding: 0.65rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 0.86rem;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &::before {
    content: '${({ $on }) => ($on ? '●' : '○')}';
    font-size: 0.8rem;
    letter-spacing: 0;
    color: ${({ theme, $on }) => ($on ? theme.colors.amber : theme.colors.inkFaint)};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.ink};
  }
`;

export const NameInput = styled.input`
  display: block;
  width: 100%;
  max-width: 20rem;
  border: 0;
  border-bottom: 2px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  padding: 0.4rem 0.1rem;
  font-family: ${({ theme }) => theme.fonts.prose};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.ink};
  transition: border-color 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.inkFaint};
    font-style: italic;
  }

  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.amber};
  }
`;

// ---------- Dugmad ----------
export const Primary = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.ink};
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  padding: 0.75rem 1.8rem;
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 0.82rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.paper};
  }
`;

export const Quiet = styled(Primary)`
  border-color: ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.inkSoft};
`;
