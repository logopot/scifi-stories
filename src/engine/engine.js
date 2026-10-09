import story from '../data/story.json';
import { cleanName, nameTokens } from './player';

/*
  Ose (skriveni brojači), čitaocu se nikad ne prikazuju:
    b = bekstvo / preživljavanje
    s = slom sistema
    u = uklapanje
  Svaki izbor ima težine w: { b, s, u }. Kraj priče proizlazi iz zbira svih izbora.
*/
export const AXES = ['b', 's', 'u'];
const STORAGE_KEY = 'bez-opcije-v1';
// Kratki pasusi (replike) ostaju na istoj strani sa prethodnim pasusom.
const SHORT_PARAGRAPH = 80;

export const getNode = (id) => story.nodes[id];

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

// Strane scene: svaki pasus je nova strana, osim kratkih replika koje se lepe na prethodnu.
// Svaka strana nosi "lead": rečenicu koja nagoveštava šta na njoj sledi.
// Replike nose "who" (ime govornika koje se prikazuje iznad teksta).
export const buildPages = (node, picks, player = DEFAULT_PLAYER) => {
  const pages = [];
  visibleParagraphs(node, picks).forEach((p, i) => {
    const last = pages[pages.length - 1];
    const text = tr(p.t, p.tf, player);
    const lead = tr(p.lead, p.leadf, player);
    const line = { t: text, who: p.who || null };
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

export const getImage = (id) => (id && story.images ? story.images[id] || null : null);

export const resolveNext = (node, picks) => {
  if (node.branch) {
    const hit = node.branch.find((b) => matches(b.if, picks));
    return hit ? hit.next : null;
  }
  return node.next || null;
};

// Nagoveštaj prve strane sledeće scene (za dugme na kraju scene bez izbora).
export const nextSceneLead = (node, picks, player = DEFAULT_PLAYER) => {
  const nextId = resolveNext(node, picks);
  if (!nextId || !story.nodes[nextId]) return null;
  const first = buildPages(story.nodes[nextId], picks, player)[0];
  return first ? first.lead : null;
};

export const initialState = {
  screen: 'start', // start | play | mirror
  node: story.start,
  picks: [],
  ending: null,
  gender: DEFAULT_GENDER,
  name: '',
};

export const reducer = (state, action) => {
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

export const loadSaved = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (!saved || !story.nodes[saved.node] || !Array.isArray(saved.picks)) return null;
    if (saved.gender !== 'f') saved.gender = DEFAULT_GENDER;
    saved.name = cleanName(saved.name);
    return saved;
  } catch {
    return null;
  }
};

export const persist = (state) => {
  try {
    if (state.screen === 'play') {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ node: state.node, picks: state.picks, gender: state.gender, name: state.name })
      );
    } else if (state.screen === 'mirror') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* localStorage može biti nedostupan; priča radi i bez njega */
  }
};

export default story;
