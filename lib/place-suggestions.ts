/**
 * Nashville-area place names offered to people filling in a form.
 *
 * Client-safe and deliberately small: the scorer's full vocabulary is built
 * from `data/communities.ts`, which is far too large to ship in a browser
 * bundle. These are the names a buyer is most likely to reach for.
 *
 * Every entry is asserted to be recognised by `findPlaces()` in
 * tests/place-suggestions.test.ts — if the two ever drift, that test fails.
 * Suggesting a place the scorer does not know would penalise the very people
 * who took the hint.
 *
 * This is a datalist, not a dropdown. A buyer who wants somewhere not on the
 * list types it, and free text still scores: the suggestions raise the floor,
 * they do not cap it.
 */
export const PLACE_SUGGESTIONS: string[] = [
  '12 South',
  'Antioch',
  'Belle Meade',
  'Bellevue',
  'Berry Hill',
  'Bordeaux',
  'Brentwood',
  'Donelson',
  'East Nashville',
  'Franklin',
  'Germantown',
  'Goodlettsville',
  'Green Hills',
  'Hendersonville',
  'Hermitage',
  'Hillsboro Village',
  'Inglewood',
  'Joelton',
  'Kingston Springs',
  'La Vergne',
  'Lockeland Springs',
  'Madison',
  'Melrose',
  'Mt. Juliet',
  'Murfreesboro',
  'Music Row',
  'Nolensville',
  'Old Hickory',
  'Pleasant View',
  'Salemtown',
  'Smyrna',
  'Spring Hill',
  'Sylvan Park',
  'The Gulch',
  'The Nations',
  'Thompsons Station',
  'Wedgewood-Houston',
  'West End',
  'White House',
  'Whites Creek',
]
