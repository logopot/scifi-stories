# Struktura: „Ruke na konopcu“

17 čvorova: 11 u glavnom toku i 6 u krajevima (po dva čvora na kraj). Ose: `e` (briga o ljudima), `t` (poverenje u mašinu i napredak), `o` (opstanak luke i oprez). Imena osa i poglavlja ne prikazuju se čitaocu.

## Graf

```
dok ──(S1: fenjer / pečat / konzola)──▶ oglasna
oglasna ──(R1: Kupola / Donja sala / Pogon)──▶ kupola | uzarnica | pogon
kupola, uzarnica, pogon ──(mali izbori)──▶ prilaz
prilaz ──(R2: most / Oglasna soba sa pregovorom / Oglasna soba sa Talom)──▶ most | razgovor
most, razgovor ──(mali izbori)──▶ magla                 ← pauza
magla ──(R3: ljudi / Tala / kruženje)──▶ vez
vez ──(mali izbor: Ilka / Dora / sat)──▶ odluka
odluka ──(čvor odluke: e 4 / t 4 / o 4 + skrivena opcija)──▶ kraj_e1 | kraj_t1 | kraj_o1
kraj_x1 ──▶ kraj_x2 (kraj, ekran epiloga)
```

Skrivena opcija (`od_ceka`, posle 20 sekundi oklevanja na odluci): „Držiš pečat u ruci i čekaš.“ vodi u kraj `o` (težine o 2, e 1).

## Poglavlja

| Poglavlje | Čvorovi | Približno strana |
| --- | --- | --- |
| c1 „Dok“ | dok, oglasna | 3 + 15 |
| c2 „Obilazak“ | kupola, uzarnica, pogon, prilaz | 12 + 16 |
| c3 „Magla“ | most, razgovor, magla | 12 + 14 |
| c4 „Pečat“ | vez, odluka | 10 + 11 |
| c5 „Svitanje“ | 6 čvorova kraja | 2 × 11 |

## Pauza (moguće mesto zaključavanja)

Čvor `magla`, poslednja strana (kraj druge runde, oko 10. minuta): kapetanka Brina kaže jednu rečenicu koja menja situaciju („…ostalih osam ne vide ni mene. Kako ja sletim, tako sleću svi.“), a izbor R3 još čeka. Samo planska beleška: ništa nije implementirano.

## Mesta i slike

| Čvor | Slika mesta | Napomena |
| --- | --- | --- |
| dok | dok | početak, noćna magla |
| oglasna | oglasna | promena mesta: soba sa tablom |
| kupola | kupola | R1, grana 1 |
| uzarnica | uzarnica | R1, grana 2 |
| pogon | pogon | R1, grana 3 |
| prilaz | dok | povratak na dok |
| most | most | R2, grana 1 |
| razgovor | oglasna | R2, grane 2 i 3 |
| magla | magla | konvoj stiže |
| vez | (nasleđuje magla) | isto mesto |
| odluka | oglasna | pečat |
| kraj_e1, kraj_t1, kraj_o1 | (nasleđuju oglasna) | isto mesto |
| kraj_e2, kraj_t2, kraj_o2 | zora | svitanje |

Osam različitih slika mesta plus naslovna (`cover`). Svaka promena mesta ima `img`, prvi čvor ima `img`, nijedan čvor ne ponavlja sliku prethodnog.

## Ritam

Strana = jedna jedinica u čitaču (kratke replike se lepe na prethodnu). „Reč čitaoca“ = replika `Ti` (kratka, lepi se na stranu), „izbor“ = izbor na poslednjoj strani čvora.

