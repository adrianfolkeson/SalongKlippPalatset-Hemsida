# Salong Klipp Palatset — webbplats

Statisk Astro-sajt (svenska) för Salong Klipp Palatset, dam- och herrsalong med två
salonger: Partille och Mölnlycke. Byggspec: `salong-klipp-palatset-byggspec.md`.

```bash
npm install
npm run dev              # utvecklingsserver
npm run build            # produktionsbygge
npm run check            # astro check
npm run contrast         # kontrast för designtokens och slöjor
npm run contrast:photos  # kontrast mot de riktiga fotona (mörkaste pixeln per textzon)
```

## Innan lansering

### 1. Uppgifter som måste bekräftas av salongen

Allt osäkert renderas med en synlig `[BEKRÄFTA]`- eller `[FYLL I]`-markör via
`src/components/FillIn.astro` och styrs från `src/lib/site.ts`, där varje värde är
wrappat i `Confirmable<T>` med `confirmed: false` tills salongen sagt sitt.

- Öppettider per salong (finns inte publikt — måste komma från salongen)
- Priser och fullständig tjänstelista
- Adresser och telefonnummer (hämtade från publika listningar, ej verifierade)
- Vilket bokningssystem som ska länkas: Bokadirekt per salong (rekommendation) eller Timma
- Om märket "100% rekommenderar" får användas
- Antal år i branschen (~25 år)
- Exakt Facebook-URL

Sätt `confirmed: true` först när uppgiften är bekräftad. Endast bekräftade uppgifter
får gå in i strukturerad data (JSON-LD).

### 2. Samtycke för bilder på identifierbara personer

Bilderna i `src/assets/` är salongens egna. Två av dem visar **identifierbara kunder**
och kräver dokumenterat samtycke från personen i bild innan sajten publiceras:

- `src/assets/hero.jpg` — blond profilbild, ansiktet delvis synligt (används som hero-bakgrund)
- `src/assets/galleri/galleri-06.jpg` — mörkt hår i profil, ansiktet delvis synligt
  (används även som bakgrund i "Om oss": `src/assets/backdrops/om-oss.jpg`)

Bakgrundsbilderna i `src/assets/backdrops/` (`om-oss`, `tjanster`, `salonger`, `omdomen`)
är beskurna kopior av salongens egna bilder, alla i samma format 1200×1500 så att
korsövergången aldrig hoppar. `om-oss.jpg` är den enda av dem som visar ett ansikte
(samma bild som `galleri-06.jpg`) och omfattas av samtyckeskravet ovan.

Övriga galleribilder är tagna bakifrån och visar inga ansikten. Var extra noga om någon
person i bild är minderårig. Utan samtycke: byt ut de två bilderna innan lansering.

### 3. Bildupplösning

Originalen är små (hero: 558×563 px). Det räcker på mobil men skalas upp på stora
skärmar. Be salongen om högupplösta original — minst 2400 px bredd för hero-bilden —
så blir bakgrunden skarp på desktop.

### 4. noindex

Sajten är blockerad för sökmotorer tills den ligger på kundens egen domän:
`<meta name="robots" content="noindex, nofollow">` och `Disallow: /` i `robots.txt`.
Sätt `PUBLIC_NOINDEX=false` (och `PUBLIC_SITE_URL`) i produktionsmiljön vid lansering.

### 5. Bilder som bakgrund

`features.scrollBackdrop` i `src/lib/site.ts` är **av**. Det scrollstyrda bakgrundslagret
finns kvar i koden men kräver bilder på minst `MIN_BACKDROP_WIDTH` (1100 px) som tål att
beskäras brett — dagens telefonfoton blir både uppskalade och närbilder av hår. Fotona
visas istället i egna behållare (hero och Om oss), där de ligger nära sin naturliga
storlek och är skarpa.

Slås lagret på igen: planet är byggt med `height: 100lvh` + `translateZ(0)`, vilket är
just det som gör att det inte ändrar storlek när Safaris adressfält fälls in på iOS.
Verifiera ändå på en riktig iPhone innan lansering.

## Struktur

- `src/lib/site.ts` — all salongsdata, bokningslänkar, funktionsflaggor
- `src/lib/gallery.ts` — galleriets ordning och alt-texter (en bild utan alt-text flaggas)
- `src/lib/backdrops.ts` — scener för det scrollstyrda bakgrundslagret. Lägg en fil i
  `src/assets/backdrops/` med scenens namn (`om-oss.jpg`, `tjanster.jpg`, `salonger.jpg`,
  `omdomen.jpg`, `boka.jpg`) så plockas den upp automatiskt. Beskär till 1200×1500.
- `scripts/contrast.mjs` — kontrast för designtokens och de statiska ytorna
- `scripts/photo-contrast.mjs` — kontrast mot de riktiga fotona. Den utvärderar de
  faktiska gradientstoppen pixel för pixel, så varje ändring av en scrim i
  `Hero.astro`, `Section.astro` eller `BookingSection.astro` måste speglas i skriptet
  och köras om (`npm run contrast:photos`).
- `scripts/hero-zones.json` — var hero-texten faktiskt hamnar, mätt i webbläsaren.
  Ändras hero-layouten: kör om mätningen innan kontrastsiffrorna litas på.

### Så hålls fotona skarpa

Ingen heltäckande slöja ligger över bilderna. Varje textblock bär sin egen läsbara yta
(sidoscrim, frostat kort eller solid panel) medan resten av fotot lämnas orört — därför
kan slöjan vara noll där ingen text ligger.
