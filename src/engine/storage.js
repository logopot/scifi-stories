// Sav pristup localStorage-u je ovde i uvek u try/catch: priča radi i kad je skladište nedostupno.
const LEGACY_KEY = 'bez-opcije-v1';
const READER_KEY = 'scifi-reader-v1';

export const storyKey = (slug) => `scifi-${slug}-v1`;

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* skladište nedostupno */
  }
};

const remove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* skladište nedostupno */
  }
};

// Jednokratno: stari ključ "Bez opcije" prelazi u novi, da čitaoci zadrže napredak.
export const migrateLegacy = () => {
  const old = read(LEGACY_KEY);
  if (old === null) return;
  if (read(storyKey('bez-opcije')) === null) write(storyKey('bez-opcije'), old);
  remove(LEGACY_KEY);
};

export const readSave = (slug) => {
  const raw = read(storyKey(slug));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// Laka provera za kartice i stranicu priče (bez učitavanja same priče).
export const hasSave = (slug) => {
  const s = readSave(slug);
  return Boolean(s && typeof s.node === 'string' && Array.isArray(s.picks));
};

export const writeSave = (slug, data) => write(storyKey(slug), JSON.stringify(data));
export const clearSave = (slug) => remove(storyKey(slug));

// Ime i rod čitaoca pamte se za sve priče (početni ekran sledeće priče je unapred popunjen).
export const loadReaderPrefs = () => {
  const raw = read(READER_KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (!p || typeof p !== 'object') return null;
    let gender = null;
    if (p.gender === 'm' || p.gender === 'f') gender = p.gender;
    return { name: typeof p.name === 'string' ? p.name : '', gender };
  } catch {
    return null;
  }
};

export const saveReaderPrefs = ({ name, gender }) => write(READER_KEY, JSON.stringify({ name, gender }));
