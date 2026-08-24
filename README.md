# Salong Klipp Palatset — webbplats

Statisk Astro-sajt (svenska) för Salong Klipp Palatset, dam- och herrsalong med två
salonger: Partille och Mölnlycke. Byggspec: `salong-klipp-palatset-byggspec.md`.

```bash
npm install
npm run dev              # utvecklingsserver
npm run build            # produktionsbygge
npm run check            # astro check
npm run contrast         # kontrast för alla text/bakgrund-par
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

- `src/assets/hero.jpg` — kunden är fotograferad bakifrån, inget ansikte syns
- `src/assets/galleri/galleri-06.jpg` — mörkt hår i profil, ansiktet delvis synligt
  (används även som bakgrund i "Om oss": `src/assets/backdrops/om-oss.jpg`)

Bakgrundsbilderna i `src/assets/backdrops/` (`om-oss`, `tjanster`, `salonger`, `omdomen`)
är beskurna kopior av salongens egna bilder, alla i samma format 1200×1500 så att
korsövergången aldrig hoppar. `om-oss.jpg` är den enda av dem som visar ett ansikte
(samma bild som `galleri-06.jpg`) och omfattas av samtyckeskravet ovan.

Övriga galleribilder är tagna bakifrån och visar inga ansikten. Var extra noga om någon
person i bild är minderårig. Utan samtycke: byt ut de två bilderna innan lansering.

### 3. Bildupplösning — hero-bilden

**En stor hero-bild kräver ett högupplöst original från salongen.** Den levererade
hero-bilden är 469×569 px. Så liten bild kan inte visas stor: fullbredd över en
1440-skärm är ~3× uppskalning och blir synligt mjuk, och ingen uppskalning i världen
lägger till detaljer som inte finns i filen.

Därför visas den i en **liten, innesluten ram** (416 px på desktop, 320 px på mobil) där
den ligger nära sin naturliga storlek och läser skarpt. `src/assets/hero.jpg` är en 2×
lanczos-kopia så att även retina-skärmar får något att arbeta med.

Två flaggor i `src/lib/site.ts` styr detta:

- `features.heroPhoto` — `false` ger en ren, text-only hero på det lugna ivory-fältet.
  Skarpt men tomt slår stort men suddigt.
- `features.scrollBackdrop` — fullbredds bakgrundsbilder, kräver minst
  `MIN_BACKDROP_WIDTH` (1100 px).

Be om originalfilerna direkt från telefonen (oftast 3000–4000 px breda) — då kan heron
göras stor igen, och `MIN_BACKDROP_WIDTH` uppfylls med marginal.

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
- `scripts/contrast.mjs` — kontrast för alla text/bakgrund-par, körs vid varje ändring
  av tokens eller sektionstoner

### Så hålls fotona skarpa

Ingen text ligger ovanpå ett foto, och inget foto sträcks större än sitt original tål.
Bilderna visas i egna ramar (hero, Om oss) eller i galleriets rutnät — där ligger de
nära sin naturliga storlek. Slöjor och scrim behövs därmed inte alls.
