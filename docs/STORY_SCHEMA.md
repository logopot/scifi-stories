# Šema priče (`story.json`)

Precizan opis formata, izveden iz stvarnog koda (`src/engine/engine.js`, `src/engine/player.js`, komponente čitača, `scripts/check-story.mjs`) i iz priče „Bez opcije“ (`src/stories/bez-opcije/story.json`).
Sav tekst za čitaoca je na srpskom (ekavica, latinica) i u drugom licu (čitalac je glavni lik). Tekst je napisan u muškom rodu; ženska varijanta ide u poljima sa nastavkom `f` (vidi „Rod i imena“).

Priča živi u `src/stories/<slug>/story.json`; slike u `public/img/<slug>/`. Posle svake izmene: `npm run check-story`. Folder `src/stories/_template/` je minimalna ispravna priča za kopiranje; folderi koji počinju sa `_` nisu priče u registru; validator ih proverava samo kao šablone (bez teme i naslovne slike), a pojedinačno se mogu pokrenuti sa `npm run check-story -- _template`.

## Najviši nivo

```
{
  "meta":       { ... },        // naslov, opis, ose
  "ui":         { ... },        // tekstovi interfejsa
  "chapters":   { ... },        // poglavlja (može {})
  "start":      "id_scene",     // prva scena
  "endings":    { ... },        // jedan kraj po osi
  "nodes":      { ... },        // scene
  "images":     { ... },        // slike (može {})
  "characters": { ... }         // lica likova (može {})
}
```

## `meta`

| Polje | Tip | Značenje |
| --- | --- | --- |
| `title` | tekst | Naslov, prikazuje se na početnom ekranu čitača. |
| `subtitle` | tekst | Podnaslov ispod naslova na početnom ekranu. |
| `description` | niz tekstova (bar 1) | 2–3 kratka pasusa za stranicu priče. Bez otkrivanja zapleta i krajeva. |
| `axes` | niz od 2–4 objekta | Skrivene ose: `{ "id": "b", "name": "bekstvo / preživljavanje" }`. |

**Ose (`meta.axes`).** `id` je jedno malo slovo (jedinstveno), `name` služi samo autorima i čitaocu se NIKAD ne prikazuje. Ključevi u `endings` moraju biti tačno id-evi osa. Ako `meta.axes` nedostaje, engine uzima ključeve iz `endings`, ali validator to prijavljuje kao grešku.

## `ui`

Tekstovi koje čitač prikazuje (svi obavezni, validator ih proverava):

| Putanja | Gde se koristi |
| --- | --- |
| `ui.next` | Dugme za sledeću stranu kad strana nema `lead`. |
| `ui.finish` | Dugme na poslednjoj strani kraja (scena sa `end`). |
| `ui.start.intro` | Niz pasusa na početnom ekranu. |
| `ui.start.begin` | Dugme „Počni“. |
| `ui.start.continue` | Dugme za nastavak sačuvanog toka. |
| `ui.start.tip` | Savet pri dnu početnog ekrana. |
| `ui.start.note` | Napomena iznad dugmadi. |
| `ui.start.nameLabel`, `namePlaceholder` | Oznaka i primer za polje imena. |
| `ui.start.genderLabel` | Oznaka iznad izbora roda. |
| `ui.start.genders.m`, `genders.f` | Natpisi dugmadi za rod. |
| `ui.start.hintFound`, `hintUnknown`, `hintNeed` | Savet ispod izbora roda: ime prepoznato / nije prepoznato / rod još nije izabran. |
| `ui.start.chosen` | „Igraš kao:“ (iza toga ime). |
| `ui.start.defaults.m`, `defaults.f` | Ime koje se prikazuje kad čitalac ništa ne upiše (u tekstu priče tada važe imena iz `player.js`: Lazar / Milica). |
| `ui.mirror.kicker` | Sitna oznaka iznad naslova kraja (npr. „Kraj“). |
| `ui.mirror.restart` | Dugme „Počni ispočetka“ na ekranu kraja. |

## `chapters`

Objekat `{ "<id>": { "mark": "I", "name": "Beli pojas" } }`. Scena sa `chapter` i `showChapter: true` prikazuje na svojoj prvoj strani oznaku (`mark`) i naslov (`name`). Ako priča nema poglavlja: `{}`.

## `start`

Id scene u `nodes` sa koje čitanje počinje.

## `endings`

Tačno jedan unos po osi: `"<idOse>": { title, closing, closingf? }`.

