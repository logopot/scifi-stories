import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { tr } from '../../engine/engine';
import { useStory } from '../../engine/StoryContext';
import useScrollReset from '../../hooks/useScrollReset';
import ChapterMark from '../ChapterMark';
import CharacterRow from '../CharacterRow';
import Heading from '../Heading';
import Hint from '../Hint';
import Menu from '../Menu';
import MenuLabel from '../MenuLabel';
import MenuOption from '../MenuOption';
import PageBox from '../PageBox';
import PageNumber from '../PageNumber';
import SceneLine from '../SceneLine';
import SpeechPanel from '../SpeechPanel';
import * as S from './Scene.styled';

const DEFAULT_IDLE_SECONDS = 20;
const CLICK_GUARD_MS = 350; // sprečava da dupli klik preskoči stranu
const TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

export default function Scene({ nodeId, picks, player, dispatch, initialPage = 0 }) {
  const { story, engine } = useStory();
  const node = engine.getNode(nodeId);
  // Strane se računaju jednom po sceni (uslovni pasusi zavise od ranijih izbora).
  const pages = useMemo(() => engine.buildPages(node, picks, player), [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [page, setPage] = useState(initialPage);
  const [ghostVisible, setGhostVisible] = useState(false);
  const lastTurn = useRef(0);

  const isLast = page >= pages.length - 1;
  const hasChoices = Boolean(node.choices && node.choices.length);
  const chapter = node.chapter ? story.chapters[node.chapter] : null;
  const nextLead = !isLast ? pages[page + 1].lead : null;
  const sceneLead = isLast && !hasChoices && !node.end ? engine.nextSceneLead(node, picks, player) : null;

  // Nova strana ili scena: na vrh pre iscrtavanja, a fokus na novu stranu (bez dodatnog skrola).
  const boxRef = useRef(null);
  useScrollReset([nodeId, page]);
  useLayoutEffect(() => {
    boxRef.current?.focus({ preventScroll: true });
  }, [nodeId, page]);

  // Skrivena opcija se pojavljuje tek kad čitalac okleva na poslednjoj strani sa izborom.
  useEffect(() => {
    if (!isLast || !hasChoices || !node.hidden) return undefined;
    const t = setTimeout(
      () => setGhostVisible(true),
      (node.hidden.after || DEFAULT_IDLE_SECONDS) * 1000
    );
    return () => clearTimeout(t);
  }, [isLast, hasChoices, nodeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const turn = useCallback(
    (delta) => {
      const now = Date.now();
      if (now - lastTurn.current < CLICK_GUARD_MS) return;
      lastTurn.current = now;
      setPage((p) => Math.max(0, Math.min(p + delta, pages.length - 1)));
    },
    [pages.length]
  );

  const proceed = useCallback(() => {
    if (node.end) {
      dispatch({ type: 'FINISH', ending: node.end });
      return;
    }
    const next = engine.resolveNext(node, picks);
    if (next) dispatch({ type: 'GOTO', next });
  }, [engine, node, picks, dispatch]);

  const choose = useCallback(
    (choice, hidden = false) => {
      dispatch({
        type: 'PICK',
        next: choice.next,
        pick: { id: choice.id, node: nodeId, w: choice.w || {}, hidden },
      });
    },
    [dispatch, nodeId]
  );

  // Tastatura: razmak / Enter / → = dalje, ← = nazad, 1-9 = izbor opcije na poslednjoj strani.
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const active = document.activeElement;
      if (active && (TYPING_TAGS.includes(active.tagName) || active.isContentEditable)) return;
      if (active?.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
      const forward = [' ', 'Enter', 'ArrowRight'].includes(e.key);
      if (e.key === 'ArrowLeft') {
        turn(-1);
        return;
      }
      if (!isLast && forward) {
        e.preventDefault();
        turn(1);
        return;
      }
      if (isLast && hasChoices && /^[1-9]$/.test(e.key)) {
        const choice = node.choices[Number(e.key) - 1];
        if (choice) choose(choice);
        return;
      }
      if (isLast && !hasChoices && forward) {
        e.preventDefault();
        proceed();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLast, hasChoices, node, turn, choose, proceed]);

  const current = pages[page];

  // Portreti sledeće strane se učitavaju unapred, da se pojave bez kašnjenja.
  useEffect(() => {
    const next = pages[page + 1];
    if (!next) return;
    next.texts
      .map((x) => (x.who ? engine.getCharacter(x.who, player).image : null))
      .concat(next.portrait ? [engine.getImage(next.portrait)] : [])
      .filter((img) => img && img.src)
      .forEach((img) => {
        new Image().src = `${import.meta.env.BASE_URL}${img.src}`;
      });
  }, [pages, page, engine, player]);

  const choicesBlock = isLast && hasChoices && (
    <Menu>
      {node.prompt && <MenuLabel>{tr(node.prompt, node.promptf, player)}</MenuLabel>}
      {node.choices.map((c, i) => (
        <MenuOption key={c.id} index={i} onClick={() => choose(c)}>
          {tr(c.text, c.textf, player)}
        </MenuOption>
      ))}
      {node.hidden && ghostVisible && (
        <MenuOption ghost index={0} onClick={() => choose(node.hidden, true)}>
          {tr(node.hidden.text, node.hidden.textf, player)}
        </MenuOption>
      )}
    </Menu>
  );

  // Izgled "scene": slika mesta je pozadina (vidi SceneBackdrop), tekst je u panelu. Uz panel stoje portreti govornika
  // strane: lik koji nije čitalac levo (sa imenom u zaglavlju), čitalac desno. Strana ima najviše ta dva govornika (vidi
  // buildPages). Strana bez replika nema portreta ni imena u zaglavlju.
  const lines = current.texts.map((x) => (x.who ? engine.getCharacter(x.who, player) : null));
  const otherIndex = lines.findIndex((c) => c && !c.reader);
  const readerIndex = lines.findIndex((c) => c && c.reader);
  const other = otherIndex >= 0 ? lines[otherIndex] : null;
  const readerLine = readerIndex >= 0 ? lines[readerIndex] : null;
  // Zaglavlje (ime) nosi lik koji nije čitalac; kad govori samo čitalac, ime čitaoca stoji u zaglavlju kao i ranije.
  const headIndex = other ? otherIndex : readerIndex;
  const head = other || readerLine;
  const portraitOf = (c) => (c && c.image ? c.image.src : null);
  const speakers = [
    other && { side: 'left', portrait: portraitOf(other) },
    readerLine && { side: 'right', portrait: portraitOf(readerLine) },
  ].filter(Boolean);
  return (
    <S.Article>
      <SpeechPanel
        name={head ? head.name : null}
        nameSide={head && head.reader ? 'right' : 'left'}
        speakers={speakers}
        resetKey={`${nodeId}-${page}`}
      >
        <PageBox compact key={`${nodeId}-${page}`} ref={boxRef}>
          {chapter && node.showChapter && page === 0 && (
            <>
              <ChapterMark>{chapter.mark}</ChapterMark>
              <Heading>{chapter.name}</Heading>
            </>
          )}

          {current.texts.map(({ t, with: withNames }, i) => {
            const speaker = lines[i];
            const extras = (withNames || []).map((n) => engine.getCharacter(n, player));
            // Ime iznad replike samo kad ga ne prikazuje zaglavlje panela.
            const label = speaker && !(i === headIndex && head) ? speaker.name : null;
            return (
              <React.Fragment key={i}>
                {extras.length > 0 && <CharacterRow characters={extras} />}
                <SceneLine label={label}>{t}</SceneLine>
              </React.Fragment>
            );
          })}

          {!isLast && <Hint onClick={() => turn(1)}>{nextLead || story.ui.next}</Hint>}
          {choicesBlock}
          {isLast && !hasChoices && (
            <Hint onClick={proceed}>{node.end ? story.ui.finish : sceneLead || story.ui.next}</Hint>
          )}

          {pages.length > 1 && <PageNumber page={page + 1} total={pages.length} />}
        </PageBox>
      </SpeechPanel>
    </S.Article>
  );
}
