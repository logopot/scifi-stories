import names from '../data/names.json';

/*
  Igrač: ime koje čitalac upiše i rod u kome se o njemu piše.
  Spisak imena (src/data/names.json) služi samo da se rod pogodi; čitalac ga uvek može promeniti.
*/
export const MAX_NAME = 18;

// Mala slova, bez dijakritika (đ -> dj), da "Đorđe", "Djordje" i "đorđe" budu isto ime.
export const normalizeName = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/đ/g, 'dj')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

const SETS = {
  m: new Set(names.m),
  f: new Set(names.f),
  both: new Set(names.both),
};

// Vraća 'm', 'f' ili null (ime nije na spisku ili može biti oba).
export const detectGender = (name) => {
  const key = normalizeName(name);
  if (!key || SETS.both.has(key)) return null;
  if (SETS.m.has(key)) return 'm';
  if (SETS.f.has(key)) return 'f';
  return null;
};

// Samo slova i crtica, jedna reč, prvo slovo veliko.
export const cleanName = (raw) => {
  const word = String(raw || '')
    .trim()
    .split(/\s+/)[0]
    .replace(/[^\p{L}-]/gu, '')
    .slice(0, MAX_NAME);
  if (!word) return '';
  return word.charAt(0).toLocaleUpperCase('sr') + word.slice(1);
};

// Izuzeci kod promene korena ("Petar" -> "Petre").
const VOC_EXCEPTIONS = { petar: 'Petre', aleksandar: 'Aleksandre' };

// Zvanje (vokativ). Pokriva uobičajena srpska imena; za neobične oblike vraća ime kakvo jeste.
export const vocative = (name, gender) => {
  if (!name) return name;
  const key = normalizeName(name);
  if (VOC_EXCEPTIONS[key] && name.toLocaleLowerCase('sr') === key) return VOC_EXCEPTIONS[key];
  const last = name.slice(-1).toLowerCase();
  const head = name.slice(0, -1);
  if (gender === 'f') {
    if (/ica$/i.test(name)) return `${name.slice(0, -1)}e`; // Milica -> Milice
    if (last === 'a') return `${head}o`; // Ana -> Ano, Marija -> Marijo
    return name; // Karmen, Ljubav...
  }
  // muško ime
  if (['a', 'o', 'e', 'i', 'u'].includes(last)) return name; // Nikola, Marko, Đorđe, Dragi
  if (last === 'k') return `${head}če`; // Novak -> Novače
  if (last === 'g') return `${head}že`;
  if (last === 'h') return `${head}še`;
  if (last === 'c') return `${head}če`;
  if (last === 'j') return name; // Matej...
  return `${name}e`; // Lazar -> Lazare, Goran -> Gorane
};

// Imena po zadatku kad čitalac ništa ne upiše.
export const DEFAULT_NAMES = { m: 'Lazar', f: 'Milica' };

// Gotov niz zamena za tokene {ime} {voc} {IME}.
export const nameTokens = (gender, name) => {
  const g = gender === 'f' ? 'f' : 'm';
  const ime = name || DEFAULT_NAMES[g];
  return { ime, voc: vocative(ime, g), IME: ime.toLocaleUpperCase('sr') };
};