| Polje | Tip | Značenje |
| --- | --- | --- |
| `title` | tekst | Naslov kraja (ne prolazi kroz tokene imena). |
| `closing` | niz tekstova | Završni pasusi; svaki prolazi kroz `{ime}` tokene. |
| `closingf` | niz tekstova | Ženska varijanta; mora imati isti broj pasusa kao `closing`. |

Kraj se prikazuje kad čitalac stigne do scene sa `end: "<idOse>"`.

## `nodes` (scene)

`"<id>": { ... }` sa poljima:

| Polje | Tip | Značenje |
| --- | --- | --- |
| `paragraphs` | niz pasusa (bar 1) | Proza scene (vidi dole). |
| `chapter` | id poglavlja | Poglavlje kome scena pripada. |
| `showChapter` | boolean | Prikaži naslov poglavlja na prvoj strani. |
| `img` | id slike | Široka „slika mesta“; prikazuje se na prvoj strani scene. |
| `prompt` | tekst | Rečenica iznad opcija; OBAVEZNA u scenama sa `choices`. |
| `promptf` | tekst | Ženska varijanta za `prompt`. |
| `choices` | niz izbora | Opcije na poslednjoj strani (vidi dole). |
| `hidden` | objekat | Skrivena opcija (vidi dole). |
| `next` | id scene | Prelaz bez izbora (dugme-nagoveštaj na poslednjoj strani). |
| `branch` | niz grana | Uslovni prelaz bez izbora: `[ { "if": {...}, "next": "id" }, { "next": "podrazumevano" } ]`. Prva grana čiji `if` važi pobeđuje; grana bez `if` važi uvek (stavi je poslednju). |
| `end` | id ose | Poslednja scena kraja: nakon nje sledi ekran kraja `endings[end]`. |

Svaka scena mora imati izlaz: `choices`, `next`, `branch` ili `end`. Sve scene moraju biti dostižne sa `start`.

### Pasusi (`paragraphs[]`)

| Polje | Tip | Značenje |
| --- | --- | --- |
| `t` | tekst (obavezno) | Tekst pasusa. |
| `tf` | tekst | Ženska varijanta teksta. |
| `lead` | tekst | Nagoveštaj ove strane: prikazuje se kao tekst dugmeta na PRETHODNOJ strani (umesto „Dalje“). Za prvu stranu scene prikazuje ga dugme na kraju prethodne scene. |
| `leadf` | tekst | Ženska varijanta za `lead`. |
| `who` | tekst | Ime govornika; prikazuje se iznad replike sa okruglim licem (vidi `characters`). `"Ti"` je čitalac. |
| `if` | uslov | Pasus se prikazuje samo ako uslov važi (vidi „Uslovi“). Računa se jednom, pri ulasku u scenu. |
| `img` | id slike | Veliki portret lika (`kind: "portrait"`), uz desnu ivicu teksta. |
| `solo` | boolean | Pasus uvek ima svoju stranu (ne lepi se na prethodnu). |
| `with` | niz imena | Lica likova koji se pojavljuju bez replike; red avatara iznad pasusa. |

**Pravila strana.** Svaki vidljiv pasus je jedna strana, osim kratkih replika: pasus čiji je tekst (posle zamene tokena) kraći od 80 znakova lepi se na prethodnu stranu, osim ako on ili prethodna strana imaju `solo`, ili je to prvi vidljiv pasus scene. Pri lepljenju `img` kratkog pasusa postaje portret strane ako je strana još nema. `lead` strane je `lead` njenog prvog pasusa. Slika mesta (`node.img`) ide na prvu stranu. Ako strana već prikazuje veliki portret lika (`img`), mali avatar istog lika se ne prikazuje.

Dugme na dnu strane: na stranama koje nisu poslednje prikazuje `lead` sledeće strane (ili `ui.next`); na poslednjoj strani scene sa izborom prikazuju se `prompt` i opcije; na poslednjoj strani scene bez izbora dugme prikazuje `lead` prve strane sledeće scene (ili `ui.finish` kad je scena `end`, odnosno `ui.next`).

### Izbori (`choices[]`)

| Polje | Tip | Značenje |
| --- | --- | --- |
| `id` | tekst | Jedinstven u celoj priči; koriste ga uslovi (`pick`, `notPick`, `any`). |
| `text` | tekst | Tekst opcije. |
| `textf` | tekst | Ženska varijanta. |
| `next` | id scene | Gde izbor vodi. |
| `w` | objekat | Težine po osama: `{ "b": 1, "u": 2 }`. Ključevi moraju biti deklarisane ose; nedostajuća osa = 0. |

Izbor se pamti kao `{ id, node, w, hidden }`; kraj proizlazi iz zbira svih težina, ne iz poslednjeg klika.

### Skrivena opcija (`hidden`)

