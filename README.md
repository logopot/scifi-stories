# Drugi svet

Drugi svet je mali sajt sa interaktivnim naučnofantastičnim pričama (React 18 + Vite 5, styled-components 6, Bootstrap 5 grid).
Početna strana ima karticu za svaku priču, svaka priča ima svoju stranicu i čitač, a sve priče koriste isti motor.
Prva priča je „Bez opcije“. Čitalac bira među ponuđenim odgovorima posle svakog dela proze; kraj određuje obrazac svih izbora, ne poslednji klik. Sajt nikad ne ocenjuje i ne boduje izbore čitaoca.

## Pokretanje

```
npm install
npm run dev          # razvoj
npm run build        # produkcija (dist/)
npm run preview      # lokalni pregled builda (port 4173)
npm run check-story  # sve priče + teme (kontrast) + struktura komponenti
npm run check-story -- bez-opcije   # samo jedna priča (teme i struktura se i dalje proveravaju)
```

## Rute

| Ruta | Strana |
| --- | --- |
| `/` | Početna: kartice svih priča |
| `/:slug` | Stranica priče: naslovna slika, opis, dugme „Počni priču“ / „Nastavi priču“ |
| `/:slug/citaj` | Čitač: početni ekran → scene → kraj |
| ostalo | „Nema takve priče“ |

`public/_redirects` (`/* /index.html 200`) omogućava direktne linkove na Cloudflare Pages. Vite `base` je `'/'`.

## Struktura fajlova

```
src/
  components/      zajedničke komponente (Button, Sky, Heading, Figure, Scene, StartScreen, Mirror, StoryCard, Layout, ...)
  pages/           Landing, StoryPage, Reader, NotFound
  engine/          motor priče (engine.js), čuvanje (storage.js), reč i rod (player.js), StoryContext.js
  hooks/           useDocumentMeta, useStoryData
  stories/         index.js (registar), format.js, <slug>/story.json
  styles/          GlobalStyle.js, themes.js, tokens.js, mixins.js, animations.js, ThemeController.jsx
  data/names.json  spisak imena za pogađanje roda (zajednički za sve priče)
public/img/<slug>/ slike jedne priče
scripts/           check-story.mjs, check-themes.mjs, check-structure.mjs
```

## Konvencija za komponente

Svaka komponenta ima svoj folder (PascalCase) sa tačno ovim fajlovima:

```
Button/
  Button.jsx         komponenta: samo logika i markup, podrazumevani export
  Button.styled.js   sve styled-components te komponente (import * as S, koristi se S.Root, S.Title, ...)
  index.js           export { default } from './Button';   →   import Button from '../Button'
```

Pravila:

- Bez CSS-a u `.jsx` i bez `.css` fajlova (osim Bootstrap-a koji se uvozi jednom u `main.jsx`).
- Komponenta ne uvozi tuđi `.styled.js`: deli se komponovanjem komponenata, ili zajednički deo postaje svoja komponenta. Zajednički CSS delovi (npr. izgled dugmeta, dvostruka senka) su u `styles/mixins.js`.
- Prop koji služi samo stilu ide kao transient (`$variant`, `$on`).
- Komponenta koja postoji samo za jednog roditelja ide u `Roditelj/components/Dete/`.
- Boje, fontovi i razmaci se ne pišu u komponentama, nego se čitaju iz teme: `${({ theme }) => theme.accent}`, `theme.space[150]`.

`npm run check-story` (preko `scripts/check-structure.mjs`) pada ako folderu fali `Name.jsx` ili `Name.styled.js`, ako `.jsx` sadrži CSS, ako komponenta uvozi tuđi `.styled.js`, ako negde stoji sirova boja (hex, `rgb()`, `hsl()`) ili ako je upotrebljen razmak/veličina koji ne postoji u `tokens.js`.

## Teme

Sve boje žive u `src/styles/themes.js` i samo tamo. Svaka tema je običan objekat sa istim skupom tokena:

