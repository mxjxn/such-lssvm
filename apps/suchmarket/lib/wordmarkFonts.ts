/**
 * Dev/preview helpers for comparing brand wordmark fonts via `?wordmark=<id>`.
 * Default (no param / unknown) stays Comic Neue Bold — production look unchanged.
 */
export type WordmarkFontId =
  | 'comic-neue'
  | 'fredoka'
  | 'baloo-2'
  | 'luckiest-guy'
  | 'bagel-fat-one'
  | 'lilita-one'
  | 'chewy'
  | 'rubik-mono-one'
  | 'dela-gothic-one'

export type WordmarkFontSpec = {
  id: WordmarkFontId
  /** CSS font-family stack applied to `.sm-wordmark` */
  family: string
  /** Google Fonts CSS2 family query (omit for Comic Neue — already loaded) */
  google?: string
  /** Applied font-weight for the wordmark */
  weight: number
}

export const WORDMARK_FONTS: Record<WordmarkFontId, WordmarkFontSpec> = {
  'comic-neue': {
    id: 'comic-neue',
    family: "var(--font-comic), 'Comic Neue', cursive",
    weight: 700,
  },
  fredoka: {
    id: 'fredoka',
    family: "'Fredoka', sans-serif",
    google: 'Fredoka:wght@700',
    weight: 700,
  },
  'baloo-2': {
    id: 'baloo-2',
    family: "'Baloo 2', cursive",
    google: 'Baloo+2:wght@800',
    weight: 800,
  },
  'luckiest-guy': {
    id: 'luckiest-guy',
    family: "'Luckiest Guy', cursive",
    google: 'Luckiest+Guy',
    weight: 400,
  },
  'bagel-fat-one': {
    id: 'bagel-fat-one',
    family: "'Bagel Fat One', cursive",
    google: 'Bagel+Fat+One',
    weight: 400,
  },
  'lilita-one': {
    id: 'lilita-one',
    family: "'Lilita One', cursive",
    google: 'Lilita+One',
    weight: 400,
  },
  chewy: {
    id: 'chewy',
    family: "'Chewy', cursive",
    google: 'Chewy',
    weight: 400,
  },
  'rubik-mono-one': {
    id: 'rubik-mono-one',
    family: "'Rubik Mono One', sans-serif",
    google: 'Rubik+Mono+One',
    weight: 400,
  },
  'dela-gothic-one': {
    id: 'dela-gothic-one',
    family: "'Dela Gothic One', cursive",
    google: 'Dela+Gothic+One',
    weight: 400,
  },
}

export function parseWordmarkParam(raw: string | null | undefined): WordmarkFontId | null {
  if (!raw) return null
  const key = raw.trim().toLowerCase().replace(/_/g, '-') as WordmarkFontId
  return key in WORDMARK_FONTS ? key : null
}
