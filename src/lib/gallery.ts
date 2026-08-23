/**
 * Gallery source — the salon's own photos.
 *
 * A photo without alt text is never published: `alt` is required here, and the
 * grid flags any file that is missing from this list.
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/galleri/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

/**
 * Curated order — alternating so the grid shows range (dam & herr, blont och
 * mörkt, rakt och lockigt) rather than six variations of the same look.
 */
export const order = [
  'galleri-01.jpg', // blond balayage, lockade toppar
  'galleri-04.jpg', // herrklippning, lockigt med fade
  'galleri-03.jpg', // karamellbrunt, rakt
  'galleri-05.jpg', // blond lockig bob
  'galleri-06.jpg', // mörkt hår, profil
  'galleri-02.jpg', // slingor med dimension, rakt
];

/** filename → alt text (Swedish, describes what is in the photo). */
export const altTexts: Record<string, string> = {
  'galleri-01.jpg': 'Långt blont hår med balayage och lockade toppar, sett bakifrån.',
  'galleri-02.jpg': 'Långt hår med ljusa slingor och mörkare bottenfärg, rakt stylat, sett bakifrån.',
  'galleri-03.jpg': 'Mellanlångt karamellbrunt hår, rakt och blankt, sett bakifrån.',
  'galleri-04.jpg': 'Herrklippning med lockigt hår på toppen och kort fade i nacken, sedd bakifrån.',
  'galleri-05.jpg': 'Blond lockig bob med volym, sedd bakifrån.',
  'galleri-06.jpg': 'Mörkt, långt hår med mjuka lager, sett snett bakifrån.',
};

export type GalleryItem = {
  file: string;
  src: ImageMetadata;
  alt: string | null;
};

const byFile = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop() as string, mod.default])
);

const ordered = [...order.filter((file) => byFile.has(file)), ...[...byFile.keys()].filter((file) => !order.includes(file))];

export const galleryItems: GalleryItem[] = ordered.map((file) => ({
  file,
  src: byFile.get(file) as ImageMetadata,
  alt: altTexts[file] ?? null,
}));
