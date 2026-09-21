import { describe, it, expect } from 'vitest'
import { scoreLead, classify, findPlaces, looksLikeGibberish } from '@/lib/lead-score'
import corpus from './fixtures/triage-corpus.json'

interface Case {
  label: string
  expect: 'inbox' | 'review' | 'file'
  email: string
  source: string
  message: string
}
const CASES = corpus.cases as Case[]

// Calibrated against the real leads table. The asymmetry that matters: a filed
// real client costs a commission, a filed bot costs nothing. Every threshold
// here is set so the first number stays zero.

describe('triage over the real corpus', () => {
  it('never files a real client', () => {
    const misfiled = CASES
      .filter((c) => c.label.includes('real'))
      .filter((c) => scoreLead(c).band === 'file')
      .map((c) => c.email)
    expect(misfiled).toEqual([])
  })

  it('files every B2B pitch', () => {
    const escaped = CASES
      .filter((c) => c.label === 'solicitation')
      .filter((c) => scoreLead(c).band !== 'file')
      .map((c) => `${c.email} → ${scoreLead(c).band}`)
    expect(escaped).toEqual([])
  })

  it('files every realtor-bait message', () => {
    const escaped = CASES
      .filter((c) => c.label === 'bait')
      .filter((c) => scoreLead(c).band !== 'file')
      .map((c) => `${c.email} → ${scoreLead(c).band}`)
    expect(escaped).toEqual([])
  })

  it('puts every case in the band the business wants', () => {
    const wrong = CASES
      .filter((c) => scoreLead(c).band !== c.expect)
      .map((c) => `${c.email}: want ${c.expect}, got ${scoreLead(c).band}`)
    expect(wrong).toEqual([])
  })

  it('ranks the three real clients above every bad submission', () => {
    const real = CASES.filter((c) => c.label === 'real').map((c) => scoreLead(c).score)
    const bad = CASES.filter((c) => c.label === 'bait' || c.label === 'solicitation').map((c) => scoreLead(c).score)
    expect(Math.min(...real)).toBeGreaterThan(Math.max(...bad))
  })
})

describe('place matching', () => {
  it('matches the shorthand real clients actually typed', () => {
    expect(findPlaces('Areas: 12 S').strong).toContain('12 s')
    expect(findPlaces('Areas: West nashville').strong).toContain('west nashville')
    expect(findPlaces('a home in The Nations').strong).toContain('the nations')
  })

  it('matches metro ZIPs the site already knows', () => {
    expect(findPlaces('looking around 37209').zips).toContain('37209')
    expect(findPlaces('moving to 90210').zips).toEqual([])
  })

  it('prefers the specific name over the bare city', () => {
    expect(findPlaces('East Nashville').strong[0]).toBe('east nashville')
  })

  it('treats names that are also big US cities as weak evidence', () => {
    // "relocating from Portland" must not read as a Middle Tennessee lead.
    const r = scoreLead({ message: 'Relocating from Portland, looking for a house', source: 'website' })
    expect(r.band).not.toBe('inbox')
  })
})

describe('classify', () => {
  it('does not call a specific local enquiry bait, even with a phone number', () => {
    expect(classify('I want to buy in Sylvan Park. Call me at 615-555-0100.')).toBeNull()
  })

  it('catches bait that names nowhere and pushes a number', () => {
    expect(classify('I am seeking a single-family home. Text me at 305-454-3792.')).toBe('bait')
  })

  it('catches WhatsApp regardless of anything else', () => {
    expect(classify('I want a home in The Nations, reach me on WhatsApp at 8084209229')).toBe('bait')
  })
})

describe('scoring never penalises a relocating buyer', () => {
  it('an out-of-state area code is not a signal', () => {
    // All three real clients had one: 734 Michigan, 303 Colorado, 203 Connecticut.
    const withArea = scoreLead({ message: 'Areas: 12 South\nBudget: $1.1M', source: 'home_search', budget: '$1.1M' })
    expect(withArea.band).toBe('inbox')
  })
})

describe('the structured form bonus has to be earned', () => {
  // 27 of the 30 historical home_search submissions were bots filling every
  // field with consonant soup. Using the form is not evidence of a person.
  const MASH = 'Areas: VYSoobpnlxmFyXBnkvcKLhEP\nBudget: GjENazVqZDRreuSsnZnaT\nBeds: 3+\nTimeline: Just learning the market\n\nNotes:\nLisPcBbTQgEoCakSmqda'

  it('files a bot that filled the structured form with mash', () => {
    const r = scoreLead({ message: MASH, source: 'home_search', budget: 'GjENazVqZDRreuSsnZnaT' })
    expect(r.band).toBe('file')
    expect(r.reasons.join(' ')).toMatch(/keyboard mash/)
  })

  it('is the verbatim row that slipped the spam guard on a single Gmail dot', () => {
    const r = scoreLead({
      message: 'Areas: WwsqAUXpUvARgtWgtSlsAfl\nBudget: XawtnPFcBSkyNdXOIDhVjq\nBeds: 2+\nTimeline: I want to start now\n\nNotes:\nxrAxLPPxZToLpbUlJzC',
      source: 'home_search',
    })
    expect(r.band).toBe('file')
  })

  it('never calls a real Nashville place name mash', () => {
    for (const place of ['Murfreesboro', 'Goodlettsville', 'Hendersonville', 'Thompsons Station', 'West nashville', 'Wedgewood-Houston', '12 S', 'Spring Hill']) {
      expect(looksLikeGibberish(place), place).toBe(false)
    }
  })
})
