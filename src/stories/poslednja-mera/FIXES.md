# Jezička korektura i nova imena

Zaglavlje svake tabele: staro → novo, gde, zašto. Radnja, izbori, težine i struktura nisu menjani. Id-evi izbora (`k_razd`, `rz_*`) ostali su isti jer se ne prikazuju; id scene `razdelnik` je preimenovan u `merac`, a id slika `zaklon` i `nadan` u `utociste` i `vuk` (fajlovi `utociste.jpg`, `vuk.jpg`).

## Imena

| Staro → novo | Gde | Zašto |
| --- | --- | --- |
| Razdelnik → **Merač** (Merača, Meraču, Meračem; vokativ „Meraču“) | `story.json` (tekst, `who`, `characters`, alt/opis slike, id scene), CONCEPT, OUTLINE, IMAGE_PROMPTS | Zvuči kao titula, kratko je, vezano za „Odbor mere“ i „meru“ koju sistem izračunava. Druga dva kandidata: Dodeljivač (predugo), Brojač (gubi vezu sa merom). |
| Nadan → **Vuk** (Vuka, Vuku, Vukom) | isto + `images`, `characters`, `vuk.jpg` | Kratko, uobičajeno ime, nije u koliziji sa Teja/Ilarion/Oliva/Dalibor, ni sa Lazar/Milica. |
| Zaklon → **Utočište** (Utočišta, Utočištu, Utočištem; srednji rod) | naslov poglavlja, `meta`, uvod, tekst, alt slike, `index.js` (coverAlt), id slike | Grad pod branom je mesto gde se čeka, a iza kapija ostaje „samo za sebe“; ime je jasno i nosi ironiju. Glagoli uz ime prilagođeni srednjem rodu („Utočište pamti da je preživelo“, „celo Utočište se okuplja“). |
| Visočje → **Planinski savez** (paralela sa „Obalni sabor“) | tekst, izbori, CONCEPT | Traženo od autora (retka reč). Oblici: iz Planinskog saveza, sa Planinskim savezom. |

## Retke reči

| Staro → novo | Gde | Zašto |
| --- | --- | --- |
| ustava/ustave/ustavu → zapornica/zapornice/zapornicu | kapija, brana, vece, kraj_e, kraj_t, naslov kraja t („Zapornice bez ruku“), CONCEPT | Poznatija reč za branu sa kapijom za vodu. |
| darivati → poklanjati | dolazak, tabla pravila | Arhaično. |
| burići → burad | kapija | Neuobičajeno. |
| povijen → pogrbljen | brana | Neuobičajeno. |
| sedmični → nedeljni | kraj_e2 | Bliže ekavskoj svakodnevici. |
| izglačan → uglačan | brana | Pravilan oblik. |
| naseljenost → „gde je najgušće naseljeno“ | knjiga | Birokratska reč. |
| „dva sata“ → „dva ručna sata“ | brana, kraj_t1 | Moglo se pročitati kao „dva časa“. |

## Glagoli

| Staro → novo | Gde | Zašto |
| --- | --- | --- |
| Pregledao si… stigao do mesta gde se ona prestaje pisati → … stigao do reda koji niko ne čita (tf: Pregledala… stigla) | rezerva | Pogrešna konstrukcija; ženska varijanta usklađena. |
| stoji na kolenima → stoji na nogama | kraj_e2 | „Na kolenima“ znači klečati. |
| klimne glavom → klima glavom; zazvoni → zvoni; zasvetli… pojavi → svetli… pojavljuje se; pročita ekran → čita ekran; zastane → zastaje; podigne pogled → podiže pogled | pogon, vece, merac, kapija, izaslanik, kraj_t2 | Svršeni vid u sadašnjem pripovedanju. |
| prekrste/skinu/spuste → krste/skidaju/spuštaju; utišaju → utihnu | odluka | Isto. |
| Puštaš umesto Pustiš (skrivena opcija) | odbor | Slaganje sa „Ne govoriš“. |
| treća udari → treća udara; prva krči → škripi | kraj_o1 | Ujednačen vid; „krči“ ne ide uz kapiju. |
| zamolila da je pustim → zamolila me da je pustim | vece | Nedostajao objekat. |
| ko legne → ko je legao; ne dotičeš → ne diraš; dotičeš vodu → dodiruješ | kraj_o1, izaslanik, rezerva | Glagol i vid. |
| Nadan izračunao → „Merač je ovaj put sve izračunao“ | kraj_o2 | Nejasno ko je subjekat. |
| da se izneše → da se iznese | vece | Greška u pisanju. |
| Da Rezerva ostane zaključana… dok kapije ne budu zatvorene → dok su kapije zatvorene | rezerva | Logički pogrešan veznik. |

