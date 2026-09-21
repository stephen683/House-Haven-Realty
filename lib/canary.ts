// Canary monitoring. Defines the checks, runs them, records results to
// Supabase, and detects DOWN/RECOVERED state transitions so the cron route can
// email Stephen exactly once per event.
//
// Scope note: this started as Pipeline-only, which left the surfaces that
// actually earn money — the homepage and the lead forms — unwatched, and
// asserted shape rather than correctness. Two real bugs passed it cleanly: the
// saturation scores read a truncated corpus while the map read the cache, and
// /value served valuations derived from the characters of the address. Both
// returned well-formed 200s throughout. The checks below add the revenue path,
// the statutory disclosures, and one cross-surface agreement check.

import type { SupabaseClient } from '@supabase/supabase-js'
import { STAGE_LADDER, type StageKey } from './permit-stages'
import { isEmailConfigured } from './resend'

export interface CheckResult {
  endpoint: string
  ok: boolean
  httpStatus: number | null
  responseMs: number
  assertion: string
  errorExcerpt: string | null
}

interface CheckDef {
  key: string
  path: string
  assert: (res: Response, body: string) => Promise<string | null> | string | null
  timeoutMs?: number
}

const STAGE_KEYS = new Set<string>(STAGE_LADDER.map((s) => s.key))
const CANARY_PERMIT = '2026021249' // 1608 TAMMANY DR — stable reference permit

// Statutory strings. A site that quietly drops these is non-compliant while
// still returning 200, so the canary treats their absence as an outage.
const FIRM_NAME = 'House Haven Realty'               // TREC 1260-02-.12
const FIRM_PHONE = '(615) 624-4766'                  // TREC 1260-02-.12
const TREC_LINE = 'Tennessee Real Estate Commission' // TREC 1260-02-.12
const TCPA_LINE = 'I agree to be contacted by House Haven Realty via call, email, and text' // §5.4
const NAR_LINE = 'Broker commissions are not set by law and are fully negotiable.' // NAR 2026

/** Every page must carry the firm's identity per TREC. */
function trecMissing(body: string): string | null {
  for (const [label, needle] of [
    ['firm name', FIRM_NAME],
    ['firm phone', FIRM_PHONE],
    ['TREC licensure line', TREC_LINE],
  ] as const) {
    if (!body.includes(needle)) return `${label} missing — TREC 1260-02-.12`
  }
  return null
}

const CHECKS: CheckDef[] = [
  {
    // The homepage was not checked at all. It is the most-visited page and
    // carries the firm's TREC identity for every visitor who lands there.
    key: 'GET /',
    path: '/',
    assert: (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      if (body.length < 10_000) return `body too small (${body.length} bytes)`
      return trecMissing(body)
    },
  },
  {
    // Revenue path. Every lead the brokerage gets starts on a form, and none
    // of them were watched.
    key: 'GET /contact',
    path: '/contact',
    assert: (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const trec = trecMissing(body)
      if (trec) return trec
      if (!body.includes(TCPA_LINE)) return 'TCPA consent language missing from the contact form'
      return null
    },
  },
  {
    key: 'GET /value',
    path: '/value',
    assert: (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const trec = trecMissing(body)
      if (trec) return trec
      if (!body.includes(NAR_LINE)) return 'NAR commission disclosure missing from a seller-facing page'
      return null
    },
  },
  {
    key: 'GET /pipeline',
    path: '/pipeline',
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      if (body.length < 10_000) return `body too small (${body.length} bytes)`
      if (!body.includes('Nashville Pipeline')) return 'brand string missing from HTML'
      return null
    },
  },
  {
    key: 'GET /api/permits/geojson',
    path: '/api/permits/geojson?days=180&limit=500',
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const json = JSON.parse(body) as { type?: string; features?: unknown[] }
      if (json.type !== 'FeatureCollection') return `type was "${json.type}"`
      if (!Array.isArray(json.features) || json.features.length < 100)
        return `expected >=100 features, got ${json.features?.length ?? 0}`
      return null
    },
  },
  {
    key: 'GET /api/permits',
    path: '/api/permits',
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const json = JSON.parse(body) as { count?: number }
      if (typeof json.count !== 'number' || json.count < 1)
        return `count was ${json.count}`
      return null
    },
  },
  {
    key: 'GET /api/pipeline/scores',
    path: '/api/pipeline/scores',
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const json = JSON.parse(body) as { meta?: { zipsScored?: number; totalPermits?: number } }
      if ((json.meta?.zipsScored ?? 0) < 10)
        return `expected >=10 zips, got ${json.meta?.zipsScored}`
      return null
    },
  },
  {
    key: 'GET /api/pipeline/permit/[id]/stage',
    path: `/api/pipeline/permit/${CANARY_PERMIT}/stage`,
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      const json = JSON.parse(body) as { currentStage?: string; stages?: unknown[] }
      if (!json.currentStage || !STAGE_KEYS.has(json.currentStage))
        return `currentStage invalid: "${json.currentStage}"`
      if (!Array.isArray(json.stages) || json.stages.length !== STAGE_LADDER.length)
        return `stages length was ${json.stages?.length}`
      return null
    },
    timeoutMs: 8000,
  },
  {
    key: 'GET /pipeline/37206',
    path: '/pipeline/37206',
    assert: async (res, body) => {
      if (res.status !== 200) return `expected 200, got ${res.status}`
      if (body.length < 10_000) return `body too small (${body.length} bytes)`
      return null
    },
  },
]