`{ "id", "text", "textf"?, "next", "w", "after"? }`. Isti oblik kao izbor, plus `after`: broj sekundi oklevanja na poslednjoj strani scene posle kojih se opcija pojavi (podrazumevano 20). Prikazuje se prigušeno, posle ostalih opcija; bira se samo klikom (ne tasterom 1–9).

### Uslovi (`if`)

Objekat čija se sva prisutna polja moraju ispuniti (I):

| Polje | Važi kad |
| --- | --- |
| `pick: "id"` | je izbor sa tim id-em napravljen. |
| `notPick: "id"` | izbor sa tim id-em NIJE napravljen. |
| `any: ["id1", "id2"]` | je napravljen bar jedan od navedenih izbora. |
| `lead: "<idOse>"` | je trenutno vodeća osa baš ta. |

Svi id-evi moraju postojati, a `lead` mora biti deklarisana osa.

**Vodeća osa (`lead`).** Za svaku osu se sabiraju težine `w` svih dosadašnjih izbora; pobeđuje osa sa najvećim zbirom. Kod izjednačenja: idući unazad kroz izbore, među izjednačenim osama zadržava se ona koja je u tom izboru dobila najveću težinu (ako je ta težina veća od 0); prvi izbor koji razdvaja određuje pobednika, a ako ni jedan ne razdvoji, pobeđuje osa navedena prva u `meta.axes`.

## `images`

`"<id>": { "src": "img/<slug>/ime.jpg", "alt": "...", "kind": "portrait" | "place", "caption": "..." }`

- `src` je putanja u `public/` i počinje sa `img/<slug>/`; ako fajla nema, slika se jednostavno ne prikazuje (validator upozorava).
- `kind: "portrait"` (3:4) za likove; `caption` se ispisuje ispod velikog portreta. `kind: "place"` (16:9) za mesta.
- Slike mesta vezuju se poljem `img` na sceni, portreti poljem `img` na pasusu ili u `characters`.

## `characters`

Mapa lica po imenu govornika (tačno kao u `who`): `"Orsa": { "img": "orsa" }`.

- `img`: id portreta iz `images` (`kind: "portrait"`) ili `null` (prikazuje se krug sa prvim slovom imena). Ako slika nedostaje ili se ne učita, prikazuje se isto slovo.
- Svaki `who` i svaki lik iz `with` mora imati unos.
- Čitalac: `"__reader__": { "who": "Ti", "imgM": "citalac-m", "imgF": "citalac-z" }`. Pasusi čiji je `who` jednak `reader.who` (ili samo token `{ime}`/`{IME}`) prikazuju ime koje je čitalac upisao (ili Lazar/Milica) i portret prema rodu.
- Imena iz `who` prolaze kroz tokene imena samo ako ih sadrže.

## Rod i imena

Čitalac na početku upiše ime (opciono) i izabere rod (`m` ili `f`); rod se pogađa sa spiska imena `src/data/names.json`. Sav tekst je napisan u muškom rodu. Za ženski rod važi polje sa nastavkom `f`, ako postoji i nije prazno, inače se koristi osnovni tekst:

| Osnovno | Ženska varijanta |
| --- | --- |
| `paragraphs[].t` | `tf` |
| `paragraphs[].lead` | `leadf` |
| `node.prompt` | `promptf` |
| `choices[].text`, `hidden.text` | `textf` |
| `endings[].closing` (niz) | `closingf` (niz, isti broj pasusa) |

Kad menjaš muški tekst, izmeni i njegovu žensku varijantu.

**Tokeni imena** (zamenjuju se u `t`, `tf`, `lead`, `leadf`, `prompt`, `promptf`, `text`, `textf`, `closing`, `closingf` i u `who`): `{ime}` ime kako ga je čitalac upisao (ili Lazar / Milica), `{voc}` zvanje (Lazare, Milice, Petre; pravi `src/engine/player.js`, za neobična imena ostaje nepromenjeno), `{IME}` isto ime velikim slovima. Ne zamenjuju se u `endings[].title`, `chapters[].name` i `ui`.

## Čuvanje

Napredak se čuva po priči u `localStorage` pod `scifi-<slug>-v1` kao `{ node, picks, gender, name }`; ime i rod čitaoca za sve priče pod `scifi-reader-v1`. Brisanje scene ili izbora čiji se id nalazi u sačuvanom toku pravi nevažeći sačuvan tok (čitač ga tada ignoriše).

## Tasteri u čitaču

Razmak / Enter / → napred, ← nazad, 1–9 izbor opcije na poslednjoj strani. Ne rade dok je fokus u polju za unos.

## Validator (`npm run check-story`)

