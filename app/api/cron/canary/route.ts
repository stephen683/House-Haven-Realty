import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/resend'
import {
  runAllChecks,
  classifyTransition,
  shouldAlert,
  formatAlertEmail,
  type CheckResult,
  type PriorState,
} from '@/lib/canary'

export const runtime = 'nodejs'
export const maxDuration = 60

// Default to the stable pre-launch public alias. After DNS cutover, set
// CANARY_BASE_URL=https://househavenrealty.com in Vercel. Never default to
// VERCEL_URL — per-deployment URLs are auth-gated on this project and will
// always return 401 from an unauthenticated canary fetch.
const CANARY_DEFAULT_BASE = 'https://project-bmq0e.vercel.app'

function canaryBaseUrl(): string {
  return (
    process.env.CANARY_BASE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    CANARY_DEFAULT_BASE
  )
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET ? `Bearer ${process.env.CRON_SECRET}` : null
  if (expected && authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const baseUrl = canaryBaseUrl()
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? null
  const results = await runAllChecks(baseUrl)
  const now = new Date()

  const { data: priorRows } = await supabase
    .from('canary_state')
    .select('endpoint, current_ok, status_since, last_alerted_at')
  const priorByEndpoint = new Map<string, PriorState>()
  for (const r of priorRows ?? []) priorByEndpoint.set(r.endpoint as string, r as PriorState)

  const alertsSent: string[] = []
  const failing: CheckResult[] = []

  for (const r of results) {
    if (!r.ok) failing.push(r)

    await supabase.from('canary_runs').insert({
      run_at: now.toISOString(),
      endpoint: r.endpoint,
      ok: r.ok,
      http_status: r.httpStatus,
      response_ms: r.responseMs,
      assertion: r.assertion,
      error_excerpt: r.errorExcerpt,
      commit_sha: commitSha,
    })

    const prior = priorByEndpoint.get(r.endpoint) ?? null
    const transition = classifyTransition(r, prior, now.getTime())
    const stateChanged = !prior || prior.current_ok !== r.ok

    const stateUpdate: {
      endpoint: string
      current_ok: boolean
      last_checked_at: string
      status_since?: string
      last_alerted_at?: string
      last_error: string | null
    } = {
      endpoint: r.endpoint,
      current_ok: r.ok,
      last_checked_at: now.toISOString(),
      last_error: r.errorExcerpt,
    }
    if (stateChanged) stateUpdate.status_since = now.toISOString()

    if (shouldAlert(transition)) {
      const email = formatAlertEmail({
        transition,
        result: r,
        statusSince: prior?.status_since ?? now.toISOString(),
        commitSha,
        baseUrl,
      })
      await sendEmail({
        from: 'House Haven Canary <alerts@househavenrealty.com>',
        to: 'stephen@househavenrealty.com',
        subject: email.subject,
        text: email.text,
      })
      stateUpdate.last_alerted_at = now.toISOString()
      alertsSent.push(`${transition}:${r.endpoint}`)
    }

    await supabase.from('canary_state').upsert(stateUpdate, { onConflict: 'endpoint' })
  }

  return NextResponse.json({
    ok: failing.length === 0,
    checked: results.length,
    failing: failing.length,
    alertsSent,
    baseUrl,
    timestamp: now.toISOString(),
  })
}
