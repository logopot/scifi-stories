import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import story, { buildPages, getImage, getNode, nextSceneLead, resolveNext, tr } from '../engine/engine';
import {
  ChapterMark,
  Heading,
  Hint,
  MenuLabel,
  MenuWrap,
  Option,
  PageBox,
  PageNo,
  Paragraph,
  PlaceFigure,
  PortraitFigure,
  Speaker,
} from './ui';

const DEFAULT_IDLE_SECONDS = 20;
const CLICK_GUARD_MS = 350; // sprečava da dupli klik preskoči stranu

// Slika se prikazuje samo ako fajl postoji; ako ga nema, strana izgleda kao i pre.
function Picture({ id, as: Frame }) {
  const [ok, setOk] = useState(true);
  const image = getImage(id);
  if (!image || !ok) return null;
  return (
    <Frame>
      <img
        src={`${import.meta.env.BASE_URL}${image.src}`}
        alt={image.alt || ''}
        loading="lazy"
        onError={() => setOk(false)}
      />
      {image.kind === 'portrait' && image.caption && <figcaption>{image.caption}</figcaption>}
    </Frame>
  );
}

export default function Scene({ nodeId, picks, player, dispatch }) {
  const node = getNode(nodeId);
  // Strane se računaju jednom po sceni (uslovni pasusi zavise od ranijih izbora).
  const pages = useMemo(() => buildPages(node, picks, player), [nodeId]); // eslint-disable-line react-hooks/exhaustive-deps
  const [page, setPage] = useState(0);
  const [ghostVisible, setGhostVisible] = useState(false);
  const lastTurn = useRef(0);

  const isLast = page >= pages.length - 1;
  const hasChoices = Boolean(node.choices && node.choices.length);
  const chapter = node.chapter ? story.chapters[node.chapter] : null;
  const nextLead = !isLast ? pages[page + 1].lead : null;
  const sceneLead = isLast && !hasChoices && !node.end ? nextSceneLead(node, picks, player) : null;

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
    <article onClick={() => !isLast && turn(1)}>
      <PageBox key={`${nodeId}-${page}`}>
        {chapter && node.showChapter && page === 0 && (
          <>
            <ChapterMark>{chapter.mark}</ChapterMark>
            <Heading>{chapter.name}</Heading>
          </>
        )}

        {current.place && <Picture id={current.place} as={PlaceFigure} />}
        {current.portrait && <Picture id={current.portrait} as={PortraitFigure} />}

        {current.texts.map(({ t, who }, i) => (
          <Paragraph key={i}>
            {who && <Speaker>{who}</Speaker>}
            {t}
          </Paragraph>
        ))}

        {!isLast && (
          <Hint
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // inače bi klik na dugme i klik na članak okrenuli dve strane
              turn(1);
            }}
          >
            {nextLead || story.ui.next}
          </Hint>
        )}

        {isLast && hasChoices && (
          <MenuWrap onClick={(e) => e.stopPropagation()}>
            {node.prompt && <MenuLabel>{tr(node.prompt, node.promptf, player)}</MenuLabel>}
            {node.choices.map((c, i) => (
              <Option key={c.id} $i={i} type="button" onClick={() => choose(c)}>
                <span>{tr(c.text, c.textf, player)}</span>
              </Option>
            ))}
            {node.hidden && ghostVisible && (
              <Option $ghost $i={0} type="button" onClick={() => choose(node.hidden, true)}>
                <span>{tr(node.hidden.text, node.hidden.textf, player)}</span>
              </Option>
            )}
          </MenuWrap>
        )}

        {isLast && !hasChoices && (
          <Hint type="button" onClick={proceed}>
            {node.end ? story.ui.finish : sceneLead || story.ui.next}
          </Hint>
        )}

        {pages.length > 1 && (
          <PageNo>
            {page + 1} / {pages.length}
          </PageNo>
        )}
      </PageBox>
    </article>
  );
}