| Token | Značenje |
| --- | --- |
| `name` | slug teme (ključ za `<Sky>` i prelaze) |
| `mode` | `'light'` ili `'dark'` (`color-scheme`) |
| `sky` | pozadina: `'twin-suns'` (dva meka sunca), `'stars'` (zvezde), `'plain'` (samo gradijent) |
| `bg`, `bgSoft` | osnovna pozadina i njen tamniji/svetliji kraj gradijenta |
| `surface` | površina kartica i okvira |
| `text`, `textMuted`, `textFaint` | glavni tekst, prigušeni tekst, sitne oznake (broj strane, natpisi) |
| `accent` | akcenat (obrisi, naglašeni tekst, dekor) |
| `accentStrong`, `onAccent` | tamniji akcenat za pune pozadine (hover dugmeta, oznaka „Nastavi“, izabrana opcija, slovo-avatar) i beli tekst preko njega (bar 4.5:1) |
| `secondary`, `secondarySoft` | druga boja teme (hover linija, druga senka naslova) i njena prozirna varijanta |
| `glowA`, `glowB` | dva sjaja pozadine |
| `border` | linije i okviri |
| `selection` | boja označenog teksta (i prva senka naslova) |
| `focusRing` | obris fokusa |
| `shadow` | boja senke slika i kartica |
| `btnBg`, `btnText`, `btnBorder` | glavno dugme (Button primary, „Otvori“ na kartici) u mirovanju |
| `btnBgHover`, `btnTextHover`, `btnBorderHover` | isto dugme na hover i fokus tastaturom |
| `btnBgActive` | isto dugme dok je pritisnuto |
| `btnQuietText`, `btnQuietBorder`, `btnQuietBgHover`, `btnQuietTextHover` | tiho dugme (npr. „Počni ispočetka“): u mirovanju i na hover |
| `choiceBg`, `choiceBorder`, `choiceBgSelected`, `choiceTextSelected`, `choiceDot` | birljive opcije: dugmad za rod (neizabrano / izabrano) i marker opcija u čitaču |
| `btnDisabledBg`, `btnDisabledText` | onemogućeno dugme |
| `scrim`, `onImage` | preliv (rgba) preko slike na kartici i boja teksta preko njega; kontrast `onImage` naspram `scrim` (preko bele slike) mora biti bar 4.5:1 |
| `logoBackdrop` | pozadina kruga iza logoa (`transparent` na svetlim, svetao krug na tamnim temama) |
| `fontBody`, `fontHeading` | font teksta i naslova |

`tokens.js` sadrži sve što nije boja (razmaci `space`, veličine slova `fs`, `tracking`, `radii`, `breakpoints`, `transitions`, `zIndex`, `fonts`, ...) i spaja se sa temom u `getTheme(slug)`. Ključevi razmaka su stotinke jedinice: `theme.space[150]` = 1.5rem, `theme.fs[98]` = 0.98rem.

Primer nove teme:

```js
export const mojaPrica = {
  name: 'moja-prica', mode: 'light', sky: 'twin-suns',
  bg: '#eef2f7', bgSoft: '#dde5ef', surface: '#f8fafc',
  text: '#1d2733', textMuted: '#465566', textFaint: '#66788a',
  accent: '#2a5d9f', accentStrong: '#2a5d9f', onAccent: '#ffffff',
  secondary: '#c0792d', secondarySoft: 'rgba(192, 121, 45, 0.3)',
  glowA: 'rgba(90, 140, 220, 0.4)', glowB: 'rgba(240, 190, 120, 0.4)',
  border: 'rgba(29, 39, 51, 0.2)', selection: 'rgba(42, 93, 159, 0.3)',
  focusRing: '#2a5d9f', shadow: 'rgba(29, 39, 51, 0.4)',
  fontBody: fonts.serif, fontHeading: fonts.serif,
};
// pa u `themes`: 'moja-prica': mojaPrica,
```

Tema se bira po prvom segmentu URL-a (`ThemeController`), pa je poznata pre prvog crtanja; `vite.config.js` iz `themes.js` ubacuje boju pozadine i `theme-color` u `index.html`, tako da pri tvrdom osvežavanju nema treptaja. Kartice na početnoj strani se crtaju u temi svoje priče (ugnježdeni `ThemeProvider`). Teme „Tihi sat“ (tamna) i „Zelena granica“ (svetla) su rezervisana mesta; brišu se brisanjem unosa u `src/stories/index.js` i u `themes.js`.

