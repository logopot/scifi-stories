# Plan strukture: „Pre plime“

20 čvorova: otvaranje (2), tri kruga (raskrsnica + srednja scena, u Zrnari razbijena na tri čvora + podrum Čuvara; tri paralelne scene pred ponoć), pauza, odluka (hub), šest završnih čvorova (dva po kraju). Jedan igrač prolazi kroz 10 čvorova (8 pre kraja + 2 završna), oko 75 strana i oko 3.235 reči (min 2.976, max 3.573).

Ose: `e` briga o ljudima, `t` poverenje u mašinu i napredak, `o` oprez i čuvanje zalihe. Težine: mali izbori 1, veliki izbori 2 (p_, c_), hub 4, skrivena opcija o:2 + e:1.

## Graf

```
kanal ── pristan ──┬─ (p_daj / p_plan / p_pita, isti sledeći čvor)
                   └─ raskrsnica ──┬─ zrnara ─ zrnara1 ─ zrnara2 ──┐
                                   ├─ merna ───┼─ cuvar ──┬─ vece ────┐
                                   └─ splav ───┘          ├─ parcela ─┼─ sat ── odluka ──┬─ kraj_e1 ─ kraj_e2 (e)
                                                           └─ ventil ──┘                  ├─ kraj_t1 ─ kraj_t2 (t)
                                                                                          └─ kraj_o1 ─ kraj_o2 (o)
                                                                              (skrivena: kraj_o1)
```

Poglavlja: I „Plićak“ (kanal, pristan, raskrsnica), II „Pečat“ (zrnara, merna, splav, cuvar), III „Plima“ (vece, parcela, ventil, sat i dalje).

## Ritam

Stranica = pasus od 80 i više znakova (kraći pasusi se lepe na prethodnu). Brojevi su najduža varijanta po čvoru.

| Čvor | Stranica | Šta čitalac bira ili radi | Neposredna posledica prethodnog izbora |
| --- | --- | --- | --- |
| kanal | 2 | mala: stati / signal / uže (isti sledeći čvor `pristan`) | (početak: već u kanalu, plima, fenjer) |
| pristan | 2 | velika: dati vreću / pokazati listu / pozvati u čamac | tri verzije dolaska devojke |
| raskrsnica | 8 | velika: tri kanala (`zrnara` / `merna` / `splav`) | tri verzije uvoda (vreća fali / fenjer iza / Jela u čamcu) |
| zrnara | 3 | mala: pokazati listu / čekati (`zrnara1`) | Anka i vreća, Anka i Jela |
| zrnara1 | 6 | mala: pitati za pečat / za prazna mesta (`zrnara2`) | rečenica o ploči sa listom ili o tišini |
| zrnara2 | 7 | mala: ključ / knjiga / pitanje (`cuvar`) | rečenica o pečatu ili o krugovima prašine |
| merna | 11 | mala: pitati Tok / ugovor / ćutati (`cuvar`) | Emilova rečenica o vreći, listi ili devojci |
| splav | 9 | mala: čitati listu / pokazati pečat / pitati za so (`cuvar`) | Pavle i narod |
| cuvar | 9 | velika: upaliti Čuvara / parcela / ventil | devet verzija ulaska u podrum |
| vece | 10 | mala: traka naglas / Pavlu / u džep (`sat`) | druga scena (dvorana Veća) |
| parcela | 9 | mala: zemlja / ptice / najgora greda (`sat`) | druga scena (Niska strana) |
| ventil | 7 | mala: točak / Pavle / ostaviti (`sat`) | druga scena (ventil, Tok) |
| sat | 9 | mala: koga prvo pitati (`odluka`) | devet verzija prvog pasusa, devet odjeka srednje scene |
| odluka | 7 | velika: tri kraja + skrivena opcija | odgovor na pitanje sa pristana, odjeci prvih izbora |
| kraj_x1 | 6–7 | — | callback na izbore |
| kraj_x2 | 4–6 | — | završni pasus |

