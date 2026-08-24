/**
 * Single source of truth for all salon data.
 *
 * `confirmed: false` means the value comes from public listings/search and has
 * NOT yet been verified by the salon. Unconfirmed values are rendered with a
 * visible [BEKRÄFTA] marker and are never emitted as structured data (JSON-LD).
 * Never fill in prices, opening hours or reviews without confirmation.
 */

export type Confirmable<T> = {
  value: T;
  /** Verified with the salon? Only confirmed data reaches JSON-LD. */
  confirmed: boolean;
  /** Where the value came from, for the follow-up conversation. */
  source?: string;
};

export const c = <T>(value: T, confirmed: boolean, source?: string): Confirmable<T> => ({
  value,
  confirmed,
  source,
});

export type OpeningHours = {
  /** ISO weekday numbers 1–7 (Mon–Sun). */
  days: number[];
  opens: string;
  closes: string;
};

export type Salon = {
  id: 'partille' | 'molnlycke';
  name: string;
  city: string;
  street: Confirmable<string>;
  postalCode: Confirmable<string>;
  phone: Confirmable<string>;
  phoneAlt?: Confirmable<string>;
  /** Existing booking profile — we only link to it, we never build booking. */
  bookingUrl: Confirmable<string>;
  mapUrl: Confirmable<string>;
  hours: Confirmable<OpeningHours[] | null>;
  hoursNote?: string;
};

export const salons: Salon[] = [
  {
    id: 'partille',
    name: 'Partille',
    city: 'Partille',
    street: c('Gamla Kronvägen 13A', false, 'publika listningar'),
    postalCode: c('433 33', false, 'publika listningar'),
    phone: c('031-44 37 27', false, 'publika listningar'),
    phoneAlt: c('073-997 65 52', false, 'publika listningar'),
    bookingUrl: c(
      'https://www.bokadirekt.se/places/salong-klipp-palatset-partille-39108',
      false,
      'Bokadirekt-profil — bekräfta att den är aktiv och ska användas'
    ),
    mapUrl: c(
      'https://www.google.com/maps/search/?api=1&query=Gamla+Kronv%C3%A4gen+13A+433+33+Partille',
      false
    ),
    hours: c(null, false, 'ej publicerade — måste bekräftas av salongen'),
  },
  {
    id: 'molnlycke',
    name: 'Mölnlycke',
    city: 'Mölnlycke',
    street: c('Råda Torg 5', false, 'publika listningar'),
    postalCode: c('435 30', false, 'publika listningar'),
    phone: c('031-22 16 15', false, 'publika listningar'),
    bookingUrl: c(
      'https://www.bokadirekt.se/places/salong-klipp-palatset-molnlycke-33378',
      false,
      'Bokadirekt-profil — bekräfta att den är aktiv och ska användas'
    ),
    mapUrl: c(
      'https://www.google.com/maps/search/?api=1&query=R%C3%A5da+Torg+5+435+30+M%C3%B6lnlycke',
      false
    ),
    hours: c(null, false, 'sök visar mån–fre 09:30–18:00, lör 10:00–15:00 — obekräftat'),
    hoursNote: 'Uppgift i sökresultat: mån–fre 09:30–18:00, lör 10:00–15:00.',
  },
];

export const site = {
  name: 'Salong Klipp Palatset',
  shortName: 'Klipp Palatset',
  title: 'Salong Klipp Palatset · Frisör i Partille & Mölnlycke',
  description:
    'Dam- och herrsalong med två salonger i Partille och Mölnlycke. Klippning, färg och personlig service i en fräsch, välkomnande miljö.',
  lang: 'sv',
  locale: 'sv_SE',
  /** Set to a real domain before launch; noindex stays on until then. */
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://salongklipppalatset.se',
  /** noindex until the site is live on the client's own domain. */
  noindex: import.meta.env.PUBLIC_NOINDEX !== 'false',
  timezone: 'Europe/Stockholm',
  yearsInBusiness: c('~25 år', false, 'salongen anger cirka 25 år'),
  social: {
    instagram: c('https://www.instagram.com/salong_klipp_palatset/', true),
    instagramHandle: '@salong_klipp_palatset',
    facebook: c('https://www.facebook.com/', false, 'exakt FB-URL saknas — bekräfta'),
    tiktok: c('https://www.tiktok.com/@klipppalatset', false),
  },
  /**
   * Which booking system the site should link to. Bokadirekt (per salon) is the
   * recommendation; Timma exists as one shared profile. MUST be confirmed.
   */
  booking: {
    system: c<'bokadirekt' | 'timma'>('bokadirekt', false, 'bekräfta med salongen'),
    timmaUrl: c('https://boka.timma.se/salongklipppalatset', false),
  },
} as const;

export type Review = {
  quote: string;
  name: string;
  rating: number;
  /** Where the review was published. */
  source: string;
  salon: 'Partille' | 'Mölnlycke';
  /** Published reviews supplied by the salon — safe to show as fact. */
  confirmed: boolean;
};

/** Riktiga, publicerade omdömen. Ordnade så att båda salongerna varvas. */
export const reviews: Review[] = [
  {
    quote:
      'Är väldigt nöjd med mitt besök på Klipp Palatset! Slingade mitt hår och det blev precis som jag ville ha det!',
    name: 'Ella',
    rating: 5,
    source: 'Bokadirekt',
    salon: 'Partille',
    confirmed: true,
  },
  {
    quote: 'Fantastisk frisör, Raza, på Klipp Palatset. Hon gjorde min 95-åriga mamma så fin!',
    name: 'Eva Nordin',
    rating: 5,
    source: 'Google',
    salon: 'Mölnlycke',
    confirmed: true,
  },
  {
    quote:
      'Har anlitat Klipp Palatset i flera år och kan verkligen rekommendera dem. Alltid vänligt bemötande, kunnig personal och rimliga priser.',
    name: 'Margaretha Johansson',
    rating: 5,
    source: 'Bokadirekt',
    salon: 'Partille',
    confirmed: true,
  },
  {
    quote:
      'Alltid lika nöjd när jag varit hos Raza. Igår gjorde hon superfina slingor på mig. Bästa servicen man kan tänka sig.',
    name: 'Lena Elfström',
    rating: 5,
    source: 'Google',
    salon: 'Mölnlycke',
    confirmed: true,
  },
];

/** Feature flags — the scroll backdrop is an accent layer and can be turned off. */
export const features = {
  /**
   * Full-bleed image plane that cross-fades behind sections. Off: the current
   * photos are phone shots below 1100px, and a full-bleed crop of them both
   * upscales and turns into a close-up. Turn on again once the salon delivers
   * calm, well-composed originals of at least 1100px (see MIN_BACKDROP_WIDTH).
   */
  scrollBackdrop: false,
  /**
   * Show the photo in the hero. The delivered original is 469×569, which only
   * holds up in the contained frame it is displayed in here. Set to false for a
   * text-only hero on the calm ivory field — sharp and empty beats large and
   * soft. Turn the full-bleed treatment back on only with a real high-resolution
   * original (see README).
   */
  heroPhoto: true,
};

export const nav = [
  { href: '#om-oss', label: 'Om oss' },
  { href: '#tjanster', label: 'Tjänster' },
  { href: '#galleri', label: 'Galleri' },
  { href: '#salonger', label: 'Salonger' },
  { href: '#kontakt', label: 'Kontakt' },
];

/** tel: href from a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