Greška (zaustavlja proveru) ako: `meta.axes` nije niz od 2–4 osa sa jedinstvenim jednoslovnim id-evima; `endings` nema kraj za neku osu ili ima kraj bez ose; neki `w` koristi nedeklarisanu osu; `end` ili `if.lead` nisu deklarisana osa; fali neki tekst iz `ui`; referenca vodi u nepostojeću scenu, izbor, sliku, poglavlje ili lik; `id` izbora se ponavlja; scena sa izborima nema `prompt`; scena nema izlaz ili je nedostižna; `meta.description` je prazan. Simulacija 20 000 nasumičnih igara: greška ako neka osa nikad ne pobedi ili ako je neki kraj dostignut u manje od 15% ili više od 55% igara. Upozorenja: nedostaju fajlovi slika, likovi bez portreta (slovo).

## Minimalna ispravna priča

Isto kao `src/stories/_template/story.json` (3 scene, 2 ose):

```json
{
  "meta": {
    "title": "Naslov priče",
    "subtitle": "Interaktivna naučnofantastična priča",
    "description": ["Kratak opis početne situacije, bez otkrivanja zapleta."],
    "axes": [
      { "id": "a", "name": "prva osa (samo za autore)" },
      { "id": "b", "name": "druga osa (samo za autore)" }
    ]
  },
  "ui": {
    "next": "Dalje",
    "finish": "Do kraja",
    "start": {
      "intro": ["Uvodni tekst na početnom ekranu."],
      "begin": "Počni",
      "continue": "Nastavi gde si stao",
      "tip": "Dalje ideš dugmetom, razmakom ili strelicom →, a opcije biraš klikom ili tasterima 1–9.",
      "genders": { "m": "Muški", "f": "Ženski" },
      "note": "Kraj priče ne zavisi od poslednjeg klika.",
      "nameLabel": "Kako se zoveš? (možeš da ostaviš prazno)",
      "namePlaceholder": "Tvoje ime",
      "genderLabel": "Rod u kome se piše o tebi:",
      "hintFound": "Prepoznato ime. Rod možeš da promeniš.",
      "hintUnknown": "Ne prepoznajem to ime. Izaberi rod u kome ćemo pisati o tebi.",
      "hintNeed": "Izaberi rod da bismo mogli da počnemo.",
      "chosen": "Igraš kao:",
      "defaults": { "m": "Lazar", "f": "Milica" }
    },
    "mirror": { "kicker": "Kraj", "restart": "Počni ispočetka" }
  },
  "chapters": {},
  "start": "pocetak",
  "endings": {
    "a": { "title": "Kraj A", "closing": ["Završni pasus kraja A."] },
    "b": { "title": "Kraj B", "closing": ["Završni pasus kraja B."] }
  },
  "nodes": {
    "pocetak": {
      "paragraphs": [
        { "t": "Stojiš na raskrsnici, {ime}. Pred tobom su dva puta.", "lead": "Dva puta, a ti stojiš između." }
      ],
      "prompt": "Kojim ćeš putem?",
      "choices": [
        { "id": "levo", "text": "Levo.", "next": "kraj_a", "w": { "a": 1 } },
        { "id": "desno", "text": "Desno.", "next": "kraj_b", "w": { "b": 1 } }
      ]
    },
    "kraj_a": { "paragraphs": [{ "t": "Put levo vodi do kraja A.", "lead": "Put koji je vodio ulevo." }], "end": "a" },
    "kraj_b": { "paragraphs": [{ "t": "Put desno vodi do kraja B.", "lead": "Put koji je vodio udesno." }], "end": "b" }
  },
  "images": {},
  "characters": {}
}
```

Za novu priču još: dodaj unos u `src/stories/index.js`, temu u `src/styles/themes.js` i slike u `public/img/<slug>/` (vidi README).

## Završeci i ton

Završeci su epilozi priče, kao kraj poglavlja u knjizi, a ne rešenje testa. Poslednja scena svakog kraja zatvara priču mirnom, konkretnom slikom ili ostavlja polaznu tačku za nastavak (dolazak, vrata, poruka, put, otvoreno pitanje u svetu). Nijedan tekst, ni uvod, ni opis, ni naracija, ni pitanja, ni završeci, ne komentariše izbore čitaoca kao ispravne, pogrešne, dobre, loše, označene ili preporučene, i ne kaže da su „odluke tvoje“. Nema ekrana sa rezultatom, ocenom ili zbirom izbora, i nijedan kraj ne imenuje izbor ni osu. Završni pasus je običan pasus priče (`t`, `tf` gde treba, `lead`), kratak (2–4 rečenice), bez objašnjenja smisla priče.