Prvi klik je na 2. strani (`kanal`), prvi pravi izbor na 4. strani (`pristan`). Prosečan razmak između klikova je oko 7 strana, najduži oko 12 (`sat`; `zrnara` je razbijena na tri čvora od 3, 6 i 7 strana, prosek razmaka pao sa 7,9 na 7,3). Pravilo „bar svaka druga strana“ nije ostvarivo u zadatom okviru (14–18 čvorova, oko 3.200–3.800 reči); izbori su svi na kraju čvora, a jedan čvor ima najviše jedan skup opcija. Pasusi su zato sastavljeni tako da nikad ne idu tri strane naracije zaredom: strane se smenjuju sa replikama i sa kratkim replikama koje se lepe na naraciju.

## Mala interakcija

Deset skupova opcija vodi u isti sledeći čvor, a razlika je u konkretnom detalju u narednoj sceni (`if` uslovi): `kanal` (dolazak devojke), `zrnara` / `merna` / `splav` (devet uvoda u podrum), `vece` / `parcela` / `ventil` (devet odjeka u `sat`), `sat` (prva replika u `odluka`).

## Callback-ovi (bar šest, tri u krajevima)

1. `p_daj` → ploča broji 39 (raskrsnica), Anka „Trideset devet“ (zrnara), Emil „piše trideset devet“ (merna), prazan prvi red (odluka), Jelina vreća (kraj_e1), „greška u računu“ (kraj_t1).
2. `p_pita` → Jela u čamcu (raskrsnica), u Zrnari, u Mernoj kući, u podrumu, na parceli, uz čamac na pristanu, u Zrnari na kraju (kraj_o1).
3. `z_knjiga` → knjiga u podrumu, na stolu Veća (vece), na pristanu (sat), Anka traži knjigu nazad (kraj_e1).
4. `c_pali` → traka u Veću (vece), traka u knjizi (kraj_o1), Čuvar upaljen (kraj_e2), Čuvar preuzet (kraj_t2).
5. `vt_tocak` → uzdah vode (sat), voda do Niske strane (kraj_e1), do poslednje parcele (kraj_o2).
6. `v_traka` → traka na stubu (kraj_e2). `sa_emil` → ugovor o zakupu (kraj_t1). `k_*` → odjek prvog izbora u hubu (odluka).

## Pauza (moguće mesto zaključavanja)

Čvor `cuvar` (kraj druge runde, oko 10 minuta čitanja). Tok kaže: „Od tada sam jedini koji zna da li grešim, a to ne mogu sam da proverim.“ Samo beleška, ništa nije implementirano.

## Mesta i slike

| Čvor | Slika (id) | Napomena |
| --- | --- | --- |
| kanal | kanal | prva scena |
| pristan | niska | dolazak na pristan |
| raskrsnica | kanal | više prethodnika, povratak u kanal |
| zrnara, zrnara1, zrnara2 | zrnara | isto mesto, nasleđuje |
| merna | merna | |
| splav | splav | |
| cuvar | cuvar | |
| vece | nasip | dvorana Veća |
| parcela | niska | |
| ventil | ventil | |
| sat | nasip | više prethodnika |
| odluka | (nasleđuje nasip) | isto mesto kao `sat` |
| kraj_e1 | niska | |
| kraj_e2 | svitanje | |
| kraj_t1 | merna | |
| kraj_t2 | ventil | |
| kraj_o1 | zrnara | |
| kraj_o2 | svitanje | |

Devet različitih slika mesta.

## Provere

Svi govornici koji su ljudi imaju portret (Jela, Anka, Emil, Pavle, čitalac); samo Tok, mašina, ima `img: null`. Prvi čvor ima sliku, svaka promena mesta ima svoj `img`. Svi likovi se predstavljaju pre prve replike (u `sat` su sva četiri predstavljena za one koji ih još nisu sreli).
