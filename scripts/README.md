# Skripte

Pokreću se iz korena repoa (`npm run ...`). Većina provera traži pokrenut `npm run dev` u drugom terminalu.

## Slike priče

Slike sajta su `.webp`. Izvorne slike (JPG/PNG) ne idu u repo.

1. Preuzmi slike iz Canve (JPG ili PNG).
2. Stavi ih u `public/img/<slug>/` pod imenima iz `IMAGE_PROMPTS.md` priče (npr. `cover.jpg`, `kanal.jpg`, `jela.jpg`).
3. Pokreni `npm run images -- <slug>` (ili `npm run images -- --all` za sve priče). Skripta pravi `.webp` pod istim imenom, a originale premešta u `originals/<slug>/` (taj folder je u `.gitignore`). Mesta i naslovna su najviše 2200 px široka, portreti 900 px. Postojeći `.webp` se preskače; `--force` ga pravi ponovo iz originala.
4. Proveri: `npm run check-story -- <slug>`, `npm run check-portraits`, `npm run check-layout -- --story <slug> --quick`.
5. Commit (u repo idu samo `.webp` fajlovi).

## Provere

- `check-story` – struktura i simulacija priče, teme, struktura komponenti.
- `check-themes`, `check-structure` – kontrast tema i struktura komponenti.
- `check-portraits` – likovi koji govore i njihovi portreti.
- `check-layout`, `check-overflow` – izgled strana i vodoravni skrol na telefonu (traže `npm run dev`).
