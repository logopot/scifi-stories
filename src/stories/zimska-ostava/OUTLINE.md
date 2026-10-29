# Plan strukture: „Zimska ostava“

18 čvorova, 5 poglavlja, 3 skrivene ose (`e` briga o ljudima, `t` poverenje u sistem i napredak, `o` opstanak i oprez), 3 kraja, jedna skrivena opcija (`od_ceka`, na čvoru `odluka`). Nazivi poglavlja i osa se čitaocu ne prikazuju.

## Graf čvorova

| Poglavlje | Čvor | Izlaz |
| --- | --- | --- |
| c1 Kapija | `kapija` | izbor (mali): `k_ulaz` (e1), `k_ceka` (o1), `k_popis` (t1) → `red` |
| c1 | `red` | izbor (mali): `s_sibica` (e1), `s_pitaj` (t1), `s_dalje` (o1) → `brojnica` |
| c1 | `brojnica` | **runda 1** (veliki): `b_uljara` (t1) → `uljara`, `b_zitnica` (e1) → `zitnica`, `b_spust` (o1) → `spust` |
| c2 Hale | `uljara` | izbor (mali): `u_broji` (o1), `u_dokaz` (t1) → `ranko` |
| c2 | `zitnica` | izbor (mali): `z_lomi` (e2), `z_zadnji` (o1) → `ranko` |
| c2 | `spust` (sa Dnom) | izbor (mali): `d_plomba` (e1), `d_ostavi` (o2) → `ranko` |
| c3 Nalog | `ranko` | **runda 2** (veliki): `r_gore` (t2) → `kancelarija`, `r_kapija` (e2) → `kapija2`, `r_dvoriste` (o2) → `dvoriste` |
| c3 | `kancelarija` | izbor (mali): `k_potpis` (t1), `k_odbij` (o1) → `sirena` |
| c3 | `kapija2` | izbor (mali): `g_vesna` (e1), `g_ranko` (t1), `g_ceka` (o1) → `sirena` |
| c3 | `dvoriste` | izbor (mali): `d2_utovar` (t1), `d2_zadrzi` (o1) → `sirena` |
| c4 Sat manje | `sirena` | **runda 3**: `p_zvono` (e1), `p_listic` (t1), `p_kljuc` (o1) → `odluka` |
| c4 | `odluka` | čvor odluke: `od_e` (e4) → `kraj_e1`, `od_t` (t4) → `kraj_t1`, `od_o` (o4) → `kraj_o1`; skrivena `od_ceka` (o2, e1; posle 20 s) → `kraj_o1` |
| c5 Jutro | `kraj_e1` → `kraj_e2` (end e); `kraj_t1` → `kraj_t2` (end t); `kraj_o1` → `kraj_o2` (end o) | |

Težine su simetrične po osama (svaka runda daje svakoj osi isti broj tačaka), pa nasumična igra daje krajeve 31% / 32% / 37% (simulacija validatora), a namerna igra ka jednoj osi pouzdano daje taj kraj.

## Pauza (moguće mesto zaključavanja)

`sirena`, kraj druge runde (oko 10 minuta): zvono najavljuje promenu naloga, novi listić kaže da sanke polaze sat ranije, a Rade prvi put naglas pominje Dno i ključ na ekseru. Ništa nije implementirano; samo beleška za planiranje.

## Mesta i slike

| Čvor | Slika |
| --- | --- |
| `kapija` | `kapija` |
| `red` | nasleđuje `kapija` |
| `brojnica` | `brojnica` |
| `uljara` | `uljara` |
| `zitnica` | `zitnica` |
| `spust` | `dno` |
| `ranko` | `brojnica` |
| `kancelarija` | `kancelarija` |
| `kapija2` | `kapija` |
| `dvoriste` | `dvoriste` |
| `sirena` | `brojnica` |
| `odluka` | nasleđuje `brojnica` |
| `kraj_e1` | `kapija` |
| `kraj_e2` | `jutro` |
| `kraj_t1` | `dvoriste` |
| `kraj_t2` | `jutro` |
| `kraj_o1` | `brojnica` |
| `kraj_o2` | `jutro` |

Priča koristi 8 različitih slika mesta (`kapija`, `brojnica`, `uljara`, `zitnica`, `dno`, `kancelarija`, `dvoriste`, `jutro`); `cover` je naslovna i ne koristi se ni u jednom čvoru.

## Ritam

