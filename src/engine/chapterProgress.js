// Napredak kroz poglavlja: popuna tekućeg poglavlja = pročitane strane / (pročitane + preostale, procena).
// Preostale: stvarni broj strana tekućeg čvora + očekivani broj strana čvorova koji slede u ISTOM poglavlju
// (prosek preko mogućih sledećih čvorova; strane se grade iz engine.buildPages sa izborima do sada).
// Popuna u poglavlju nikad ne opada i ne prelazi CAP dok čitalac ne pređe u sledeće poglavlje.
export const CAP = 0.97;
const MIN_FIRST = 0.03;
const STEP = 0.01; // svaka nova strana pomera popunu bar za 1% segmenta
const MAX_DEPTH = 40;

export const chapterIds = (story) => Object.keys((story && story.chapters) || {});

// Putanja čitaoca kroz čvorove do tekućeg: [{ id, idx (broj izbora pre ulaska), chapter }]. null ako se ne može rekonstruisati.
export const walkPath = (story, engine, nodeId, picks) => {
  let cur = story.start;
  let idx = 0;
  let chapter = null;
  const out = [];
  for (let guard = 0; guard < 400; guard += 1) {
    const node = story.nodes[cur];
    if (!node) return null;
    chapter = node.chapter || chapter;
    out.push({ id: cur, idx, chapter });
    if (cur === nodeId && idx === picks.length) return out;
    if (node.choices && node.choices.length) {
      const pick = picks[idx];
      const choice = pick && [...node.choices, node.hidden].filter(Boolean).find((c) => c.id === pick.id);
      if (!choice) return null;
      idx += 1;
      cur = choice.next;
    } else {
      cur = engine.resolveNext(node, picks.slice(0, idx));
      if (!cur) return null;
    }
  }
  return null;
};

const successors = (node) => {
  if (node.choices && node.choices.length) return node.choices.map((c) => c.next);
  if (node.branch) return node.branch.map((b) => b.next);
  return node.next ? [node.next] : [];
};

// Očekivane strane iza čvora `id` unutar poglavlja `ch` (memoizacija po čvoru i poglavlju).
const expectedAfter = (ctx, id, ch, depth, visiting) => {
  const key = `${id}|${ch}`;
  if (ctx.memo.has(key)) return ctx.memo.get(key);
  if (depth > MAX_DEPTH || visiting.has(key)) return 0; // petlja ili preduboko: bez doprinosa
  visiting.add(key);
  const next = successors(ctx.story.nodes[id]).filter((n) => ctx.story.nodes[n]);
  let total = 0;
  if (next.length) {
    const sum = next.reduce((acc, nid) => {
      const n = ctx.story.nodes[nid];
      if (n.chapter && n.chapter !== ch) return acc; // sledeće poglavlje: procena se završava
      return acc + ctx.pages(nid) + expectedAfter(ctx, nid, ch, depth + 1, visiting);
    }, 0);
    total = sum / next.length;
  }
  visiting.delete(key);
  ctx.memo.set(key, total);
  return total;
};

// Jedan pratilac po priči: čuva najveću dostignutu popunu tekućeg poglavlja.
export const createTracker = () => {
  let state = null; // { chapter, read, value }
  let cache = { key: null, ctx: null };
  const update = ({ story, engine, slug, nodeId, picks, player, page, pagesCount }) => {
    const ids = chapterIds(story);
    if (ids.length < 2) return null;
    const path = walkPath(story, engine, nodeId, picks);
    const last = path && path[path.length - 1];
    const chapter = (last && last.chapter) || ids[0];
    const index = ids.indexOf(chapter);
    if (index < 0) return null;
    if (picks.length === 0 && nodeId === story.start && page === 0) state = null; // nova igra

    const key = `${slug}|${player.gender}|${picks.map((p) => p.id).join(',')}`;
    if (cache.key !== key) {
      const pageCount = new Map();
      cache = {
        key,
        ctx: {
          story,
          memo: new Map(),
          pages: (id) => {
            if (!pageCount.has(id)) pageCount.set(id, engine.buildPages(story.nodes[id], picks, player).length);
            return pageCount.get(id);
          },
        },
      };
    }
    // pročitano: sve strane ranijih čvorova ovog poglavlja + tekuća strana
    let read = page + 1;
    (path || []).slice(0, -1).forEach((e) => {
      if (e.chapter === chapter) read += engine.buildPages(story.nodes[e.id], picks.slice(0, e.idx), player).length;
    });
    const remaining = Math.max(0, pagesCount - (page + 1)) + expectedAfter(cache.ctx, nodeId, chapter, 0, new Set());
    const value = Math.min(CAP, read / (read + remaining));
    if (!state || state.chapter !== chapter) {
      state = { chapter, read, value: Math.max(MIN_FIRST, value) };
    } else if (read > state.read) {
      state = { chapter, read, value: Math.min(CAP, Math.max(value, state.value + STEP)) };
    } // strana unazad ili ista strana: popuna ostaje
    return { index: index + 1, total: ids.length, value: state.value };
  };
  return { update, reset: () => { state = null; } };
};