async function runCheck(baseUrl: string, def: CheckDef): Promise<CheckResult> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), def.timeoutMs ?? 6000)
  const started = Date.now()
  try {
    const res = await fetch(`${baseUrl}${def.path}`, {
      signal: ctrl.signal,
      cache: 'no-store',
      headers: { 'User-Agent': 'HouseHaven-Canary/1.0' },
    })
    const body = await res.text()
    const elapsed = Date.now() - started
    const failReason = await def.assert(res, body)
    return {
      endpoint: def.key,
      ok: failReason === null,
      httpStatus: res.status,
      responseMs: elapsed,
      assertion: 'composite',
      errorExcerpt: failReason,
    }
  } catch (err) {
    return {
      endpoint: def.key,
      ok: false,
      httpStatus: null,
      responseMs: Date.now() - started,
      assertion: 'fetch',
      errorExcerpt: err instanceof Error ? err.message.slice(0, 300) : String(err),
    }
  } finally {
    clearTimeout(timer)
  }
}

// The HTTP checks all pass off the live ArcGIS feed even when building_permits
// is empty, so an unpopulated table was invisible to the canary. This check
// asserts the cached table itself: non-empty, and refreshed recently enough
// that a silently dead daily sync shows up within a week.
export const PERMIT_TABLE_ENDPOINT = 'DB public.building_permits'
export const PERMIT_FRESHNESS_DAYS = 7

export async function runPermitTableCheck(
  supabase: SupabaseClient,
): Promise<CheckResult> {
  const started = Date.now()
  const fail = (reason: string): CheckResult => ({
    endpoint: PERMIT_TABLE_ENDPOINT,
    ok: false,
    httpStatus: null,
    responseMs: Date.now() - started,
    assertion: 'rows>0 && max(date_issued) within ' + PERMIT_FRESHNESS_DAYS + 'd',
    errorExcerpt: reason.slice(0, 300),
  })

  try {
    const { count, error: countError } = await supabase
      .from('building_permits')
      .select('permit_number', { count: 'exact', head: true })
    if (countError) return fail(`count query failed: ${countError.message}`)
    if (!count) return fail('building_permits has 0 rows — daily sync is not writing')

    const { data, error: freshError } = await supabase
      .from('building_permits')
      .select('date_issued')
      .not('date_issued', 'is', null)
      .order('date_issued', { ascending: false })
      .limit(1)
    if (freshError) return fail(`freshness query failed: ${freshError.message}`)

    const newest = data?.[0]?.date_issued as string | undefined
    if (!newest) return fail(`${count} rows but no non-null date_issued`)

    const ageDays = (Date.now() - new Date(newest).getTime()) / 86_400_000
    if (ageDays > PERMIT_FRESHNESS_DAYS)
      return fail(
        `newest date_issued ${newest.slice(0, 10)} is ${ageDays.toFixed(1)}d old ` +
          `(limit ${PERMIT_FRESHNESS_DAYS}d)`,
      )

    return {
      endpoint: PERMIT_TABLE_ENDPOINT,
      ok: true,
      httpStatus: null,
      responseMs: Date.now() - started,
      assertion: 'rows>0 && max(date_issued) within ' + PERMIT_FRESHNESS_DAYS + 'd',
      errorExcerpt: null,
    }
  } catch (err) {
    return fail(err instanceof Error ? err.message : String(err))
  }
}