`npm run check-story` proverava da sve teme imaju isti skup tokena i kontrast (WCAG): `text/bg`, `textMuted/bg`, `text/surface`, `onAccent/accentStrong`, `btnText/bg`, `btnTextHover/btnBgHover`, `btnQuietTextHover/btnQuietBgHover` i `choiceTextSelected/choiceBgSelected` moraju imati bar 4.5:1, a `btnBorder/bg` i `focusRing/bg` bar 3:1. Nova tema znači samo popuniti ceo skup tokena; dugmad ne sadrže nijednu boju.

Tema „Bez opcije“ je tačan izgled priče pre uvođenja tema; ne menja se.

## Kako se dodaje nova priča

1. Napravi `src/stories/<slug>/story.json` (format ispod); u `meta` dodaj `description` (2–3 kratka pasusa bez otkrivanja zapleta ili kraja).
2. Slike stavi u `public/img/<slug>/` (putanje u `images` počinju sa `img/<slug>/`); naslovna slika za karticu je `public/img/<slug>/cover.jpg` (16:9). Ako je nema, kartica dobija gradijent iz teme.
3. Dodaj jedan unos u `src/stories/index.js`:
   `{ slug, title, tagline, genre, minutes, cover, coverAlt, status: 'ready', load: () => import('./<slug>/story.json') }`
4. Dodaj temu u `src/styles/themes.js` (ključ u `themes` je isti slug).
5. Pokreni `npm run check-story`.

Napredak se čuva po priči u `localStorage` pod `scifi-<slug>-v1`; ime i rod čitaoca pamte se za sve priče pod `scifi-reader-v1`. Stari ključ `bez-opcije-v1` se jednokratno prebacuje u novi.

## Format scene u story.json

```
"id_scene": {
  "chapter": "c1", "showChapter": true,          // naslov poglavlja na prvoj strani (opciono)
  "paragraphs": [
    { "t": "pasus", "lead": "rečenica koja nagoveštava ovu stranu" },
    { "t": "uslovni pasus", "lead": "...", "if": { "pick": "idIzbora" } },   // pick | notPick | any:[...] | lead:"b"|"s"|"u"
    { "t": "Kratak pasus.", "solo": true }                                    // solo = uvek na svojoj strani
  ],
  "prompt": "Rečenica iznad opcija.",             // obavezna u scenama sa izborima
  "choices": [ { "id": "jedinstveniId", "text": "...", "next": "druga_scena", "w": { "b": 1, "s": 0, "u": 2 } } ],
  "hidden": { "id": "...", "text": "— ...", "next": "...", "w": {...}, "after": 22 },  // pojavi se posle N sekundi oklevanja
  "next": "scena",                // ili "branch": [ { "if": {...}, "next": "..." }, { "next": "podrazumevano" } ]
  "end": "b"                      // poslednja scena kraja (id jedne ose iz meta.axes)
}
```

**Strane:** svaki pasus je jedna strana. Pasusi kraći od 80 znakova (replike) lepe se na prethodnu stranu, osim ako imaju `solo`.
Dugme za sledeću stranu prikazuje `lead` te strane (umesto „Dalje“); na kraju scene bez izbora prikazuje `lead` prve strane sledeće scene.

Ose definiše svaka priča u `meta.axes` (2–4 ose, npr. `{ "id": "b", "name": "bekstvo" }`; ime je samo za autore), a ključevi `endings` su id-evi osa. Težine `w` se sabiraju kroz celu priču;
kod izjednačenja pobeđuje osa koju je čitalac poslednju pojačao. Čitalac na kraju vidi samo tekst kraja, bez statistike.
Kompletna šema (sva polja, pravila strana, uslovi, rod i tokeni imena) je u [docs/STORY_SCHEMA.md](docs/STORY_SCHEMA.md), a minimalna priča u `src/stories/_template/story.json`.
Posle svake izmene priče pokreni `npm run check-story`.

## Likovi (`characters`, `who`, `with`)

Na vrhu `story.json` stoji mapa `characters`; ključ je tačno ime govornika kakvo se koristi u `who`:

```
"characters": {
  "Orsa": { "img": "orsa" },     // img = id iz "images" (kind: "portrait")
  "Marta": { "img": null }       // bez portreta: krug sa prvim slovom imena
}
```

