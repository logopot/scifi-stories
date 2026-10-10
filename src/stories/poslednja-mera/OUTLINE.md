# Struktura: „Poslednja mera“

18 scena, 4 poglavlja. Prosečno 2.865 reči po jednoj igri (min 2.698, max 3.001), oko 16 minuta čistog čitanja (priča računa na ~20 min sa razmišljanjem). Kraj: e 32.5%, t 34.5%, o 33.0% u 20.000 nasumičnih igara. Namerne putanje ka osi daju tu osu.

## Graf

```
I  Utočište          dolazak -> kapija
                       kapija: k_brana / k_revir / k_razd
II Knjiga raspodele   brana | revir | merac   (prvi krug, svaka sa 3 izbora)
                       -> pogon | knjiga | izaslanik   (drugi krug, svaki sa 3 izbora)
III Kapije            -> rezerva | vece   (treći krug)
                       -> odbor (čvor odluke, 3 izbora + skrivena opcija)
                       -> odluka (grana po vodećoj osi)
IV Posle              kraj_e1 -> kraj_e2 | kraj_t1 -> kraj_t2 | kraj_o1 -> kraj_o2
```

Delimična konvergencija: sva tri sveta iz prvog kruga vode u iste tri scene drugog kruga; svi putevi drugog kruga se sustižu u rezervi ili večeri, pa u čvoru odluke. Nema slepih grana.

## Izbori i težine (w)

Svaki izbor daje 1–3 boda jednoj osi: kapija i treći krug po 2, prvi i drugi krug po 1, čvor odluke 3. Skrivena opcija u čvoru odluke („ne govoriš ništa“, posle 22 s) daje t:1. Ose su u svakom izboru zastupljene podjednako, pa nasumična igra daje oko trećinu po kraju.

| Scena | Izbori (id → sledeća, osa) |
| --- | --- |
| kapija | k_brana → brana (o2), k_revir → revir (e2), k_razd → merac (t2) |
| brana / revir / merac | b_/rv_/rz_ pogon → pogon (e1), knjiga → knjiga (t1), izasl → izaslanik (o1) |
| pogon | pg_rez → rezerva (e1), pg_vece → vece (t1), pg_rez2 → rezerva (o1) |
| knjiga | kn_rez → rezerva (t1), kn_vece → vece (e1), kn_vece2 → vece (o1) |
| izaslanik | iz_rez → rezerva (o1), iz_vece → vece (e1), iz_vece2 → vece (t1) |
| rezerva | ra_e (e2), ra_t (t2), ra_o (o2) → odbor |
| vece | ve_e (e2), ve_t (t2), ve_o (o2) → odbor |
| odbor | od_e (e3), od_t (t3), od_o (o3), skrivena od_nista (t1) → odluka |

`odluka` ima samo `branch`: `lead: e` → kraj_e1, `lead: t` → kraj_t1, inače kraj_o1.

## Povratne reference (callbacks)

Strane krajeva imaju uslovne pasuse (`if`) na konkretnim ranijim izborima:

- gde je čitalac prvo otišao (`k_brana`, `k_revir`, `k_razd`): Ilarion, Oliva ili Vuk se pojavljuju u završnoj sceni;
- Kosta i Olivin dečak (kraj e i o) samo za one koji su bili u Reviru;
- Dalibor u krajevima e i o samo ako je čitalac razgovarao sa izaslanikom, a u kraju t kroz pregovore (izbor iz_vece2);
- pogon (`b_pogon`, `rv_pogon`, `rz_pogon`) menja scenu u kraju t;
- na čvoru odluke likovi se pojavljuju samo ako su ranije upoznati (uslov `any` na izborima).

## Kontinuitet znanja čitaoca

Nijedan lik se ne podrazumeva ako ga čitalac nije sreo: rečenice u kojima se vraća lik imaju uslov, a u neutralnim pasusima lik se kratko opisuje (npr. „Vuk, mladić koji održava Merača“). Pitanje o „četiri odsto“ ima dve varijante, zavisno od toga da li je čitalac čuo broj od Ilariona.
