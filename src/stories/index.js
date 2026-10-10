// Registar priča. Jedan unos po priči; boje su u src/styles/themes.js (ključ = slug).
// status: 'ready' (ima story.json) | 'soon' (samo rezervisano mesto, nije otvoriva sa početne strane).
// Folderi koji počinju sa "_" (npr. _template) nisu priče i ovde se ne navode.
// Cover je putanja u public/ (bez početne kose crte); ako slike nema, kartica dobija gradijent teme.
// coverPosition (opciono, CSS object-position, podrazumevano 'center') bira koji deo slike ostaje vidljiv u kartici 3:4.
export const stories = [
  {
    slug: 'bez-opcije',
    title: 'Bez opcije',
    tagline: 'Na planeti Tandem nikada nije noć, a pred tobom se pojavljuju ponude.',
    genre: 'Naučna fantastika',
    minutes: 40,
    cover: 'img/bez-opcije/cover.jpg',
    coverAlt: 'Zenit: grad od kamena',
    status: 'ready',
    load: () => import('./bez-opcije/story.json'),
  },
  {
    slug: 'poslednja-mera',
    title: 'Poslednja mera',
    tagline: 'Grad na dnu brane deli vodu po pravilima koja više niko ne piše.',
    genre: 'Naučna fantastika',
    minutes: 20,
    cover: 'img/poslednja-mera/cover.jpg',
    coverAlt: 'Utočište: grad ispod Visoke brane i suvo dno jezera',
    status: 'ready',
    load: () => import('./poslednja-mera/story.json'),
  },
  // Rezervisana mesta (tamna i svetla tema). Za brisanje: ukloni unos ovde i temu u themes.js.
  {
    slug: 'tihi-sat',
    title: 'Tihi sat',
    tagline: 'Nova interaktivna priča je u pripremi.',
    genre: 'Naučna fantastika',
    minutes: null,
    cover: null,
    coverAlt: '',
    description: ['Ova priča je u pripremi.'],
    status: 'soon',
    load: null,
  },
  {
    slug: 'zelena-granica',
    title: 'Zelena granica',
    tagline: 'Nova interaktivna priča je u pripremi.',
    genre: 'Naučna fantastika',
    minutes: null,
    cover: null,
    coverAlt: '',
    description: ['Ova priča je u pripremi.'],
    status: 'soon',
    load: null,
  },
];

export const getStoryEntry = (slug) => stories.find((s) => s.slug === slug) || null;
