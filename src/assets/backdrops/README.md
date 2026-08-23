# Bakgrundsbilder (scrollstyrt bakgrundslager)

Tomt med flit. Lagret (`features.scrollBackdrop` i `src/lib/site.ts`) är avstängt tills
det finns bilder som håller för att beskäras över hela skärmen:

- minst **1100 px** bredd (`MIN_BACKDROP_WIDTH` i `src/lib/backdrops.ts`)
- lugn komposition som tål en bred beskärning — inte en närbild på hår
- inga mörka, oidentifierbara partier i kanterna

Filnamnet styr vilken scen bilden hamnar i: `om-oss.jpg`, `boka.jpg`.