/**
 * The lead table accepts a write on the service role.
 *
 * Every form on the site lands in `leads`, and the September lockdown revoked
 * browser-role grants across the schema. If a future migration over-revokes,
 * or the service key rotates, forms fail silently for visitors and the only
 * signal is an absence of leads — which for a boutique brokerage is
 * indistinguishable from a quiet week. This proves the path rather than
 * waiting to infer it.
 *
 * Writes and removes one sentinel row. Cleans up first in case a prior run
 * died between insert and delete, and fails loudly if cleanup ever fails, so
 * the table cannot silently accumulate canary rows.
 */
export const LEADS_WRITE_ENDPOINT = 'DB public.leads (write path)'
export const CANARY_LEAD_EMAIL = 'canary@canary.invalid'

export async function runLeadsWriteCheck(
  supabase: SupabaseClient,
): Promise<CheckResult> {
  const started = Date.now()
  const assertion = 'insert+read+delete a sentinel row as the service role'
  const done = (reason: string | null): CheckResult => ({
    endpoint: LEADS_WRITE_ENDPOINT,
    ok: reason === null,
    httpStatus: null,
    responseMs: Date.now() - started,
    assertion,
    errorExcerpt: reason ? reason.slice(0, 300) : null,
  })

  try {
    const { error: preError } = await supabase
      .from('leads').delete().eq('email', CANARY_LEAD_EMAIL)
    if (preError) return done(`pre-clean failed: ${preError.message}`)

    const { data: inserted, error: insertError } = await supabase
      .from('leads')
      .insert({
        first_name: 'Canary',
        last_name: 'Probe',
        email: CANARY_LEAD_EMAIL,
        form_type: 'canary',
        source: 'canary',
        tcpa_consent: false,
      })
      .select('id')
      .limit(1)
    if (insertError) return done(`insert refused: ${insertError.message}`)

    const id = (inserted?.[0] as { id?: string } | undefined)?.id
    if (!id) return done('insert returned no row — write silently dropped')

    const { error: deleteError } = await supabase.from('leads').delete().eq('id', id)
    if (deleteError) return done(`cleanup failed, sentinel row left behind: ${deleteError.message}`)

    return done(null)
  } catch (err) {
    return done(err instanceof Error ? err.message : String(err))
  }
}

/**
 * The scores surface and the map describe the same corpus.
 *
 * This is the check that would have caught the saturation bug. /api/pipeline/scores
 * was computed from a live ArcGIS pull capped at 2,000 rows with no residential
 * filter, while the map drew 3,500+ deduped permits from the cache — so pin
 * colours and pins disagreed, and downtown 37203 ranked as the hottest
 * new-construction ZIP on commercial rehab permits. Every response stayed a
 * well-formed 200 throughout. Shape checks cannot see this; only comparing the
 * two totals can.
 */
export const CORPUS_AGREEMENT_ENDPOINT = 'Pipeline corpus agreement'
export const CORPUS_TOLERANCE = 0.05

export async function runCorpusAgreementCheck(
  baseUrl: string,
  supabase: SupabaseClient,
): Promise<CheckResult> {
  const started = Date.now()
  const assertion = `scores totalPermits within ${CORPUS_TOLERANCE * 100}% of the cached 365d corpus`
  const done = (reason: string | null): CheckResult => ({
    endpoint: CORPUS_AGREEMENT_ENDPOINT,
    ok: reason === null,
    httpStatus: null,
    responseMs: Date.now() - started,
    assertion,
    errorExcerpt: reason ? reason.slice(0, 300) : null,
  })

  try {
    const since = new Date(Date.now() - 365 * 86_400_000).toISOString()
    const [scoresRes, { count, error }] = await Promise.all([
      fetch(`${baseUrl}/api/pipeline/scores`, {
        cache: 'no-store',
        headers: { 'User-Agent': 'HouseHaven-Canary/1.0' },
      }),
      supabase
        .from('building_permits')
        .select('permit_number', { count: 'exact', head: true })
        .gte('date_issued', since),
    ])

    if (error) return done(`cache count failed: ${error.message}`)
    if (!count) return done('cached 365d corpus is empty')
    if (!scoresRes.ok) return done(`scores returned ${scoresRes.status}`)

    const json = (await scoresRes.json()) as { meta?: { totalPermits?: number } }
    const reported = json.meta?.totalPermits
    if (typeof reported !== 'number') return done(`scores meta.totalPermits was ${reported}`)

    const drift = Math.abs(reported - count) / count
    if (drift > CORPUS_TOLERANCE) {
      return done(
        `scores says ${reported} permits, cache holds ${count} over the same window ` +
          `(${(drift * 100).toFixed(1)}% apart) — the two surfaces are reading different data`,
      )
    }
    return done(null)
  } catch (err) {
    return done(err instanceof Error ? err.message : String(err))
  }
}

