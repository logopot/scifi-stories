# Koncept: „Jedra do Više obale“

Slug: `jedra-vise-obale`. Engleska adresa: `higher-shore`, engleski naslov „Sails to the Higher Shore“. Žanr: Naučna fantastika. Nedelja 2026-w45. Polazna tačka je zadatak iz sekcije 0b (ovo je „brief“, pa predlozi iz 1c tačka 11 nisu pisani).

Oblik: putovanje od tri dana na starom teretnom jedrenjaku kroz tri plutajuća sela (poglavlja: Dan prvi, Dan drugi, Dan treći, Kapija).
Čitalac: običan putnik sa kartom (broj četrdeset, poslednji upisan, poslednji ukrcan); ne odlučuje gotovo ništa dok ga pravilo broda ne dovede do jedne odluke.
Mod odlučivanja: Jedna velika odluka (mod 2). 11 malih izbora bez težina (svaki menja detalj na sledećoj strani), oko 45 kratkih replika čitaoca, jedna odluka sa težinama na 84–85% strana.
Ton: miran i setan po danu, zategnut trećeg dana.
Mašina: nema.

**Naslov:** Jedra do Više obale
**Tagline:** More na planeti raste, a mesta na Višoj obali ima za jedan manje nego što je ljudi. (u registru; 83 znaka)
**Opis (3 pasusa):** u `story.json` (`meta.description`), bez vesti i bez krajeva.

## Razlika od ranijih priča

| | Zimska ostava (w44) | Ruke na konopcu (w45, ranije) | Jedra do Više obale |
| --- | --- | --- | --- |
| Oblik | noć sa rokom | noć sa rokom | putovanje od tri dana |
| Čitalac | čuvar ključeva (zvaničnik) | nadzornik sa pečatom (zvaničnik) | običan putnik sa kartom |
| Mod | 1, mnogo odluka | 1, mnogo odluka | 2, jedna velika odluka |
| Ton | napet, tihi, hladna noć | napet, magla | miran i setan, zategnut tek trećeg dana |
| Mašina | da (Popis) | da (Tala) | ne |
| Završeci | tri završetka sa osama (otvori/veruj/zatvori, u duhu skeleta) | isto | ostati napolju / ostaviti porodicu / ući svi, bez „otvori, veruj, zatvori“ |

Razlika od svake od dve prethodne priče je u sva četiri tražena merila (oblik, uloga, mod, ton). Zabranjeni rekviziti nisu upotrebljeni: nema pečata ni ključa kao središnjeg predmeta, nema skrivene rezerve kao obrta, nema roka „do šest ujutru“ (rok je poklapanje meseci pri zalasku, kome se čitalac približava tri dana).

## Svet i pravila

Na planeti Rojni postoji jedan veliki okean i dva meseca. Svakih jedanaest godina oba se meseca poklope i more naraste za jedan „zub“. Niska obala tone, a njeni ljudi se sele na Višu obalu. Zavod Višeg dana drži kapiju Više obale i spisak, i dodeljuje mesta po kvoti. Kvota je manja od potrebe, pa svaka karta znači jedno mesto manje za nekog drugog. Stalan jak vetar čini jedra običnom tehnologijom (nema motora ni goriva; nigde se ne pominju gorivo, plovni putevi ni tesnaci).

Stari teretni brod Dugi Dah plovi tri dana između plutajućih sela ka Višoj obali. Mesta ima četrdeset. Pravilo broda: kad se ljudi i mesta ne slože na kapiji, onaj ko je poslednji stupio na palubu odlučuje ko ostaje van, jer taj nikome ništa ne duguje. Čitalac je poslednji: ukrcao se poslednji u luci, a u Pesku i u Gvožđu uvek poslednji diže mostić. U Gvožđu je trgovac Savo prodao prazna mesta ženi sa sinom i majkom. Dvoje putnika je sišlo, ostalo ih je trideset osam, uz to troje bez upisa: četrdeset i jedno lice, četrdeset mesta.

Pritisak raste kroz činjenice koje se gomilaju: meseci se približavaju (tri dlana, dva i po, dva, dva prsta, poklapanje), Zavodov čamac na horizontu, oluja, kapetan povređen, kapija u vidiku.

Jedina institucija je Zavod Višeg dana, prisutan samo kao kapija i spisak koji brod nosi. (Napomena: u zadatku se zvao „Fond Višeg dana“. „Fond“ već postoji u priči „Ruke na konopcu“ (Fond Zalog), pa je preimenovan u „Zavod“.)

Aritmetika (promena u odnosu na brief): brief govori o jednom prodatom mestu i četrdeset i jednoj osobi. Da bi zbir bio čist, dvoje putnika silazi u Gvožđu (38 imena na spisku), Savo prodaje „jedno mesto“ od praznih mesta, a stiže troje (38 + 3 = 41 za 40 mesta).

## Likovi