„Stranice“ su približan broj strana u čitaču (pasus je strana, osim kratkih replika koje se lepe na prethodnu). „Ti“ označava reči čitaoca (replike sa `who: Ti`), a izbor je klik na kraju čvora.

| Čvor | Stranica | Čitalac | Odmah vidljiva posledica prethodnog izbora |
| --- | --- | --- | --- |
| `kapija` | 3 | Ti × 2, izbor (mali) | – (početak, usred situacije) |
| `red` | 9 | Ti × 2, izbor (mali) | Vesna ulazi, ostaje ili stavlja ruku uz ključ (`k_*`) |
| `brojnica` | 19 | Ti × 6, izbor (veliki, runda 1) | fenjer iza tebe ili starčeva rečenica (`s_*`); Vesna u sobi ili ne (`k_ulaz`) |
| `uljara` | 10 | Ti × 3, izbor (mali) | Vesna broji naglas ili ne (`k_ulaz`) |
| `zitnica` | 9 | Ti × 3, izbor (mali) | Vesna na vreći ili zvuk Kapije kroz zid (`k_ulaz`) |
| `spust` | 15 | Ti × 5, izbor (mali) | – |
| `ranko` | 17 | Ti × 7, izbor (veliki, runda 2) | trag hale u kojoj si bio (`b_*`, `z_*`, `d_*`, `u_dokaz`) |
| `kancelarija` | 9 | Ti × 2, izbor (mali) | prazna bačva na stolu (`u_dokaz`) |
| `kapija2` | 8 | Ti × 3, izbor (mali) | vreće idu iz ruke u ruku ili Vesna na rešetki (`z_lomi`) |
| `dvoriste` | 10 | Ti × 4, izbor (mali) | Dunja je već tu ili se predstavlja (`b_spust`) |
| `sirena` | 10 | Ti × 4, izbor (mali, runda 3) | Radeova rečenica o Dnu zavisi od `b_spust` |
| `odluka` | 11 | Ti × 3, izbor (veliki, čvor odluke) | uvodni pasus prema `p_*` |
| `kraj_*` (po dva) | 8 + 8 | Ti × 0–1 | pasusi prema `k_ulaz`, `z_lomi`, `d_*`, `d2_*` |

Provera pravila iz 1b:
- Prva interakcija je u prvoj trećini druge strane (Ti: „Čujem te“), prvi pravi izbor je na 3. strani (`kapija`).
- Najduži odsečak bez klika su `brojnica` i `ranko` (oko 17–19 strana, sa replikama čitaoca na svakih 2–5 strana). Broj čvorova je ograničen na 18, pa ove dve scene nisu podeljene; replike čitaoca drže ritam.
- Malih interakcija (izbora u istom toku koji menjaju sledeći pasus): 9 čvorova (`kapija`, `red`, `uljara`, `zitnica`, `spust`, `kancelarija`, `kapija2`, `dvoriste`, `sirena`); velikih odluka: 3 (`brojnica`, `ranko`, `odluka`).
- Runde 2 i 3 se razlikuju po putanji: druga runda vodi u Kancelariju, na Kapiju ili u Dvorište, svaka sa drugim sagovornikom i drugim informacijama.

## Povratne reference (pozivi unazad)

1. `k_ulaz` → Vesna u Brojnici, u Uljari, u Žitnici i u krajevima `e` i `o`.
2. `s_sibica` / `s_pitaj` → uvod Brojnice (zlatni odsjaj fenjera; starčeva rečenica o vozačima).
3. `b_*`, `z_*`, `d_*` → trag na tebi pri ulasku u `ranko`.
4. `u_dokaz` → prazna bačva u Brojnici i na stolu u Kancelariji.
5. `z_lomi` → vreće iz ruke u ruku na Kapiji i u krajevima `e`, `t`, `o`.
6. `b_spust` → Dunja u Dvorištu i Radeova rečenica o Dnu.
7. `d_plomba` / `d_ostavi` → krajevi `e`, `t`, `o` (Dno otvoreno, zaključano, van knjige).
8. `p_zvono`, `p_listic`, `p_kljuc` → uvodni pasus čvora `odluka`.
9. `d2_utovar` / `d2_zadrzi` → pasus u kraju `t`.
10. Dete sa limenom kutijom (na Kapiji, u kraju `e`, na vratima Brojnice u `odluka`), starac sa šibicama (`red`, kraj `t`), zelena lampa Popisa (od prve do poslednje scene).

U krajevima je poziva unazad više od tri (`k_ulaz`, `z_lomi`, `d_*`, `d2_*`, dete, starac, zelena lampa).
