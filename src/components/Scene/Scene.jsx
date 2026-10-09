import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildPages, resolveNext, tr } from '../../engine/engine';
import { useStory } from '../../engine/StoryContext';
import ChapterMark from '../ChapterMark';
import Figure from '../Figure';
import Heading from '../Heading';
import Hint from '../Hint';
import Menu from '../Menu';
import MenuLabel from '../MenuLabel';
import MenuOption from '../MenuOption';
import PageBox from '../PageBox';
import PageNumber from '../PageNumber';
import Paragraph from '../Paragraph';
import * as S from './Scene.styled';

const DEFAULT_IDLE_SECONDS = 20;
const CLICK_GUARD_MS = 350; // sprečava da dupli klik preskoči stranu

export default function Scene({ nodeId, picks, player, dispatch }) {
  const { story, engine } = useStory();
  const node = engine.getNode(nodeId);
  // Strane se računaju jednom po sceni (uslovni pasusi zavise od ranijih izbora).
  const pages = useMemo(() => buildPages(node, picks, player), [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [page, setPage] = useState(0);
  const [ghostVisible, setGhostVisible] = useState(false);
  const lastTurn = useRef(0);

  const isLast = page >= pages.length - 1;
  const hasChoices = Boolean(node.choices && node.choices.length);
  const chapter = node.chapter ? story.chapters[node.chapter] : null;
  const nextLead = !isLast ? pages[page + 1].lead : null;
  const sceneLead = isLast && !hasChoices && !node.end ? engine.nextSceneLead(node, picks, player) : null;

  // Nova strana ili scena: na vrh.
  useEffect(() => {
    window.scrollTo({ top: 0 });
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
    const next = resolveNext(node, picks);
    if (next) dispatch({ type: 'GOTO', next });
  }, [node, picks, dispatch]);

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
      const tag = document.activeElement?.tagName;
      if (tag === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
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

  return (
    <S.Article onClick={() => !isLast && turn(1)}>
      <PageBox key={`${nodeId}-${page}`}>
        {chapter && node.showChapter && page === 0 && (
          <>
            <ChapterMark>{chapter.mark}</ChapterMark>
            <Heading>{chapter.name}</Heading>
          </>
        )}

        {current.place && <Figure image={engine.getImage(current.place)} variant="place" />}
        {current.portrait && <Figure image={engine.getImage(current.portrait)} variant="portrait" />}

        {current.texts.map(({ t, who }, i) => (
          <Paragraph key={i} who={who}>
            {t}
          </Paragraph>
        ))}

        {!isLast && (
          <Hint
            onClick={(e) => {
              e.stopPropagation(); // inače bi klik na dugme i klik na članak okrenuli dve strane
              turn(1);
            }}
          >
            {nextLead || story.ui.next}
          </Hint>
        )}

        {isLast && hasChoices && (
          <Menu onClick={(e) => e.stopPropagation()}>
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
        )}

        {isLast && !hasChoices && <Hint onClick={proceed}>{node.end ? story.ui.finish : sceneLead || story.ui.next}</Hint>}

        {pages.length > 1 && <PageNumber page={page + 1} total={pages.length} />}
      </PageBox>
    </S.Article>
  );
}