- **Lovro**, kapetan, oko 60, spor, šale koje niko ne razume (suva šala o mokrom moru i peglanju). Prva izgovara pravilo kao šalu, a ozbiljno tek na kraju.
- **Mina**, devojčica od deset godina, broji jedra i mesece, pita ravno.
- **Ratko**, krpač šavova i čuvar spiska, nizak, zabrinut. Broji i kad ne želi.
- **Hana**, lekarka, sedi pletenica, drveni sanduk sa lekovima; potrebna je Višoj obali (tri sela bez lekara).
- **Savo**, trgovac, glatak i simpatičan, nikad ne laže, ali ne kaže sve.
- **Sena**, majka, sa sinom **Jarom** (šest godina, ne govori; broji bureta) i starom majkom (ne govori, nema imena u priči). Samo Sena ima repliku, i portret.
- Svi su osobe, pa svi sa replikom imaju portret. Nema likova bez portreta.

## Ose i krajevi

Ose (samo za autore): `a` ustupiti svoje mesto, `b` ostaviti porodicu van kapije, `c` ući svi i ostaviti otvoreno. Nijedan kraj se ne prikazuje kao dobar ili loš, ispravan ili pogrešan.

- **a, „Čun na moru“:** čitalac ostaje u čunu; noć na mirnom moru; u svitanje malo jedro (otvoreno).
- **b, „Kroz kapiju“:** porodica silazi u Savov čamac ka Buradu, brod ulazi u kapiju, na obali Hana već leči; Minina kreda i krug na dasci (tiho zatvaranje).
- **c, „Četrdeset i jedno“:** brod prilazi kapiji sa svih četrdeset i jednim; čovek sa kapije broji, kapija ostaje otvorena na širinu jednog broda (otvoreno).

Prva odluka čitaoca na težinama je i jedina; skrivena opcija `od_ceka` (ćutiš i čekaš, posle 30 s) vodi u `c` sa težinom `c`.

## Mere

Simulacija: a 32,1 / b 31,6 / c 36,2 %; prosek reči 3550 (min 3458, max 3653).

## Pauza (moguće mesto zaključavanja)

Čvor `kajuta` (kraj drugog dana): Ratko kaže da na palubi broji četrdeset i jednu osobu i objašnjava pravilo broda. Oko 50% strana.

## Tabela izmišljenih imena i izraza

Stoji za (samo autorska beleška): u svaki red ulazi šta u vestima predstavlja.

| Ime / izraz | Stoji za | Padeži (nom, gen, dat, akuz, vok, instr, lok) | Engleski |
| --- | --- | --- | --- |
| Rojna (planeta) | svet na kome more raste | Rojna, Rojne, Rojni, Rojnu, Rojna, Rojnom, Rojni (u tekstu samo u opisu) | Rojna |
| Dugi Dah (brod) | stari teret koji nosi ljude | Dugi Dah, Dugog Daha, Dugom Dahu, Dugi Dah, Dugi Dahu, Dugim Dahom, Dugom Dahu | Dugi Dah |
| Viša obala | mesto koje prima manje nego što treba | Viša obala, Više obale, Višoj obali, Višu obalu, Viša obalo, Višom obalom, Višoj obali | the Higher Shore |
| Niska obala | obala koja tone | Niska obala, Niske obale, Niskoj obali, Nisku obalu, Niska obalo, Niskom obalom, Niskoj obali | the Lower Shore |
| zub | jedinica porasta mora | zub, zuba, zubu, zub, zube, zubom, zubu | tooth (a tooth of sea) |
| Zavod Višeg dana | institucija koja deli kvotu | Zavod, Zavoda, Zavodu, Zavod, Zavode, Zavodom, Zavodu | the Board of the Higher Day |
| kapija | prag kvote | kapija, kapije, kapiji, kapiju, kapijo, kapijom, kapiji | the gate |
| mostić | daska za ukrcavanje; pravilo broda | mostić, mostića, mostiću, mostić, mostiću, mostićem, mostiću | the gangplank |
| Pesak | prvo selo | Pesak, Peska, Pesku, Pesak, Pesče, Peskom, Pesku | Pesak |
| Gvožđe | drugo selo | Gvožđe, Gvožđa, Gvožđu, Gvožđe, Gvožđe, Gvožđem, Gvožđu | Gvožđe |
| Burad | treće selo, ostrvo od bureta | Burad, Burada, Buradu, Burad, Burade, Buradom, Buradu | Burad |
| pločica sa brojem | karta | — | number tag |
| Lovro | kapetan | Lovro, Lovra, Lovru, Lovra, Lovro, Lovrom, Lovru | Lovro |
| Mina | devojčica | Mina, Mine, Mini, Minu, Mino, Minom, Mini | Mina |
| Ratko | krpač i čuvar spiska | Ratko, Ratka, Ratku, Ratka, Ratko, Ratkom, Ratku | Ratko |
| Hana | lekarka | Hana, Hane, Hani, Hanu, Hano, Hanom, Hani | Hana |
| Savo | trgovac | Savo, Sava, Savu, Sava, Savo, Savom, Savu | Savo |
| Sena | majka | Sena, Sene, Seni, Senu, Seno, Senom, Seni | Sena |
| Jaro | dečak | Jaro, Jara, Jaru, Jara, Jaro, Jarom, Jaru | Jaro |

Provera imena (web pretraga): „Pesak“, „Gvožđe“, „Burad“, „Rojna“ i „Dugi Dah“ u kombinaciji sa „plutajuće selo“ nisu dali nijedan značajan stvarni lokalitet. Imena likova nisu ni u jednoj ranijoj priči (grep po svim `story.json`). Reč „Kapija“ postoji kao obična imenica u ranijim pričama, ali ne kao ime institucije ili mesta u ovoj.
