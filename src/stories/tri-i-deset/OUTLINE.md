# Struktura: „Tri i deset“

18 scena, 4 poglavlja. Prosečno oko 3.250 reči po igri (min 3.064, max 3.496), oko 18 minuta čitanja. Kraj: e 32.9%, t 34.2%, o 32.9% u 20.000 nasumičnih igara; namerne putanje ka osi daju tu osu.

## Graf

```
I   Stub          kapija -> sala
II  Noć           noc1 -> poruka -> terasa -> noc2
III Tri i deset   ponuda -> jedan -> test -> dva -> odbor -> odluka
IV  Jutro         kraj_e1 -> kraj_e2 | kraj_t1 -> kraj_t2 | kraj_o1 -> kraj_o2
```

Sve scene do `odluka` su zajedničke; razlika među putanjama je u `if` pasusima: svaka scena menja svoje strane prema prethodnom izboru (druga lokacija, drugi pratilac, druga informacija). `odluka` ima samo `branch` po vodećoj osi. Nema slepih grana.

## Pauza (moguće mesto zaključavanja)

Čvor **`ponuda`** (posle oko 1.700 reči, ~9–10 minuta, na kraju drugog kruga): Ognjen u hodniku kaže rečenicu koja menja situaciju (kompanija bi zaposlila celu smenu ako Stub večeras prepusti vođenje Sovi). Samo plan; ništa nije implementirano.

## Ritam

Svaka scena sa izborom ima tačno tri strane, pa je najduži niz bez odluke dve strane. Izuzeci: `odluka` (2 strane) i epilozi (4–7 strana).

| Scena | Strana | Odluka | Posledica prethodnog izbora |
| --- | --- | --- | --- |
| kapija | 3 | k_pult / k_sova / k_baterije (prvi izbor na 3. strani) | – |
| sala | 3 | s_pult / s_predlog / s_pumpa | prva strana (pult / zid sa Sovom / podrum) |
| noc1 | 3 | a_e / a_t / a_o | druga lokacija i pratilac (Lena i Jovo / Ognjen i Sova / Zora) |
| poruka | 3 | u_e / u_t / u_o | reakcija pratioca na poruku Uprave |
| terasa | 3 | t_budis / t_ekran / t_tamno | pratilac na terasi, Stanina rečenica o Upravi |
| noc2 | 3 | n_e / n_t / n_o | trg sa sirenom / krov / mrak |
| ponuda | 3 | o_e / o_t / o_o | Ognjenova rečenica prati ono što je rečeno ljudima |
| jedan | 3 | j_podela / j_hladnjaca / j_zatamnjenje | Ognjenova rečenica o ponudi |
| test | 3 | l_e / l_t / l_o | posledice podele zadataka |
| dva | 3 | d_ruke / d_jedanaest / d_pusti | Lenina proba |
| odbor | 3 | od_smena / od_sova / od_tama + skrivena od_cutanje (t:1, posle 22 s) | ishod dve mašine |
| odluka | 2 | – | – |

Povratne reference (callbacks): više od 20 `if` pasusa; u krajevima: e (t_budis, d_ruke, s_pumpa, l_e, n_e, a_e), t (s_predlog, j_hladnjaca, n_t, d_jedanaest, t_ekran, o_t), o (s_pumpa, t_tamno, d_pusti, k_baterije, j_zatamnjenje, n_o).

## Težine

kapija, sala, noc1, poruka: 1; terasa, noc2, ponuda, jedan, test, dva: 2; odbor: 3. Po jedna opcija za svaku osu u svakom izboru.