## Ostalo

| Staro → novo | Gde | Zašto |
| --- | --- | --- |
| Vi-oblik („vaš domaćin, Izvinite, Morate“) → ti-oblik | merac | Ostatak priče govori „ti“; Odbor ostaje na „vi“. |
| „Graditelji su mu dali ime u množini“ → „… kao obećanje, a ne kao opis“ | dolazak | Sabirnik nije u množini. |
| „Moja računica ne sabira / se sabrala“ → „Moj račun se ne slaže / se slaže“ | brana, rezerva | Kalk. |
| „oči ne učestvuju“ → „oči se ne smeju“ | revir | Kalk. |
| „Pao je sa zida koji je pao pre njega“ → „Pao je sa zida“ | revir | Besmislica. |
| „Dolazim da se ne udavimo… u suvom koritu“ → „da ne presušimo“ | izaslanik | Slika nije logična uz suvo. |
| „Odozdo se otvara pogled“ → „S druge strane“ | brana | Sa krune se gleda odozgo. |
| „Stepenice idu dole dvesta sedamnaest puta“ → „Stepenište ima dvesta sedamnaest stepenika“ | rezerva | Neprirodno. |
| „Odozgo kaplje jedna jedina kap, i svaka…“ → „… pada po jedna kap, i svaka…“ | rezerva | Protivrečnost. |
| „razlama se u male poluge“ → „lomi i rasipa u male odsjaje“ | rezerva | Mašinski prevod. |
| „kao da je to jedini deo njenog tela u koji nije sigurna“ → „kao da se plaši da će ga izgubiti“ | vece | Nejasno. |
| „Ono što je zapanjujuće… Sakupio je sredstvo da je ostvari“ → „Najgore je… Skupio je vodu da bi ga ispunio“ | knjiga | Mašinski prevod. |
| „Odbor mere nema lica na licu mesta“ → „se ne pojavljuje lično“ | odbor | Igra reči koja ne radi. |
| „Svako od toga je odluka“ → „Sve troje je odluka“ | odbor | Padež/slaganje. |
| „Svako jutro“ ponovljeno 4× → „Svakog jutra“ | kraj_e2 | Ponavljanje. |
| „Zaklon se i dalje svađa“ → „… raspravlja“ | kraj_e2 | Ponavljanje glagola iz prethodnog pasusa. |
| Kapija: „ne pogledaju“, „mimo“, „po jednom kantom“ → „ne gledaju“, „pored“, „sa kantom“ | kapija | Vid i predlog. |
| „Pomišljaš“ → „Misliš“; „Odozdo“ i sl. | dolazak | Neprirodno. |
| „Nastavi gde si stao“ → „Nastavi čitanje“ | ui.start.continue | Muški rod za oba čitaoca. |
| Ostalo (pojedinačne rečenice: odsjaj, „nečeg nalik pitanju“, „zaliha za tri meseca“, „uz sama vrata“, „pločnik“, „Ne maše rukama“…) | više scena | Prirodniji izraz, bez promene sadržaja. |
