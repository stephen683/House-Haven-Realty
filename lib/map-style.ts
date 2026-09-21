// Basemap for every MapLibre surface (Pipeline map, ZIP embed, property hero).
//
// Was CARTO's keyless `basemaps.cartocdn.com/light_all` raster tiles. CARTO moved
// basemaps behind an account: unauthenticated requests still return 200 with a
// tile, but the tile has "API KEY REQUIRED" stamped across it — so the map kept
// "working" and quietly rendered watermarked over the whole county. Three
// components each held their own copy of that style, so one vendor change broke
// all three at once. One definition now, and it stays keyless.
//
// OpenFreeMap's positron is the same Positron design CARTO light_all rendered,
// served free for commercial use with no key and no request cap.
//
// NEXT_PUBLIC_MAP_STYLE_URL overrides it — any MapLibre style URL, including a
// keyed CARTO or MapTiler one — so swapping providers never needs a code change.

const DEFAULT_STYLE_URL = 'https://tiles.openfreemap.org/styles/positron'

export const BASEMAP_STYLE_URL: string =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL || DEFAULT_STYLE_URL

/** True when the basemap needs no credential — the architecture's standing rule. */
export function isKeylessStyleUrl(url: string): boolean {
  return !/[?&](api_?key|access_?token|key)=/i.test(url)
}
