# Bez opcije

Interaktivna naučnofantastična priča (React + Vite, styled-components, Bootstrap).
Čitalac bira među ponuđenim odgovorima posle svakog dela proze. U svetu priče ponude se pojavljuju u vazduhu, a sistem se zove Lumen. Kraj određuje obrazac svih izbora, ne poslednji klik.

## Pokretanje

```
npm install
npm run dev        # razvoj
npm run build      # produkcija (dist/)
npm run check-story  # provera grafa priče + simulacija krajeva
```

## Gde je šta

- `src/data/story.json` — SAV tekst (priča i interfejs) u jednom fajlu.
- `src/engine/engine.js` — stanje, brojači, uslovni pasusi, statistika za završni ekran.
- `src/components/` — `Scene` (proza pa opcije), `StartScreen`, `Mirror` (završni ekran), `ui.js` (styled komponente).
- `src/styles/` — `theme.js` i `GlobalStyle.js`.

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
  "end": "b"                      // poslednja scena kraja ("b" | "s" | "u")
}
```

**Strane:** svaki pasus je jedna strana. Pasusi kraći od 80 znakova (replike) lepe se na prethodnu stranu, osim ako imaju `solo`.
Dugme za sledeću stranu prikazuje `lead` te strane (umesto "Dalje"); na kraju scene bez izbora prikazuje `lead` prve strane sledeće scene.

Ose: `b` = bekstvo/preživljavanje, `s` = slom sistema, `u` = uklapanje. Težine `w` se sabiraju kroz celu priču;
kod izjednačenja pobeđuje osa koju je čitalac poslednju pojačao. Čitalac na kraju vidi samo tekst kraja, bez statistike.
Posle svake izmene priče pokreni `npm run check-story`.

## Slike

Slike nisu deo koda: stavi ih u `public/img/` pod ovim imenima (JPG):

- Likovi (portret, 3:4): `orsa.jpg`, `tehan.jpg`, `veles.jpg`, `dalja.jpg`, `iva.jpg`, `dara.jpg`
- Mesta (široke, 16:9): `beli-pojas.jpg`, `zenit.jpg`, `presek.jpg`, `luka.jpg`, `poravnanje.jpg`

Spisak je u `story.json` pod `images`. Slika mesta se vezuje poljem `img` na sceni (prikazuje se na njenoj prvoj strani), slika lika poljem `img` na pasusu (prikazuje se uz taj pasus). Ako fajla nema, strana izgleda kao bez slike. `npm run check-story` upozorava na fajlove koji nedostaju.

## Ime i rod glavnog lika

Na početku čitalac upiše svoje ime (može i da ga ostavi praznim; tada je Lazar ili Milica). Rod se pogađa sa spiska imena `src/data/names.json` (mala slova, bez dijakritika); ako ime nije na spisku, čitalac bira rod sam. Spisak možeš da dopuniš u nizovima `m`, `f` i `both` (imena koja mogu biti oba, npr. Saša, gde se uvek pita).

Tekst je napisan u muškom rodu, a ženska varijanta je u dodatnim poljima: `tf` (pasus), `leadf` (nagoveštaj), `textf` (tekst izbora), `closingf` (završetak). Ime se ubacuje tokenima `{ime}`, `{voc}` (zvanje: Lazare, Milice, Petre) i `{IME}`. Zvanje pravi `src/engine/player.js` po pravilima srpskog jezika; za neobična imena ostaje nepromenjeno. Kad menjaš muški tekst pasusa, izmeni i `tf` tog pasusa. Ime i rod se čuvaju uz napredak.
