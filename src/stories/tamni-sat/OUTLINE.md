# Plan strukture: „Tamni sat“

18 čvorova: otvaranje (1), tri kruga, odluka (hub), šest završnih čvorova (dva po kraju). Jedan igrač prolazi kroz 12 čvorova (10 pre kraja + 2 završna). Okvir od 14–18 čvorova i 3.200–3.800 reči po igri ostavlja prostor za oko 10 stranica između dva klika; kraće bi tražilo više čvorova.

Ose: `e` briga o ljudima, `t` tehnološki napredak, `o` red i granica. Težine: pojedinačni izbori 1 (poziv Ruži 2), odluka 4, skrivena opcija o:2 + e:1.

## Graf

```
smena ──┬─ krov ──┐
        └─ kula ──┴─ trafo ── poziv ──┬─ stari ──┐
                                       ├─ dario ──┤ (p_istina, p_skratio)
                                       └──────────┴─ polja ── ponoc ── vrelina ── grad ── odluka ──┬─ kraj_e1 ─ kraj_e2 (e)
                                                                                                    ├─ kraj_t1 ─ kraj_t2 (t)
                                                                                                    └─ kraj_o1 ─ kraj_o2 (o)
                                                                                           (skrivena: kraj_o1)
```

Poglavlja: I „Tamni sat“ (smena … trafo), II „Dugi vod“ (poziv … polja), III „Granica“ (ponoc … odluka).

## Ritam

Stranica = pasus od 80 i više znakova ili početak scene (kraći pasusi se lepe na prethodnu). Brojevi su za prolaz „uvek prva opcija“.

| Čvor | Stranica | Šta čitalac bira ili radi | Neposredna posledica prethodnog izbora |
| --- | --- | --- | --- |
| smena | 10 | velika podela: krov / kula | (početak) |
| krov / kula | 11 | mala (3 opcije, isti sledeći čvor: `trafo`) | druga scena (Bora na krovu / Neda i ugovor) |
| trafo | 9 | mala: ključ oko vrata / u ladici / pitanje Automatu | natpis STARI VOD, upis spoja, sedmi ton, potvrda, pisana naredba ili Nedina rečenica |
| poziv | 9 | velika: obećanje / istina / skraćivanje (vodi u `stari` ili `dario`) | ključ na grudima, prazan džep, Automatov odgovor |
| stari / dario | 10 | mala (`polja`) | druga scena: Bora i poluga / Dario i ponuda |
| polja | 11 | mala: smanjiti / sve / Stari vod | Kostina rečenica o Dariju ili o poluzi |
| ponoc | 8 | mala: javiti Nedi / čekati Automat / poslati Boru | poruka sa polja, Dario ili Kosta |
| vrelina | 9 | mala: Dario / Kosta / niko | Nedin odgovor, Automat, Borin izveštaj |
| grad | 10 | mala: Ruža / Neda / tišina | tri verzije Ružinog poziva |
| odluka | 9 | velika: tri kraja + skrivena opcija | sve ranije (callback-ovi) |
| kraj_x1 | 6–8 | — | callback na pick |
| kraj_x2 | 5–8 | — | završni pasus |

Pravilo „bar svaka druga strana“ nije moguće ispuniti u zadatom okviru: najduža deonica bez klika je 11 stranica (`krov`, `kula`, `polja`), prosek oko 9. Prvi klik je na 10. stranici (`smena`); prva velika podela je tu. Izbori su svi na kraju čvora, jer jedan čvor ima najviše jedan skup opcija.

## Mala interakcija

Svaki izbor osim hub-a i poziva Ruži vodi u isti sledeći čvor; razlika je u konkretnom detalju u narednoj sceni (`if` uslovi): natpis pod rešetkom, Nedina rečenica, tri verzije Ružinog poziva, Kostin komentar, Borin izveštaj, itd.

## Callback-ovi (bar šest, tri u krajevima)

1. `k_stari` → natpis STARI VOD u `trafo`; Bora u `stari` i `kraj_e1`.
2. `ku_pismeno` → pisana naredba u `trafo` i na tabli u `odluka`.
3. `t_kljuc` → ključ na grudima u `poziv`, `vrelina`, `odluka`.
4. `p_obecanje / p_istina / p_skratio` → Ružine tri replike u `grad`; poruka „Čekam“ u `stari`.
5. `d_*` i `st_*` → Kostine replike u `polja`; stanje poluge i ponude u `odluka`.
6. `po_*` i `pn_*` / `v_*` → poruke u `ponoc`, `vrelina`, `grad`, `odluka`.
7. U krajevima: `k_stari` (Bora u `kraj_e1`), `d_trazi` (Dario u `kraj_t1`), `g_ruza` (veza sa Ružom u `kraj_o1`).

## Pauza (moguće mesto zaključavanja)

Čvor `ponoc`: oko 10 minuta čitanja (kraj drugog kruga, posle `polja`). Kazaljka prelazi u crveno, Kula traži odgovor, i Padina je na redu u ponoć. Samo beleška, ništa nije implementirano.

## Mesta i slike

| Čvor | Slika (id) | Napomena |
| --- | --- | --- |
| smena | komandna | prva scena |
| krov | krov | |
| kula | (nasleđuje komandnu) | isto mesto kao `smena` |
| trafo | trafo | više prethodnika, pa eksplicitno |
| poziv | komandna | više prethodnika |
| dario | greben | kapija |
| stari | stari | |
| polja | polja | radio sa polja, slika polja |
| ponoc | komandna | više prethodnika |
| vrelina | (nasleđuje komandnu) | |
| grad | lantar | terasa |
| odluka | komandna | više prethodnika |
| kraj_e1 | stari | |
| kraj_e2 | lantar | |
| kraj_t1 | hale | |
| kraj_t2 | polja | |
| kraj_o1 | lantar | Padina u mraku |
| kraj_o2 | svitanje | zora nad poljima |

Devet različitih slika mesta.