| Čvor | Strana | Šta čitalac radi | Neposredna posledica prethodnog izbora |
| --- | --- | --- | --- |
| dok | 3 | reč čitaoca na 3. strani; mali izbor S1 (fenjer / pečat / konzola) na 3. strani | — |
| oglasna | 14–17 | 5 replika čitaoca; veliki izbor R1 | prva strana zavisi od S1 (fenjer osvetljava stepenice / pečat u šaci / Ilka pokazuje Kupolu) |
| kupola | 12 | 5 replika čitaoca; mali izbor (zapis / ćutanje / ponovljeno brojanje) | R1 je donela Doru i Talin zapis |
| uzarnica | 12 | 5 replika; mali izbor (znak lampom / čaj / pitanje) | R1 je donela Ilku, Tea i znak lampom |
| pogon | 8 | 5 replika; mali izbor (točak / manometar / Tala) | R1 je donela Tea i točak |
| prilaz | 14–22 | 7 replika čitaoca; veliki izbor R2 | prva strana zavisi od malog izbora u Kupoli, Donjoj sali ili Pogonu (list zapisa, čaj, nokat…) |
| most | 10–13 | 5 replika; mali izbor (Teo / Ilka / Tala) | R2: lampe, Teo, Ilka; prva lampa zavisi od S1 |
| razgovor | 7–15 | 6 replika; mali izbor (ponuda / Dora drži izveštaj / izlaz) | R2 menja prvu stranu i ko govori (Oskarova ponuda ili Talin odgovor) |
| magla | 11–17 | 6 replika; veliki izbor R3 | prva strana zavisi od malog izbora na mostu ili u razgovoru |
| vez | 4–12 | replike; mali izbor (Ilka / Dora / sat) | R3 menja ceo čvor (Ilka vodi lampama / Tala vezuje / konvoj kruži) |
| odluka | 7–13 | 4 replike; veliki izbor odluke + skrivena opcija | prva strana zavisi od malog izbora u vezu; Doru i Ilkinu repliku menjaju R2 i R3 |
| kraj_x1, kraj_x2 | 8–13 | reči čitaoca na svake 2–3 strane | Teo, Brina, Oskar i Dora se pozivaju na lampu, na mesto obilaska i na vez konvoja |

Provera pravila ritma (iz simulacije 3000 nasumičnih igara): najduži niz strana bez reči ili izbora čitaoca je 2; prva reč čitaoca je na 3. strani prve scene, a prvi pravi izbor na 3. strani; prosek je oko 3320 reči po igri (min 3170, max 3490).

## Mali izbori (koji menjaju sledeću stranu)

`p_fenjer`/`p_pecat`/`p_pitaj` (dok), `k_zapis`/`k_cuti`/`k_prijava` (Kupola), `u_signal`/`u_caj`/`u_pogled` (Donja sala), `g_tockak`/`g_manometar`/`g_pita` (Pogon), `m_teo`/`m_ilka`/`m_tala` (most), `z_ponuda`/`z_odlozi`/`z_izadji` (razgovor), `v_ilka`/`v_dora`/`v_sat` (vez). Svaki ima težinu 1 i menja bar jedan konkretan detalj u narednoj sceni.

## Callbacks (preko 6)

1. `p_fenjer` → prva lampa na mostu; Teo vraća fenjer u kraju `e`.
2. `u_signal` → Teo i Ilka na mostu; lampa u džepu u kraju `t`.
3. `r1_*` (mesto obilaska) → pasus o Kupoli / Donjoj sali / Pogonu u sva tri kraja.
4. `z_odlozi` → Dorin odgovor u odluci i u kraju `e`.
5. `r3_*` (kako je konvoj vezan) → Ilkina replika u odluci, Brinina replika u kraju `e`, pasus o spisku u kraju `t`.
6. `r1_pogon` + `g_*` → ventil u vezu.
7. `r2_razgovor` / `r2_tala` → Oskarova ponuda ili Talin odgovor.
8. `m_*` → pasus o lampama na početku čvora magla.

Tri su u krajevima (stavke 1, 3 i 5).

## Težine

Mali izbori nose težinu 1, veliki (R1, R2, R3) težinu 1, a odluka 4. Nasumična igra daje e ≈ 32%, t ≈ 32%, o ≈ 36% (20 000 simulacija); namerna igra ka jednoj osi daje njen kraj.
