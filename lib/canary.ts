// Canary monitoring for the Nashville Pipeline product surface. Defines the
// checks, runs them, records results to Supabase, and detects DOWN/RECOVERED
// state transitions so the cron route can email Stephen exactly once per event.

import { STAGE_LADDER, type StageKey } from './permit-stages'

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

const CHECKS: CheckDef[] = [
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

export async function runAllChecks(baseUrl: string): Promise<CheckResult[]> {
  return Promise.all(CHECKS.map((def) => runCheck(baseUrl, def)))
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
