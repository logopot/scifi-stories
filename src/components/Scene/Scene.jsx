import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { tr } from '../../engine/engine';
import { useStory } from '../../engine/StoryContext';
import useScrollReset from '../../hooks/useScrollReset';
import ChapterMark from '../ChapterMark';
import ChapterProgress from '../ChapterProgress';
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
const SWIPE_MIN_PX = 50; // najmanji vodoravni pomak za listanje prevlačenjem
const SWIPE_RATIO = 1.5; // vodoravni pomak mora biti bar toliko puta veći od vertikalnog
const SWIPE_HINT_KEY = 'swipeHintShown';
const SWIPE_HINT_PAGES = 3; // nagoveštaj "ili prevuci ulevo" se prikazuje na prvih par strana po sesiji
// Gest koji počinje na dugmetu, vezi, polju za unos ili u otvorenom panelu nije listanje.
const SWIPE_IGNORE = 'button, a, input, textarea, select, [role="dialog"], [contenteditable="true"]';

const readSwipeShown = () => {
  try {
    return Number(sessionStorage.getItem(SWIPE_HINT_KEY)) || 0;
  } catch {
    return 0;
  }
};
const writeSwipeShown = (n) => {
  try {
    sessionStorage.setItem(SWIPE_HINT_KEY, String(n));
  } catch {
    /* sessionStorage nije dostupan: nagoveštaj se samo ne pamti */
  }
};

export default function Scene({ nodeId, picks, player, dispatch, initialPage = 0 }) {
  const { story, engine } = useStory();
  const node = engine.getNode(nodeId);
  // Strane se računaju jednom po sceni (uslovni pasusi zavise od ranijih izbora).
  const pages = useMemo(() => engine.buildPages(node, picks, player), [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [page, setPage] = useState(initialPage);
  const [ghostVisible, setGhostVisible] = useState(false);
  const [swipeNote, setSwipeNote] = useState(false);
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
    const now = Date.now();
    if (now - lastTurn.current < CLICK_GUARD_MS) return;
    lastTurn.current = now;
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

  // Prevlačenje na telefonu: ulevo = dalje (na poslednjoj strani bez izbora isto što i dugme), udesno = nazad.
  // Na poslednjoj strani sa izborima ulevo ne radi ništa: izbor se bira samo dodirom. Skrol se ne dira (passive).
  useEffect(() => {
    let start = null;
    const onStart = (e) => {
      const t = e.touches[0];
      start = e.touches.length === 1 && t && !(e.target instanceof Element && e.target.closest(SWIPE_IGNORE)) ? { x: t.clientX, y: t.clientY } : null;
    };
    const onEnd = (e) => {
      const s = start;
      start = null;
      const t = e.changedTouches[0];
      if (!s || !t) return;
      const dx = t.clientX - s.x;
      const dy = t.clientY - s.y;
      if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < SWIPE_RATIO * Math.abs(dy)) return;
      writeSwipeShown(SWIPE_HINT_PAGES); // ko je prevukao, nagoveštaj mu više ne treba
      if (dx > 0) turn(-1);
      else if (!isLast) turn(1);
      else if (!hasChoices) proceed();
    };
    const onCancel = () => {
      start = null;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onCancel, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onCancel);
    };
  }, [isLast, hasChoices, turn, proceed]);

  // Nagoveštaj prevlačenja: samo na ekranu osetljivom na dodir, na strani sa dugmetom "dalje", prvih par strana po sesiji.
  const hasNextHint = !isLast || !hasChoices;
  useEffect(() => {
    if (!hasNextHint || !window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
      setSwipeNote(false);
      return;
    }
    const shown = readSwipeShown();
    if (shown >= SWIPE_HINT_PAGES) {
      setSwipeNote(false);
      return;
    }
    writeSwipeShown(shown + 1);
    setSwipeNote(true);
  }, [nodeId, page]); // eslint-disable-line react-hooks/exhaustive-deps

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
    other && { side: 'left', portrait: portraitOf(other), name: other.name },
    readerLine && { side: 'right', portrait: portraitOf(readerLine), name: readerLine.name },
  ].filter(Boolean);
  return (
    <S.Article>
      <ChapterProgress nodeId={nodeId} picks={picks} player={player} page={page} pagesCount={pages.length} />
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
          {!isLast && swipeNote && story.ui.swipe && <S.SwipeNote>{story.ui.swipe}</S.SwipeNote>}
          {choicesBlock}
          {isLast && !hasChoices && (
            <Hint onClick={proceed}>{node.end ? story.ui.finish : sceneLead || story.ui.next}</Hint>
          )}
          {isLast && !hasChoices && swipeNote && story.ui.swipe && <S.SwipeNote>{story.ui.swipe}</S.SwipeNote>}

          {pages.length > 1 && <PageNumber page={page + 1} total={pages.length} />}
        </PageBox>
      </SpeechPanel>
    </S.Article>
  );
}