- Čitalac: unos `"__reader__": { "who": "Ti", "imgM": "citalac-m", "imgF": "citalac-z" }`. Pasusi sa `"who": "Ti"` (ili samo tokenom `{ime}`/`{IME}`) prikazuju ime koje je čitalac upisao (ili Lazar/Milica) i njegov portret prema rodu. Obična pripovedna proza nema lice, a dugmad izbora su samo tekst.
- Pasus sa `"who": "Orsa"` ispisuje ime govornika sa okruglim licem pored njega (isto lice na svakoj strani). Ako strana već prikazuje veliki portret tog lika (`img` na pasusu), mala slika se ne dodaje.
- Pasus može imati `"with": ["Marta"]`: red lica ispod kojih piše ime, iznad pasusa. Koristi se samo kad strana uvodi lik po imenu, a lik ne govori.
- Ako slika nedostaje ili se ne učita, prikazuje se slovo (nema ikone pokvarene slike i nema skakanja rasporeda).
- Kad dobiješ sliku za lik: dodaj unos u `images` (`kind: "portrait"`), fajl u `public/img/<slug>/` i promeni `img` u `characters`.
- `npm run check-story` traži da svaki `who` i `with` postoji u `characters`, da `img` postoji u `images`, i upozorava na likove bez portreta.

## Čitač: ponašanje

- Napred se ide samo dugmetom-nagoveštajem (i dugmadima izbora). Klik na tekst, sliku ili pozadinu ne radi ništa, a tekst se može označiti. Tasteri: razmak / Enter / → napred, ← nazad, 1–9 izbor opcije; ne reaguju dok je fokus u polju za ime.
- Svaka nova strana, scena, izbor, nastavak, restart i ekran kraja počinju na vrhu (`useScrollReset`, pre iscrtavanja, bez glatkog skrolovanja), a fokus prelazi na novu stranu. Slike imaju rezervisan prostor (16:9 za mesta, 3:4 za portrete).

## Slike

Slike nisu deo koda: stavi ih u `public/img/<slug>/` (JPG). Za „Bez opcije“:

- Likovi (portret, 3:4): `orsa.jpg`, `tehan.jpg`, `veles.jpg`, `dalja.jpg`, `iva.jpg`, `dara.jpg`
- Mesta (široke, 16:9): `beli-pojas.jpg`, `zenit.jpg`, `presek.jpg`, `luka.jpg`, `poravnanje.jpg`
- Ostali portreti (3:4): `marta.jpg`, `citalac-m.jpg`, `citalac-z.jpg` (lice čitaoca za muški i ženski rod)
- Naslovna slika kartice: `cover.jpg`

Spisak je u `story.json` pod `images`. Slika mesta se vezuje poljem `img` na sceni (prikazuje se na njenoj prvoj strani), slika lika poljem `img` na pasusu (prikazuje se uz taj pasus). Ako fajla nema, strana izgleda kao bez slike. `npm run check-story` upozorava na fajlove koji nedostaju.

## Ime i rod glavnog lika

Na početku čitalac upiše svoje ime (može i da ga ostavi praznim; tada je Lazar ili Milica). Rod se pogađa sa spiska imena `src/data/names.json` (mala slova, bez dijakritika); ako ime nije na spisku, čitalac bira rod sam. Spisak možeš da dopuniš u nizovima `m`, `f` i `both` (imena koja mogu biti oba, npr. Saša, gde se uvek pita).

Tekst je napisan u muškom rodu, a ženska varijanta je u dodatnim poljima: `tf` (pasus), `leadf` (nagoveštaj), `textf` (tekst izbora), `closingf` (završetak). Ime se ubacuje tokenima `{ime}`, `{voc}` (zvanje: Lazare, Milice, Petre) i `{IME}`. Zvanje pravi `src/engine/player.js` po pravilima srpskog jezika; za neobična imena ostaje nepromenjeno. Kad menjaš muški tekst pasusa, izmeni i `tf` tog pasusa. Ime i rod se čuvaju uz napredak, a poslednje upisano ime i rod unapred popunjavaju početni ekran sledeće priče.

## Objavljivanje

Sajt se hostuje na Cloudflare Pages iz grane `main` (build komanda `npm run build`, izlaz `dist`). Push na `main` pokreće automatski build i objavu. Radi na grani (npr. `landing-page`) i spoji u `main` tek kad je spremno.
