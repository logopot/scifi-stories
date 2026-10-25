// Registar priča. Jedan unos po priči; boje su u src/styles/themes.js (ključ = slug).
// status: 'ready' (ima story.json) | 'soon' (samo rezervisano mesto, nije otvoriva sa početne strane).
// Folderi koji počinju sa "_" (npr. _template) nisu priče i ovde se ne navode.
// Cover je putanja u public/ (bez početne kose crte); ako slike nema, kartica dobija gradijent teme.
// coverPosition (opciono, CSS object-position, podrazumevano 'center') bira koji deo slike ostaje vidljiv u kartici 3:4.
export const stories = [
  {
    slug: "bez-opcije",
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
