import { cleanName, nameTokens } from './player';
import { clearSave, readSave, writeSave } from './storage';

/*
  Ose (skriveni brojači), čitaocu se nikad ne prikazuju:
    b = bekstvo / preživljavanje
    s = slom sistema
    u = uklapanje
  Svaki izbor ima težine w: { b, s, u }. Kraj priče proizlazi iz zbira svih izbora.
*/
export const AXES = ['b', 's', 'u'];
// Kratki pasusi (replike) ostaju na istoj strani sa prethodnim pasusom.
const SHORT_PARAGRAPH = 80;

// Rod glavnog lika: 'm' (Lazar) ili 'f' (Milica). Tekst je napisan u muškom rodu,
// a ženska varijanta stoji u polju sa nastavkom "f" (tf, leadf, textf, closingf).
export const DEFAULT_GENDER = 'm';
const NAME_TOKENS = /\{(ime|voc|IME)\}/g;

// Igrač: { gender: 'm' | 'f', name: string }. Uzima žensku varijantu kad postoji i menja imena.
export const DEFAULT_PLAYER = { gender: DEFAULT_GENDER, name: '' };

export const tr = (base, fem, player = DEFAULT_PLAYER) => {
  const text = player.gender === 'f' && fem ? fem : base;
  if (typeof text !== 'string') return text;
  const names = nameTokens(player.gender, player.name);
  return text.replace(NAME_TOKENS, (_, k) => names[k]);
};

export const totals = (picks) => {
  const t = { b: 0, s: 0, u: 0 };
  picks.forEach((p) => AXES.forEach((a) => { t[a] += (p.w && p.w[a]) || 0; }));
  return t;
};

// Dominantna osa. Kod nerešenog: pobeđuje osa koju je čitalac poslednju pojačao među izjednačenima.
export const leadAxis = (picks) => {
  const t = totals(picks);
  const max = Math.max(...AXES.map((a) => t[a]));
  let cands = AXES.filter((a) => t[a] === max);
  for (let i = picks.length - 1; i >= 0 && cands.length > 1; i -= 1) {
    const w = picks[i].w || {};
    const best = Math.max(...cands.map((a) => w[a] || 0));
    if (best > 0) cands = cands.filter((a) => (w[a] || 0) === best);
  }
  return cands[0];
};

const matches = (cond, picks) => {
  if (!cond) return true;
  const ids = picks.map((p) => p.id);
  if (cond.pick && !ids.includes(cond.pick)) return false;
  if (cond.notPick && ids.includes(cond.notPick)) return false;
  if (cond.any && !cond.any.some((id) => ids.includes(id))) return false;
  if (cond.lead && leadAxis(picks) !== cond.lead) return false;
  return true;
};

// Pasusi koji se vide za dati skup izbora: [{ t, lead?, solo?, who? }]
export const visibleParagraphs = (node, picks) =>
  (node.paragraphs || []).filter((p) => matches(p.if, picks));

export const resolveNext = (node, picks) => {
  if (node.branch) {
    const hit = node.branch.find((b) => matches(b.if, picks));
    return hit ? hit.next : null;
  }
  return node.next || null;
};

// Strane scene: svaki pasus je nova strana, osim kratkih replika koje se lepe na prethodnu.
// Svaka strana nosi "lead": rečenicu koja nagoveštava šta na njoj sledi.
// Replike nose "who" (ime govornika koje se prikazuje iznad teksta).
export const buildPages = (node, picks, player = DEFAULT_PLAYER) => {
  const pages = [];
  visibleParagraphs(node, picks).forEach((p, i) => {
    const last = pages[pages.length - 1];
    const text = tr(p.t, p.tf, player);
    const lead = tr(p.lead, p.leadf, player);
    const line = { t: text, who: p.who || null, with: p.with || [] };
    if (i > 0 && !p.solo && !last.solo && text.length < SHORT_PARAGRAPH) {
      last.texts.push(line);
      if (p.img && !last.portrait) last.portrait = p.img;
    } else {
      pages.push({
        texts: [line],
        lead: lead || null,
        solo: Boolean(p.solo),
        place: i === 0 && node.img ? node.img : null, // slika mesta na prvoj strani scene
        portrait: p.img || null, // slika lika uz prvi nastup
      });
    }
  });
  return pages;
};

const makeReducer = (initialState) => (state, action) => {
  switch (action.type) {
    case 'BEGIN':
      return { ...initialState, screen: 'play', gender: action.gender === 'f' ? 'f' : DEFAULT_GENDER, name: cleanName(action.name) };
    case 'LOAD':
      return { ...state, ...action.saved, screen: 'play' };
    case 'PICK':
      return { ...state, picks: [...state.picks, action.pick], node: action.next };
    case 'GOTO':
      return { ...state, node: action.next };
    case 'FINISH':
      return { ...state, screen: 'mirror', ending: action.ending };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

// Motor vezan za jednu priču (story.json) i njen slug (ključ za čuvanje napretka).
export const createEngine = (story, slug) => {
  const getNode = (id) => story.nodes[id];
  const getImage = (id) => (id && story.images ? story.images[id] || null : null);

  // Lik po imenu govornika (ključ u story.characters): { name, imageId, image }; bez slike ostaje slovo.
  const getCharacter = (name) => {
    const c = story.characters && story.characters[name];
    const imageId = (c && c.img) || null;
    return { name, imageId, image: imageId ? getImage(imageId) : null };
  };

  // Nagoveštaj prve strane sledeće scene (za dugme na kraju scene bez izbora).
  const nextSceneLead = (node, picks, player = DEFAULT_PLAYER) => {
    const nextId = resolveNext(node, picks);
    if (!nextId || !story.nodes[nextId]) return null;
    const first = buildPages(story.nodes[nextId], picks, player)[0];
    return first ? first.lead : null;
  };

  const initialState = {
    screen: 'start', // start | play | mirror
    node: story.start,
    picks: [],
    ending: null,
    gender: DEFAULT_GENDER,
    name: '',
  };

  const loadSaved = () => {
    const saved = readSave(slug);
    if (!saved || !story.nodes[saved.node] || !Array.isArray(saved.picks)) return null;
    if (saved.gender !== 'f') saved.gender = DEFAULT_GENDER;
    saved.name = cleanName(saved.name);
    return saved;
  };

  const persist = (state) => {
    if (state.screen === 'play') {
      writeSave(slug, { node: state.node, picks: state.picks, gender: state.gender, name: state.name });
    } else if (state.screen === 'mirror') {
      clearSave(slug);
    }
  };

  return {
    story,
    slug,
    getNode,
    getImage,
    getCharacter,
    nextSceneLead,
    initialState,
    reducer: makeReducer(initialState),
    loadSaved,
    persist,
  };
};
