# Salong Klipp Palatset — Byggspec & Designsystem

> Ny sajt (riktig kund, portföljexempel #4) åt Salong Klipp Palatset, en etablerad dam & herr-frisörsalong med två salonger. Underlag att ge Claude Code i VS Code. `[BEKRÄFTA / FYLL I]` = uppgifter som måste stämmas av med salongen — hitta aldrig på priser, tider eller adress.

---

## 1. Översikt

Enspråkig (svenska) premiumsajt för en väletablerad dam & herr-salong (~25 år) med **två salonger**. Mål: elegant, rent, välkomnande för både kvinnor och män — en modern salongskänsla med en gnutta förfinad "Palatset"-elegans. De har ingen riktig sajt idag; de är etablerade med starkt Instagram men osynliga online utöver spridda listningar. Sajten samlar ihop varumärket, visar arbetet, och skickar folk rakt till bokningen de redan har. Medvetet en fjärde distinkt värld mot de ljusa/sobra (Vallhamragruppen), mörkt svart-guld (Corner Cutz) och energiskt ljusa (Portens Gym) i portföljen.

**Verksamheten (från sök — BEKRÄFTA):**
- Etablerad dam & herr-salong, ~25 år i Göteborgstrakten. Stolta över kvalitet och "fräschaste lokalen".
- **Tjänster:** klippning (dam & herr), färg & slingor, öronhåltagning (STUDEX) — `[BEKRÄFTA fullständig lista + ev. styling, behandlingar, barnklippning]`.
- **Två salonger:**
  - **Partille** — Gamla Kronvägen 13A, 433 33 Partille · tel 031-44 37 27 (även 0739976552) · Bokadirekt: bokadirekt.se/places/salong-klipp-palatset-partille-39108 · öppettider `[BEKRÄFTA]`
  - **Mölnlycke** — Råda Torg 5, 435 30 Mölnlycke · tel 031-22 16 15 · Bokadirekt: bokadirekt.se/places/salong-klipp-palatset-molnlycke-33378 · öppettider (sök: mån–fre 09:30–18:00, lör 10:00–15:00) `[BEKRÄFTA]`
- **Bokning finns redan:** Bokadirekt (två profiler, en per salong) + Timma (boka.timma.se/salongklipppalatset). Sajtens "Boka tid" **länkar till befintlig bokning** — inget att sätta upp. `[BEKRÄFTA vilket system de vill länka: Bokadirekt per salong (rek.) eller Timma]`.
- **Social:** Instagram @salong_klipp_palatset (578 inlägg — riktiga bilder), TikTok @klipppalatset, Facebook. Omdömen: FB 100% rekommenderar (5), lyfter fräschaste lokalen, kvalitet, proffsighet, punktlighet, renlighet.
- Ägare Aso Salih; stylist Wafa nämnd i omdöme. Org.nr enskild firma `[FYLL I om det ska visas]`. Möjlig egen domän: salongklipppalatset.se (verkar tom) — `[BEKRÄFTA om den är deras → då äger de redan domänen]`.

**Sidor:** en stark long-scroll-startsida (hero → om oss → tjänster → galleri → våra salonger (2 platskort) → omdömen → boka tid → kontakt).

---

## 2. Teknisk stack
- **Astro** (statiskt) + **Tailwind CSS v4**, tokens nedan som CSS-variabler.
- **Fonts:** Cormorant (display-serif) + Jost (brödtext/UI), self-hostade via `@fontsource`.
- **Deploy:** Vercel (gratis). `noindex` bakom env-flagga tills kund + egen domän.
- Ingen CMS (om inte kunden ber om självredigering — då Storyblok, som Vallhamragruppen). Minimal JS (meny, scroll-reveal, ev. lightbox).
- **Bokning:** "Boka tid"-CTA länkar till deras befintliga Bokadirekt/Timma-profil (per salong). Ingen egen bokningsmotor.

---

## 3. Designsystem

### 3.1 Koncept & signatur
Elegant, rent, ljust — en modern salong med förfinad känsla, välkomnande för dam & herr. Undvik den generiska "varm-minimal-mall" (cream + högkontrastserif + terrakotta) — grunda i salongen: deras egna färg-/klippbilder, de två platserna, och en gnutta "Palatset"-elegans. Accenten är INTE terrakotta och INTE guld (det är Corner Cutz värld).

- **Hero som tes:** öppna med hantverk + elegans + de två salongerna, mot en riktig bild av salongen eller ett färg-/klippresultat — inte en generisk stockbild.
- **Signatur:** de **två salongerna** (Partille & Mölnlycke) som förankrad identitet, elegant satt; namnet "Palatset" i Cormorant som motiv; en tunn **sage-hårlinje** som återkommande detalj; **~25 år** som förtroendemärke.
- **Foto bär:** deras egna bilder på klippningar, färg och lokalen — eleganta, konsekvent behandlade.

### 3.2 Färg (CSS-tokens) — REKOMMENDATION: ljus ivory + förfinad sage
```css
:root {
  --paper:      #F5F2EC; /* varm ivory – bas, fräsch och ljus */
  --surface:    #FCFAF5; /* kort/ytor, nära vitt */
  --ink:        #23201C; /* varm charcoal – text + primär CTA-fyllning */
  --ink-muted:  #6A655B; /* dämpad taupe – sekundär text */
  --accent:     #7E8B70; /* förfinad sage – eyebrow, hårlinjer, små markörer, hover */
  --accent-deep:#656F5A; /* mörkare sage – hover på accent */
  --accent-soft:#E9EDE3; /* mycket ljus sage – bakgrundstoning, chips */
  --line:       #E4DFD5; /* hårlinjer */
}
```
Regel: **primär CTA = fylld `--ink` (charcoal) med vit text** — elegant och alltid läsbar. Sage är accent (eyebrows, linjer, hover, ikoner), aldrig fylld knapptext (för låg kontrast). Verifiera sage endast som stor text/accent, och `--ink-muted` mot `--paper` ≥ AA.

*Alternativ accent om salongen vill:* dammig rosé (mjukare/salong) eller champagne (varmare/luxe). Byt bara `--accent`-tokens; strukturen är densamma. (Undvik guld — krockar med Corner Cutz.)

### 3.3 Typografi
- **Display/rubriker: Cormorant** — elegant, hög kontrast, weight 500/600, generös. Endast rubriker/stora citat (Cormorant är delikat — aldrig i brödtext eller små storlekar).
- **Brödtext/UI: Jost** — geometrisk, ren, modern, en aning elegant; weight 400/500.
- **Eyebrow/etiketter:** Jost 500, VERSALER, tracking 0.14em, `--accent` eller `--ink-muted`.

Skala:
```
Display (hero) clamp(2.75rem, 7vw, 5.5rem)   Cormorant 600  lh 1.02
H1            clamp(2.25rem, 5vw, 3.5rem)    Cormorant 600  lh 1.05
H2            clamp(1.75rem, 3.5vw, 2.5rem)  Cormorant 600  lh 1.1
H3            1.5rem                          Cormorant 600
Body-lg       1.1875rem                       Jost 400  lh 1.65
Body          1.0625rem                       Jost 400  lh 1.7
Eyebrow       0.8125rem                       Jost 500  uppercase, tracking 0.14em
```

### 3.4 Rum, form, rörelse
- Spacing-bas 4px; sektionsluft `clamp(5rem, 10vw, 9rem)` (generös luft = elegans).
- Container max 1200px; textmått max ~66ch.
- Radier: sm 4px · md 8px · lg 14px (mjukt men stramt).
- Kort: `--surface` med 1px `--line` eller mycket mjuk skugga.
- Rörelse: lugna, eleganta entrances (fade + 14px, 550ms, lätt stagger), diskret hover-lyft på kort. **Respektera `prefers-reduced-motion`.**

---

## 4. Komponenter
- **Header:** sticky, `--paper` (transparent→paper över ljus hero). Logga/ordbild "Klipp Palatset" (Cormorant) till vänster. Nav: Om oss · Tjänster · Galleri · Salonger · Kontakt. Höger: **Boka tid** (primär, charcoal) alltid synlig → befintlig bokning. Mobil: hamburger → helskärms-overlay, CTA kvar. Sticky mobil-CTA "Boka tid".
- **Button (primär):** fylld `--ink`, vit text, radie md, hover → lätt ljusare/mjuk.
- **Button (sekundär):** 1px `--ink`-ram, transparent, hover → fylld.
- **Eyebrow:** versaletikett + 1px `--accent`(sage)-linje.
- **ServiceCard:** ikon/liten bild + tjänstnamn (Cormorant) + kort text + ev. pris `[FYLL I]` / "boka för pris". Hover-lyft.
- **SalongCard (viktig, x2):** salongens namn (Partille / Mölnlycke), adress, öppettider, telefon (tel:-länk), **Boka tid**-knapp → den salongens Bokadirekt-profil, karta (statisk/OSM). Två kort sida vid sida, staplas på mobil.
- **GalleryGrid:** deras riktiga klipp-/färgbilder, konsekvent ton, lightbox. Alt-text.
- **ReviewCard:** citat + förnamn + betyg. `[FYLL I: riktiga omdömen]`.
- **TrustStrip:** "~25 år" · "Dam & herr" · "Två salonger" · "100% rekommenderar" — elegant rad högt upp. `[BEKRÄFTA siffror]`.
- **Footer, Container, SocialStrip** (@salong_klipp_palatset IG + Facebook).

---

## 5. Sektioner & copy (svenska)

> Copy grundad i deras riktiga profil. Priser, tider, adress, omdömen = `[BEKRÄFTA / FYLL I]`.

### Hero
- Eyebrow: `DAM & HERR · PARTILLE & MÖLNLYCKE`
- Rubrik (display): `Klippning och färg med omsorg.` *(alt: `Din salong sedan 25 år.`)*
- Underrad: `En etablerad dam- och herrsalong med två salonger — klippning, färg och personlig service i en fräsch, trivsam miljö.`
- CTA: `Boka tid` (primär → befintlig bokning) · `Våra salonger` (sekundär)
- TrustStrip: `~25 år` · `Dam & herr` · `Två salonger` · `100% rekommenderar` `[BEKRÄFTA]`
- Bakgrund: riktig salongs-/arbetsbild, full-bleed.

### Om oss
- Eyebrow: `Om oss` · H2: `En salong att komma tillbaka till`
- Text: `Salong Klipp Palatset har funnits i Göteborgstrakten i omkring 25 år. Vi är en dam- och herrsalong som lägger stor vikt vid kvalitet, noggrannhet och en fräsch, välkomnande miljö. Hos oss ska du känna dig väl omhändertagen — oavsett om det är en klippning, en färg eller något helt nytt.` `[BEKRÄFTA årtal/formulering]`
- Ev. riktig salongsbild + `[FYLL I: ev. om teamet — Aso, Wafa m.fl.]`.

### Tjänster
- Eyebrow: `Tjänster` · H2: `Vad vi gör`
- ServiceCards: **Klippning** (dam & herr), **Färg & slingor**, **Öronhåltagning**, + `[BEKRÄFTA: styling, behandlingar, barnklippning m.m.]`. Priser `[FYLL I]` eller "boka för pris".
- Not: `Boka enkelt online — välj salong och tid.`

### Galleri
- Eyebrow: `Galleri` · H2: `Vårt arbete`
- Deras egna klipp-/färgbilder, kuraterade, lightbox. Länk: `Mer på Instagram @salong_klipp_palatset`.

### Våra salonger (signatursektion)
- Eyebrow: `Salonger` · H2: `Två salonger, samma omsorg`
- Två **SalongCard**:
  - **Partille** — Gamla Kronvägen 13A, 433 33 Partille · tel 031-44 37 27 · öppettider `[BEKRÄFTA]` · **Boka tid** → Bokadirekt Partille · karta
  - **Mölnlycke** — Råda Torg 5, 435 30 Mölnlycke · tel 031-22 16 15 · öppettider `[BEKRÄFTA]` · **Boka tid** → Bokadirekt Mölnlycke · karta

### Omdömen
- Eyebrow: `Omdömen` · H2: `Nöjda kunder i 25 år`
- `[FYLL I: 3–4 riktiga omdömen från deras Bokadirekt/Google/Facebook, med lov]`. Använd inte påhittade. Ev. "100% rekommenderar"-märke.

### Boka tid (footer-nära)
- H2: `Boka din tid`
- Text: `Boka enkelt online, dygnet runt — välj salong och tid som passar dig.` + två knappar/länkar (Partille / Mölnlycke) → befintlig bokning. `[BEKRÄFTA system]`.

### Kontakt (footer)
- Båda salongernas adress, telefon, öppettider · SocialStrip (@salong_klipp_palatset + Facebook) · Footer: logga, © + länkar.

---

## 6. Bilder — deras egna (Instagram)
- **Använd Salong Klipp Palatsets egna foton** från Instagram (@salong_klipp_palatset, 578 inlägg): klippningar (dam & herr), färg/slingor, lokalen/miljön. Eleganta, ljusa, konsekventa.
- **Pitch/koncept:** deras publika IG-bilder är ok. **Live:** be om högupplösta original + lov, och **samtycke för identifierbara kunder i bild** (klipp-/färgbilder visar ofta kunder) — extra noga med minderåriga.
- Kuratera hårt: skarpa, välbelysta, samma ton. Kör via Astro `<Image>` (AVIF/WebP, bredd/höjd, `alt`). Logga: be om vektor/högupplöst; annars sätt ordbilden "Klipp Palatset" i Cormorant tills dess.

---

## 7. Kvalitetsgolv (SEO / a11y / prestanda)
- **SEO:** titel `Salong Klipp Palatset · Frisör i Partille & Mölnlycke`; meta-description; OG/Twitter; `sitemap.xml`; **HairSalon/LocalBusiness JSON-LD för BÅDA salongerna** (namn, respektive adress, telefon, geo, openingHoursSpecification, `sameAs` IG/FB) — endast bekräftade uppgifter, aldrig gissade. Semantisk HTML, en riktig `<h1>`.
- **Tillgänglighet:** kontrast ≥ AA (sage endast stor text/accent; CTA charcoal-fylld). Synligt tangentbordsfokus (ring i `--accent` eller `--ink`). Alt-text överallt. `prefers-reduced-motion`. Tap-mål ≥ 44px. tel:-länkar.
- **Prestanda:** statiskt, minimal JS, self-hostade fonts (`font-display: swap`, endast använda vikter), optimerade bilder. Mål: Lighthouse 95+.
- **noindex** + robots bakom env-flagga tills egen domän.

## 8. Mobil (world-class, inte bara responsiv)
- `100dvh`/`svh` rätt, `viewport-fit=cover`, safe-area-insets.
- Sticky "Boka tid" i tumzonen. tel:-länkar öppnar Telefon. Noll horisontell overflow 320–430px. De två SalongCard staplas rent.
- Bekräfta på riktig iPhone.

## 9. Byggordning för Claude Code
1. Scaffolda Astro + Tailwind v4 + `@fontsource` (Cormorant + Jost) + `astro:assets` + sitemap.
2. Designtokens (§3.2, ivory + sage) som CSS-vars + Tailwind-theme; global CSS (ljus bas, Cormorant/Jost-skala, fokus, reduced-motion, sage-hårlinje-util).
3. Globala komponenter (§4): Header (logga + Boka tid + sticky mobil-CTA), Button, Eyebrow, TrustStrip, ServiceCard, SalongCard (x2), GalleryGrid (+lightbox), ReviewCard, SocialStrip, Footer, Container.
4. Bygg long-scroll-startsidan sektion för sektion (§5) med copyn. Priser/tider/adress/omdömen som synliga `[BEKRÄFTA / FYLL I]` via en FillIn-komponent. Boka tid-knappar länkar till befintlig Bokadirekt/Timma (sätt URL:erna i `site.ts` — en per salong). Riktig `<h1>`, SEO-sträng bara i `<title>`.
5. Deras riktiga IG-bilder (§6), alt-texter, JSON-LD för båda salongerna + meta (§7), scroll-reveal, öppet-idag mot Europe/Stockholm om det används. noindex + robots bakom env-flagga. Mobilpass (§8). astro check rent, Lighthouse alla axlar, tangentbord + mobil verifierat i webbläsare.

**Håll ribban:** elegant, ren, ljus, välkomnande dam & herr — aldrig terrakotta-cliché eller guld (det är Corner Cutz). Boldheten på Cormorant-rubrikerna + deras foton + de två salongerna. Sage sparsamt, CTA charcoal. Distinkt från de tre andra portföljbitarna — det är hela poängen. Hitta aldrig på priser, tider, adress eller omdömen — allt osäkert är `[BEKRÄFTA / FYLL I]`. Bokning finns redan; länka bara.