/**
 * The alert channel can actually reach a person.
 *
 * Every other check here assumes a failure gets emailed. sendEmail() returns
 * ok:true without a key, so without this the canary could be detecting outages
 * and reporting success at delivering the alerts — with last_alerted_at set,
 * which reads as proof the page went out. This check cannot email when it
 * fails, by definition; it goes red in canary_state and in the cron response,
 * which is the point.
 */
export const ALERT_CHANNEL_ENDPOINT = 'Alert channel (Resend)'

export function runAlertChannelCheck(): CheckResult {
  const configured = isEmailConfigured()
  return {
    endpoint: ALERT_CHANNEL_ENDPOINT,
    ok: configured,
    httpStatus: null,
    responseMs: 0,
    assertion: 'RESEND_API_KEY is set, so a DOWN alert would actually be delivered',
    errorExcerpt: configured
      ? null
      : 'RESEND_API_KEY is unset — alerts dry-run to logs. Every other check on ' +
        'this dashboard is unmonitored in practice: a failure would be detected, ' +
        'recorded, and never reach anyone.',
  }
}

export async function runAllChecks(
  baseUrl: string,
  supabase: SupabaseClient,
): Promise<CheckResult[]> {
  const [http, permitTable, leadsWrite, corpus] = await Promise.all([
    Promise.all(CHECKS.map((def) => runCheck(baseUrl, def))),
    runPermitTableCheck(supabase),
    runLeadsWriteCheck(supabase),
    runCorpusAgreementCheck(baseUrl, supabase),
  ])
  return [...http, permitTable, leadsWrite, corpus, runAlertChannelCheck()]
}

export type Transition = 'went_down' | 'recovered' | 'still_down_cooldown' | 'still_down_suppressed' | 'stable_ok' | 'stable_ok_first'

export interface PriorState {
  endpoint: string
  current_ok: boolean | null
  status_since: string | null
  last_alerted_at: string | null
}

const REPEAT_ALERT_COOLDOWN_MS = 60 * 60 * 1000 // 1 hour

export function classifyTransition(
  result: CheckResult,
  prior: PriorState | null,
  now: number = Date.now(),
): Transition {
  if (!prior || prior.current_ok === null) {
    return result.ok ? 'stable_ok_first' : 'went_down'
  }
  if (prior.current_ok && !result.ok) return 'went_down'
  if (!prior.current_ok && result.ok) return 'recovered'
  if (result.ok) return 'stable_ok'
  const lastAlert = prior.last_alerted_at ? new Date(prior.last_alerted_at).getTime() : 0
  if (now - lastAlert >= REPEAT_ALERT_COOLDOWN_MS) return 'still_down_cooldown'
  return 'still_down_suppressed'
}

export function shouldAlert(t: Transition): boolean {
  return t === 'went_down' || t === 'recovered' || t === 'still_down_cooldown'
}

export function formatAlertEmail(opts: {
  transition: Transition
  result: CheckResult
  statusSince: string | null
  commitSha: string | null
  baseUrl: string
}): { subject: string; text: string } {
  const { transition, result, statusSince, commitSha, baseUrl } = opts
  const sinceLabel = statusSince
    ? `since ${new Date(statusSince).toISOString().replace('T', ' ').slice(0, 19)} UTC`
    : 'duration unknown'

  let headline = ''
  if (transition === 'went_down') headline = `DOWN: ${result.endpoint}`
  else if (transition === 'recovered') headline = `RECOVERED: ${result.endpoint}`
  else headline = `STILL DOWN: ${result.endpoint}`

  const body = [
    headline,
    '',
    `Base URL:       ${baseUrl}`,
    `HTTP status:    ${result.httpStatus ?? 'no response'}`,
    `Response time:  ${result.responseMs}ms`,
    `Assertion:      ${result.assertion}`,
    `Error excerpt:  ${result.errorExcerpt ?? 'n/a'}`,
    `State:          ${sinceLabel}`,
    `Commit:         ${commitSha ?? 'unknown'}`,
    '',
    'Triage:',
    '1. Reproduce: curl ' + baseUrl + (CHECKS.find((c) => c.key === result.endpoint)?.path ?? ''),
    '2. Vercel logs:  https://vercel.com/stephen-delahoussayes-projects/house-haven-realty',
    '3. Open the repo in Claude Code and paste this email.',
  ].join('\n')

  return {
    subject: `[canary] ${headline}`,
    text: body,
  }
}
