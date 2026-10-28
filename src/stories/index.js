// Registar priča. Jedan unos po priči; boje su u src/styles/themes.js (ključ = slug).
// slug je INTERNI ključ priče (folder priče, folder slika public/img/<slug>/, tema, čuvanje napretka); javne adrese su path.
// path.sr: javna srpska adresa (podrazumevano jednaka slugu).
// en (opciono): engleska verzija { path, title, tagline, genre, coverAlt, load: () => import("./<slug>/story.en.json") };
//   priča se prikazuje na engleskoj strani samo ako ima en blok. Nakon izmene pokreni npm run redirects.
// status: 'ready' (ima story.json) | 'soon' (samo rezervisano mesto, nije otvoriva sa početne strane).
// Folderi koji počinju sa "_" (npr. _template) nisu priče i ovde se ne navode.
// Cover je putanja u public/ (bez početne kose crte); ako slike nema, kartica dobija gradijent teme.
// coverPosition (opciono, CSS object-position, podrazumevano 'center') bira koji deo slike ostaje vidljiv u kartici 3:4.
export const stories = [
  {
    slug: "bez-opcije",
    path: { sr: "bez-opcije" },
    title: "Bez opcije",
    tagline:
      "Na planeti Tandem nikada nije noć, a pred tobom se pojavljuju ponude.",
    genre: "Naučna fantastika",
    minutes: 40,
    cover: "img/bez-opcije/cover.webp",
    coverAlt: "Zenit: grad od kamena",
    status: "ready",
    load: () => import("./bez-opcije/story.json"),
  },
  {
    slug: "poslednja-mera",
    path: { sr: "poslednja-mera" },
    title: "Poslednja mera",
    tagline: "Grad na dnu brane deli vodu po pravilima koja više niko ne piše.",
    genre: "Naučna fantastika",
    minutes: 20,
    cover: "img/poslednja-mera/cover.webp",
    coverAlt: "Utočište: grad ispod Visoke brane i suvo dno jezera",
    status: "ready",
    load: () => import("./poslednja-mera/story.json"),
  },
  {
    slug: "tri-i-deset",
    path: { sr: "tri-i-deset" },
    title: "Tri i deset",
    tagline:
      "U planinskom gradu noćna smena čeka oblak otpada, a mašina već ima plan.",
    genre: "Naučna fantastika",
    minutes: 20,
    cover: "img/tri-i-deset/cover.webp",
    coverAlt: "Stub: toranj sa antenama iznad planinskog grada i Obruča u noći",
    status: "ready",
    load: () => import("./tri-i-deset/story.json"),
  },
  {
    slug: "tamni-sat",
    path: { sr: "tamni-sat" },
    title: "Tamni sat",
    tagline:
      "Na grebenu između polja i grada jedna stanica odlučuje čije će svetlo večeras ostati.",
    genre: "Naučna fantastika",
    minutes: 20,
    cover: "img/tamni-sat/cover.webp",
    coverAlt: "Stanica Greben na grebenu u sumrak, Svetla polja levo i grad Lantar desno",
    status: "ready",
    load: () => import("./tamni-sat/story.json"),
  },
  {
    slug: "pre-plime",
    path: { sr: "pre-plime" },
    title: "Pre plime",
    tagline:
      "U delti gde svako zrno ima pečat, jedna prognoza odlučuje šta će se posejati.",
    genre: "Naučna fantastika",
    minutes: 20,
    cover: "img/pre-plime/cover.webp",
    coverAlt: "Nasip: grad na nasipu iznad belih plićaka u sumrak",
    status: "ready",
    load: () => import("./pre-plime/story.json"),
  },
  // Rezervisana mesta (tamna i svetla tema). Za brisanje: ukloni unos ovde i temu u themes.js.
];

export const getStoryEntry = (slug) =>
  stories.find((s) => s.slug === slug) || null;

export const LANGS = ["sr", "en"];
export const DEFAULT_LANG = "sr";
// Adrese koje sajt koristi za sebe i ne smeju da se poklope sa putanjom priče.
export const RESERVED_PATHS = ["en", "dev", "img", "assets"];

// Jezik iz adrese: prefiks /en (samo ceo segment) = en, inače sr.
export const langFromPath = (pathname) => (/^\/en(\/|$)/.test(pathname || "") ? "en" : "sr");

// Da li priča postoji na datom jeziku (sr uvek, en samo sa en blokom).
export const hasLang = (entry, lang) =>
  lang === "en" ? Boolean(entry && entry.en && entry.en.path && entry.en.load) : Boolean(entry);

// Javna adresa priče (bez prefiksa jezika).
export const entryPath = (entry, lang) =>
  lang === "en" ? (entry.en && entry.en.path) || null : (entry.path && entry.path.sr) || entry.slug;

// Priča sa tekstovima izabranog jezika (naslov, opis, žanr, alt naslovne slike i load); ostala polja su zajednička.
export const localizeEntry = (entry, lang) => {
  if (lang !== "en" || !hasLang(entry, "en")) return entry;
  const { path, title, tagline, genre, coverAlt, load } = entry.en;
  return { ...entry, title, tagline, genre, coverAlt, load, publicPath: path };
};

export const findByPath = (lang, path) =>
  stories.find((s) => hasLang(s, lang) && entryPath(s, lang) === path) || null;

// Adresa početne strane i strane priče na jeziku (priča mora imati taj jezik).
export const homePath = (lang) => (lang === "en" ? "/en" : "/");
export const storyPath = (lang, entry) =>
  lang === "en" ? `/en/${entryPath(entry, "en")}` : `/${entryPath(entry, "sr")}`;

// Priče koje se prikazuju na početnoj strani jezika (već sa tekstovima tog jezika).
export const storiesFor = (lang) => stories.filter((s) => hasLang(s, lang)).map((s) => localizeEntry(s, lang));

// Interni ključ priče iz javne adrese (npr. "/en/dark-hour" → "tamni-sat"); null ako adresa nije priča.
// Bez strict važi i adresa drugog jezika (prekidač jezika), sa strict samo adresa jezika prefiksa (tema, 404).
export const keyFromPathname = (pathname, { strict = false } = {}) => {
  const lang = langFromPath(pathname);
  const parts = pathname.split("/").filter(Boolean);
  const first = lang === "en" ? parts[1] : parts[0];
  if (!first) return null;
  const other = lang === "en" ? "sr" : "en";
  const hit = findByPath(lang, first) || (strict ? null : findByPath(other, first));
  return hit ? hit.slug : null;
};
