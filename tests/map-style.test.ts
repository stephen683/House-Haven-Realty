import { describe, it, expect } from 'vitest'
import { BASEMAP_STYLE_URL, isKeylessStyleUrl } from '@/lib/map-style'

describe('basemap style', () => {
  it('is a single shared definition, not per-component', async () => {
    // The CARTO watermark shipped because three components each held their own
    // copy of the style. Every map surface must read this one constant.
    const files = [
      'components/pipeline/MapView.tsx',
      'components/pipeline/PropertyHeroMap.tsx',
      'app/pipeline/[zip]/ZipMapEmbed.tsx',
    ]
    const { readFileSync } = await import('node:fs')
    for (const f of files) {
      const src = readFileSync(f, 'utf8')
      expect(src, `${f} should use the shared basemap`).toContain('BASEMAP_STYLE_URL')
      expect(src, `${f} should not inline a tile host`).not.toMatch(/cartocdn\.com|\.png'\s*,?\s*$/m)
    }
  })

  it('defaults to a keyless style URL', () => {
    expect(BASEMAP_STYLE_URL).toMatch(/^https:\/\//)
    expect(isKeylessStyleUrl(BASEMAP_STYLE_URL)).toBe(true)
  })

  it('does not point at CARTO, which now watermarks unauthenticated tiles', () => {
    expect(BASEMAP_STYLE_URL).not.toContain('cartocdn.com')
  })

  it('recognises a credentialed URL as not keyless', () => {
    expect(isKeylessStyleUrl('https://tiles.example.com/s.json?api_key=abc')).toBe(false)
    expect(isKeylessStyleUrl('https://tiles.example.com/s.json?access_token=abc')).toBe(false)
    expect(isKeylessStyleUrl('https://tiles.example.com/styles/positron')).toBe(true)
  })
})
