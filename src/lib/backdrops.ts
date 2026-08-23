/**
 * Scroll-driven backdrop layer.
 *
 * An ACCENT on top of the light design: a single full-bleed image plane behind
 * the page that cross-fades between scenes as you scroll. Sections that opt in
 * (backdrop="light" / the charcoal booking block) let it show through under a
 * veil; every other section keeps its solid background and hides it completely.
 *
 * All section backdrops are cropped to the same 1200×1500 frame so the
 * cross-fade never jumps. Drop a file in src/assets/backdrops/ named after the
 * scene and it is picked up automatically; until then the scene renders a tonal
 * gradient — no stock photography is ever shipped.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/{hero,backdrops/*}.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const find = (...names: string[]) => {
  for (const name of names) {
    const hit = Object.entries(files).find(([path]) => path.includes(`/${name}.`));
    if (hit) return hit[1].default;
  }
  return undefined;
};

export type Scene = {
  id: 'om-oss' | 'boka';
  /** Section the scene is anchored to. */
  anchor: string;
  image?: ImageMetadata;
  /** Tonal fallback while the real photo is missing. */
  fallback: string;
  /** object-position for the cover crop — keeps the subject where the layout wants it. */
  position?: string;
  /** Loaded with the page (hero) or deferred until the user scrolls. */
  eager: boolean;
};

/**
 * Minimum width for a full-bleed backdrop. Anything smaller would be upscaled
 * across the viewport and go soft — those photos belong in the gallery or in a
 * contained panel (see Hero.astro), never behind a whole section.
 */
export const MIN_BACKDROP_WIDTH = 1100;

const bigEnough = (image?: ImageMetadata) =>
  image && image.width >= MIN_BACKDROP_WIDTH ? image : undefined;

export const scenes: Scene[] = [
  {
    id: 'om-oss',
    anchor: 'om-oss',
    image: bigEnough(find('om-oss')),
    // Keeps the crop on the hair and the light counter, away from the dark
    // mirror station on the left edge.
    position: '68% 42%',
    fallback: 'linear-gradient(200deg, #e7e9df 0%, #d7d9cd 55%, #cfc9bc 100%)',
    eager: false,
  },
];

export const hasRealImages = scenes.some((scene) => scene.image);
