# Struktura: „Jedra do Više obale“

Mod 2, „Jedna velika odluka“: do odluke samo mali izbori (bez težina, samo zastavice) i kratke replike čitaoca; jedna odluka sa težinama (`od_a`, `od_b`, `od_c`) i jedna skrivena opcija (`od_ceka`, težina `c`). Razlog zašto odluka pada na čitaoca je pravilo broda, nagovešteno na 1. strani (Mina: „Ti si poslednji ušao… Kapetan kaže da to nešto znači“), u Lovrovoj „šali“ (jutro, strana 4), u Pesku i u Gvožđu (čitalac opet poslednji diže mostić), jasno kod Ratka (`kajuta`, sredina) i izgovoreno bez šale (`pravilo`).

## Poglavlja

| Id | Oznaka | Ime (ne prikazuje se) | Čvorovi |
| --- | --- | --- | --- |
| c1 | I | Dan prvi | paluba, jutro, pesak, vece1 |
| c2 | II | Dan drugi | gvozdje, mostic, kajuta, horizont |
| c3 | III | Dan treći | burad, oluja, pravilo |
| c4 | IV | Kapija | odluka, kraj_a1, kraj_a2, kraj_b1, kraj_b2, kraj_c1, kraj_c2 |

## Graf

paluba → jutro → pesak → vece1 → gvozdje → mostic → kajuta → horizont → burad → oluja → pravilo → odluka → { kraj_a1 → kraj_a2 | kraj_b1 → kraj_b2 | kraj_c1 → kraj_c2 }.

Linearno sa malim izborima koji ne menjaju sledeći čvor, ali menjaju prvu stranu (`if` pasusi) i kasnije pozive. Čvorova je 18. Jedna skrivena opcija u `odluka`.

## Pauza (moguće mesto zaključavanja)

`kajuta`: Ratko kaže da na palubi broji četrdeset i jednu osobu, a spisak ima trideset osam imena, i objašnjava staro pravilo (oko polovine priče).

## Ritam

Strana = jedan pasus ili kratke replike spojene na prethodnu (prema `engine.js`). „Interakcija“ = izbor (kraj čvora) ili replika čitaoca (`Ti`). Najduži niz strana bez interakcije: 2 (samo na samom početku, strane 1–2; dalje najviše 1 strana). Prvi mali izbor: strana 9 (`s1`); prva replika čitaoca: strana 3. Prva velika odluka: strana 87 od 104 (83–85%).

| Čvor | Strana (otprilike) | Šta čitalac radi | Posledica prethodnog izbora |
| --- | --- | --- | --- |
| paluba | 9 | replike (4), mali izbor `s1` (gde stati) | — (otvaranje: pravilo nagovešteno) |
| jutro | 8 | replike (5), mali izbor `s2` (šta s užetom) | `s1`: Mina daje kredu / hlad katarke / Hanina šljiva |
| pesak | 11 | replike (5), mali izbor `s3` (šta kupiti) | `s2`: Lovrov odgovor (objašnjenje / pohvala / čvor) |
| vece1 | 8 | replike (4), mali izbor `s4` (odgovor Mini) | `s3`: perla / med / sedam „ne lažem“ |
| gvozdje | 9 | replike (4), mali izbor `s5` (šta raditi u Gvožđu) | `s4`: Minin odgovor na tvoj odgovor |
| mostic | 7 | replike (3), mali izbor `s6` (porodica na krmi) | `s5`: sanduk / lanci / pijaca |
| kajuta | 9 | replike (4), mali izbor `s7` (da li pomenuti krmu) | `s6`: zavežljaj / klimanje / ćutanje |
| horizont | 10 | replike (4), mali izbor `s8` (dvogled / Mina / Hana) | `s7`: Ratko ne diže ceradu / senka katrana / zajedničko brojanje |
| burad | 14 | replike (5), mali izbor `s9` (reakcija na Savovo priznanje) | `s8`: dvogled / Mina na ogradi / Hana priča |
| oluja | 8 | replike (3), mali izbor `s10` (uže / Lovro / Mina) | `s9`: Savov odgovor ili ćutanje |
| pravilo | 10 | replike (4), mali izbor `s11` (Ratko / Sena / Hana) | `s10`: povez / Lovrov stisak / Mina u šaci |
| odluka | 7 | replike (2), velika odluka (+ skrivena) | `s11`: ko progovara prvi |
| kraj_a1 / a2 | 10 + 9 | replike | `s1_mina`, `s3_perla`, `s2_cvor` |
| kraj_b1 / b2 | 9 + 9 | replike | `s6_zavezljaj` |
| kraj_c1 / c2 | 9 + 8 | replike | `s2_cvor`, `s7_pomoc` |

Malih izbora: 11. Kratkih replika čitaoca: oko 45 po igri. Povratnih poziva na ranije izbore: u krajevima `s1_mina`, `s3_perla`, `s2_cvor` (a, c), `s6_zavezljaj` (b, dva puta), `s7_pomoc` (c), plus neposredne posledice u svakom narednom čvoru (jedanaest) i u `odluka` (`s11`).

Scene koje se razlikuju po putanji: prvi deo svakog čvora posle izbora, u `mostic` (sanduk / lanci / pijaca), `burad` (dvogled / Mina / Hana), `pravilo` (uže / Lovro / Mina) i `odluka` (Ratko / Hana / Sena). Odluka je ista, ali ko pita, ko ćuti i ko se pojavljuje ispred čitaoca menja se.

## Mesta i slike

| Čvor | `img` | Napomena |
| --- | --- | --- |
| paluba | paluba | prva strana, zora |
| jutro | (nasleđuje paluba) | |
| pesak | pesak | podne |
| vece1 | paluba | veče na brodu, ista slika (meko svetlo) |
| gvozdje | gvozdje | |
| mostic | (nasleđuje gvozdje) | sumrak u selu |
| kajuta | kajuta | |
| horizont | paluba | veče na palubi |
| burad | burad | |
| oluja | jarbol | |
| pravilo | kajuta | |
| odluka | kapija | |
| kraj_a1 | more | čun uz bok |
| kraj_a2 | (nasleđuje more) | |
| kraj_b1, kraj_b2, kraj_c1, kraj_c2 | (nasleđuju kapija) | |

Osam različitih slika mesta (paluba, pesak, gvozdje, burad, kajuta, jarbol, kapija, more) plus naslovna `cover`.

## Provera likova

Svaki lik sa replikom ima portret: Lovro, Mina, Ratko, Hana, Savo, Sena (plus `citalac-m`/`citalac-z`). Nema mašina ni institucija sa replikom, pa nijedan lik nema `img: null`.
