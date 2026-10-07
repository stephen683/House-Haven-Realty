import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

// House Haven is not taking a Realtracs feed. The IDX apparatus built for one
// is gone, and the part that mattered was a live compliance defect: all 57
// community pages asserted "Listings displayed are provided courtesy of the
// Realtracs MLS … © Realtracs … Data last updated: <today>" while displaying
// no listings at all.

const root = process.cwd()
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8')
/**
 * Comments stripped. A file that explains in a comment why it no longer
 * asserts a Realtracs copyright would otherwise fail a test looking for that
 * copyright — the comment is the opposite of the defect.
 */
const code = (p: string) =>
  read(p).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
const exists = (p: string) => fs.existsSync(path.join(root, p))

describe('no page claims to display MLS data', () => {
  const PAGES = ['app/homes-for-sale/page.tsx', 'app/communities/[slug]/page.tsx']

  for (const page of PAGES) {
    it(`${page} does not render the Realtracs IDX disclaimer`, () => {
      expect(read(page)).not.toContain('IDXDisclaimer')
    })
  }

  it('nothing anywhere renders it', () => {
    const stack = [path.join(root, 'app'), path.join(root, 'components')]
    const offenders: string[] = []
    while (stack.length) {
      const dir = stack.pop()!
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) { stack.push(full); continue }
        if (!/\.tsx?$/.test(e.name)) continue
        const rel = path.relative(root, full)
        // The component itself stays in components/compliance/ — CLAUDE.md
        // forbids deleting from there, and whether a brokerage keeps an unused
        // disclaimer on file is the principal broker's call, not a code one.
        if (rel === path.join('components', 'compliance', 'IDXDisclaimer.tsx')) continue
        if (read(rel).includes('IDXDisclaimer')) offenders.push(rel)
      }
    }
    expect(offenders).toEqual([])
  })

  it('no page carries a fabricated MLS freshness timestamp', () => {
    for (const page of PAGES) {
      expect(code(page)).not.toMatch(/Realtracs/i)
      expect(code(page)).not.toMatch(/deemed reliable/i)
      expect(code(page)).not.toMatch(/Data last updated/i)
    }
  })
})

describe('the dead feed code is gone, not dormant', () => {
  for (const p of [
    'lib/mlsgrid.ts',
    'components/listings/ListingCard.tsx',
    'components/listings/ListingGrid.tsx',
    'components/listings/SearchFilters.tsx',
    'app/homes-for-sale/[id]/page.tsx',
  ]) {
    it(`${p} is removed`, () => {
      expect(exists(p)).toBe(false)
    })
  }

  it('nothing imports the removed feed client', () => {
    const stack = [path.join(root, 'app'), path.join(root, 'components'), path.join(root, 'lib')]
    const offenders: string[] = []
    while (stack.length) {
      const dir = stack.pop()!
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name)
        if (e.isDirectory()) { stack.push(full); continue }
        if (!/\.tsx?$/.test(e.name)) continue
        const src = fs.readFileSync(full, 'utf8')
        if (/from '@?\/?.*mlsgrid'|components\/listings/.test(src)) {
          offenders.push(path.relative(root, full))
        }
      }
    }
    expect(offenders).toEqual([])
  })
})

describe('the NAR commission disclosure survives the removal', () => {
  // It lived in IDXDisclaimer too, but has its own component, so removing the
  // IDX renders does not drop a statutory disclosure.
  const NAR = 'Broker commissions are not set by law and are fully negotiable.'

  it('CommissionDisclosure still carries the canonical wording verbatim', () => {
    expect(read('components/compliance/CommissionDisclosure.tsx')).toContain(NAR)
  })

  for (const page of ['app/sellers/page.tsx', 'app/value/page.tsx', 'app/home-valuation/page.tsx']) {
    it(`${page} still renders it`, () => {
      expect(read(page)).toContain('CommissionDisclosure')
    })
  }
})

describe('the area parameter prefills rather than echoes', () => {
  const src = read('app/homes-for-sale/page.tsx')

  it('accepts the legacy city parameter the community pages link with', () => {
    expect(src).toMatch(/params\.area \?\? params\.city/)
  })

  it('only prefills a place the site knows, so the URL cannot inject text', () => {
    expect(src).toContain('KNOWN_AREAS.has(')
    expect(src).toMatch(/: ''/)
  })
})
