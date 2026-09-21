import { describe, it, expect, vi, afterEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  runAlertChannelCheck,
  runLeadsWriteCheck,
  runCorpusAgreementCheck,
  CANARY_LEAD_EMAIL,
  CORPUS_TOLERANCE,
} from '@/lib/canary'
import { readFileSync } from 'node:fs'

// ── leads write path ────────────────────────────────────────────────────────

interface LeadsStub {
  preCleanError?: string
  insertError?: string
  insertedId?: string | null
  deleteError?: string
}

function stubLeads(opts: LeadsStub) {
  const calls: string[] = []
  const client = {
    from: (table: string) => ({
      delete: () => ({
        eq: (col: string) => {
          const isPreClean = col === 'email'
          calls.push(isPreClean ? `preclean:${table}` : `delete:${table}`)
          return Promise.resolve({
            error: isPreClean
              ? opts.preCleanError ? { message: opts.preCleanError } : null
              : opts.deleteError ? { message: opts.deleteError } : null,
          })
        },
      }),
      insert: () => ({
        select: () => ({
          limit: () => {
            calls.push(`insert:${table}`)
            return Promise.resolve({
              data: opts.insertedId === null ? [] : [{ id: opts.insertedId ?? 'row-1' }],
              error: opts.insertError ? { message: opts.insertError } : null,
            })
          },
        }),
      }),
    }),
  } as unknown as SupabaseClient
  return { client, calls }
}

describe('canary leads write check', () => {
  it('passes and leaves no sentinel row behind', async () => {
    const { client, calls } = stubLeads({})
    const res = await runLeadsWriteCheck(client)
    expect(res.ok).toBe(true)
    expect(calls).toEqual(['preclean:leads', 'insert:leads', 'delete:leads'])
  })

  it('fails when the insert is refused — forms would be silently dropping leads', async () => {
    const res = await runLeadsWriteCheck(stubLeads({ insertError: 'permission denied for table leads' }).client)
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('insert refused')
    expect(res.errorExcerpt).toContain('permission denied')
  })

  it('fails when the insert returns no row rather than reporting success', async () => {
    const res = await runLeadsWriteCheck(stubLeads({ insertedId: null }).client)
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('silently dropped')
  })

  it('fails loudly when cleanup fails, so sentinel rows cannot accumulate', async () => {
    const res = await runLeadsWriteCheck(stubLeads({ deleteError: 'no delete grant' }).client)
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('sentinel row left behind')
  })

  it('uses an address that cannot reach a real inbox', () => {
    expect(CANARY_LEAD_EMAIL.endsWith('.invalid')).toBe(true)
  })
})

// ── corpus agreement ────────────────────────────────────────────────────────

function stubCount(count: number | null, error?: string) {
  return {
    from: () => ({
      select: () => ({
        gte: () => Promise.resolve({ count, error: error ? { message: error } : null }),
      }),
    }),
  } as unknown as SupabaseClient
}

const scoresResponding = (totalPermits: unknown, status = 200) =>
  vi.fn(async () =>
    new Response(JSON.stringify({ meta: { totalPermits } }), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  )

describe('canary corpus agreement check', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('passes when the two surfaces describe the same corpus', async () => {
    vi.stubGlobal('fetch', scoresResponding(3525))
    const res = await runCorpusAgreementCheck('https://x.test', stubCount(3525))
    expect(res.ok).toBe(true)
  })

  it('catches the exact saturation drift that shipped: 2,000-row cap vs 3,525 cached', async () => {
    vi.stubGlobal('fetch', scoresResponding(2000))
    const res = await runCorpusAgreementCheck('https://x.test', stubCount(3525))
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('reading different data')
    expect(res.errorExcerpt).toContain('2000')
    expect(res.errorExcerpt).toContain('3525')
  })

  it('tolerates the small drift of a sync running between the two reads', async () => {
    const within = Math.floor(3525 * (1 + CORPUS_TOLERANCE * 0.5))
    vi.stubGlobal('fetch', scoresResponding(within))
    expect((await runCorpusAgreementCheck('https://x.test', stubCount(3525))).ok).toBe(true)
  })

  it('fails when the cached corpus is empty', async () => {
    vi.stubGlobal('fetch', scoresResponding(3525))
    const res = await runCorpusAgreementCheck('https://x.test', stubCount(0))
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('empty')
  })

  it('fails when scores omits the total instead of assuming agreement', async () => {
    vi.stubGlobal('fetch', scoresResponding(undefined))
    expect((await runCorpusAgreementCheck('https://x.test', stubCount(3525))).ok).toBe(false)
  })

  it('fails when the scores endpoint errors', async () => {
    vi.stubGlobal('fetch', scoresResponding(3525, 503))
    const res = await runCorpusAgreementCheck('https://x.test', stubCount(3525))
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('503')
  })
})

// ── coverage contract ───────────────────────────────────────────────────────

describe('canary coverage', () => {
  it('watches the domain customers use, not the pre-launch alias', () => {
    const src = readFileSync('app/api/cron/canary/route.ts', 'utf8')
    const code = src.replace(/^\s*\/\/.*$/gm, '')
    expect(code).toContain('https://www.househavenrealty.com')
    expect(code).not.toContain('project-bmq0e')
  })

  it('covers the revenue path and the statutory disclosures', () => {
    const src = readFileSync('lib/canary.ts', 'utf8')
    for (const needle of [
      "key: 'GET /'",
      "key: 'GET /contact'",
      "key: 'GET /value'",
      'Tennessee Real Estate Commission',
      'I agree to be contacted by House Haven Realty via call, email, and text',
      'Broker commissions are not set by law and are fully negotiable.',
    ]) {
      expect(src, `canary should assert ${needle}`).toContain(needle)
    }
  })
})

// ── alert channel ───────────────────────────────────────────────────────────

describe('canary alert channel check', () => {
  const original = process.env.RESEND_API_KEY
  afterEach(() => {
    if (original === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = original
    vi.resetModules()
  })

  it('fails when alerts would only reach the logs', async () => {
    delete process.env.RESEND_API_KEY
    vi.resetModules()
    const { runAlertChannelCheck: check } = await import('@/lib/canary')
    const res = check()
    expect(res.ok).toBe(false)
    expect(res.errorExcerpt).toContain('never reach anyone')
  })

  it('passes once a key is configured', async () => {
    process.env.RESEND_API_KEY = 're_test'
    vi.resetModules()
    const { runAlertChannelCheck: check } = await import('@/lib/canary')
    expect(check().ok).toBe(true)
  })

  it('is distinguishable from a dry-run send reporting success', async () => {
    // sendEmail returns ok:true without a key on purpose, so a lead is never
    // lost to an unconfigured mailer. That is exactly why alerting cannot use
    // its return value as proof of delivery.
    delete process.env.RESEND_API_KEY
    vi.resetModules()
    const { sendEmail } = await import('@/lib/resend')
    const sent = await sendEmail({ from: 'a@b.c', to: 'd@e.f', subject: 's', text: 't' })
    expect(sent.ok).toBe(true)
    expect(sent.id).toBeNull()
    const { runAlertChannelCheck: check } = await import('@/lib/canary')
    expect(check().ok).toBe(false)
  })
})
