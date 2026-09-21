import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { screenSubmission, canonicalEmail, MIN_FILL_MS, MAX_GMAIL_DOTS } from '@/lib/spam-guard'

const corpus = JSON.parse(
  readFileSync('tests/fixtures/submissions-corpus.json', 'utf8'),
) as { real: Record<string, string>[]; bot: Record<string, string>[] }

describe('spam guard — replayed against real submissions', () => {
  // The bar that matters: never block a client. Lauren Kane's listing-plus-
  // purchase sat unread for eight weeks because it was buried in this noise;
  // a filter that drops her is worse than the spam.
  it('passes every genuine client', () => {
    for (const lead of corpus.real) {
      const v = screenSubmission(lead)
      expect(v.spam, `blocked a real client: ${lead.firstName} ${lead.lastName} — ${!v.spam ? '' : v.rule}`).toBe(false)
    }
  })

  it('blocks the automated traffic', () => {
    const missed = corpus.bot.filter((b) => !screenSubmission(b).spam)
    const caught = corpus.bot.length - missed.length
    expect(
      caught / corpus.bot.length,
      `only caught ${caught}/${corpus.bot.length}; missed ${missed.map((m) => m.email).join(', ')}`,
    ).toBeGreaterThanOrEqual(0.95)
  })

  it('catches 100% of the bot corpus in practice', () => {
    expect(corpus.bot.filter((b) => !screenSubmission(b).spam)).toEqual([])
  })
})

describe('spam guard — individual rules', () => {
  it('rejects a filled honeypot', () => {
    const v = screenSubmission({ email: 'a@b.com', honeypot: 'http://x' })
    expect(v).toMatchObject({ spam: true, rule: 'honeypot' })
  })

  it('ignores an empty or whitespace honeypot', () => {
    expect(screenSubmission({ email: 'a@b.com', honeypot: '   ' }).spam).toBe(false)
  })

  it('rejects a submission faster than a human can type', () => {
    const v = screenSubmission({ email: 'a@b.com', formLoadedAt: Date.now() - 200 })
    expect(v).toMatchObject({ spam: true, rule: 'too_fast' })
  })

  it('allows an unhurried submission', () => {
    expect(screenSubmission({ email: 'a@b.com', formLoadedAt: Date.now() - (MIN_FILL_MS + 5_000) }).spam).toBe(false)
  })

  it('rejects gmail dot-stuffing past the calibrated threshold', () => {
    const v = screenSubmission({ email: 'a.h.ub.ib.oh.u.2.31@gmail.com' })
    expect(v).toMatchObject({ spam: true, rule: 'gmail_dot_stuffing' })
  })

  it('leaves ordinary dotted gmail addresses alone', () => {
    // The threshold exists because this address is a real client.
    expect(screenSubmission({ email: 'lauren.kane05@gmail.com' }).spam).toBe(false)
    expect(screenSubmission({ email: 'first.last@gmail.com' }).spam).toBe(false)
    expect(screenSubmission({ email: `a.b.c@gmail.com` }).spam).toBe(false)
    expect(MAX_GMAIL_DOTS).toBe(2)
  })

  it('does not apply the dot rule to non-gmail domains', () => {
    expect(screenSubmission({ email: 'a.b.c.d.e.f@somecompany.co.uk' }).spam).toBe(false)
  })

  it('rejects keyboard-mash names but not long real ones', () => {
    expect(screenSubmission({ firstName: 'GWSWAllaeYDlftAfcjhSal', email: 'x@y.com' })).toMatchObject({ rule: 'gibberish_name' })
    for (const n of ['Christopher', 'Alexander', 'Maximilian', 'Bartholomew', 'Konstantin']) {
      expect(screenSubmission({ firstName: n, email: 'x@y.com' }).spam, `blocked ${n}`).toBe(false)
    }
  })

  it('rejects link-stuffed pitches', () => {
    const v = screenSubmission({ email: 'x@y.com', message: 'see example.com and foo.net plus https://bar.io and www.baz.org' })
    expect(v).toMatchObject({ spam: true, rule: 'link_stuffing' })
  })

  it('allows a message that mentions one address', () => {
    expect(screenSubmission({ email: 'x@y.com', message: 'I saw the listing on zillow.com, is it still available?' }).spam).toBe(false)
  })

  it('flags a missing surname without blocking it', () => {
    const v = screenSubmission({ firstName: 'Madonna', lastName: '', email: 'x@y.com' })
    expect(v.spam).toBe(false)
    if (!v.spam) expect(v.signals).toContain('no_surname')
  })
})

describe('canonicalEmail', () => {
  it('collapses gmail dots and +tags to the delivering inbox', () => {
    expect(canonicalEmail('First.Last+houses@gmail.com')).toBe('firstlast@gmail.com')
    expect(canonicalEmail('f.i.r.s.t@googlemail.com')).toBe('first@gmail.com')
  })
  it('strips only the +tag on other providers, since dots are significant there', () => {
    expect(canonicalEmail('First.Last+x@outlook.com')).toBe('first.last@outlook.com')
  })
})
