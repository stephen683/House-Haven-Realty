// Per-IP, per-endpoint throttling for public routes.
//
// Backed by a Postgres function so the count is atomic across concurrent
// lambdas — an in-memory counter is per-instance and therefore useless on
// serverless. Fails OPEN: if the limiter itself is unavailable, a genuine
// client must still be able to reach the form. Spam control is not worth
// dropping a lead over.

import { createServiceClient } from '@/lib/supabase/service'

export interface RateLimitRule {
  /** Distinct name per endpoint, so limits never bleed across forms. */
  key: string
  max: number
  windowSeconds: number
}

/** Submissions that create a lead or cost money are the tightest. */
export const LIMITS = {
  contact: { key: 'contact', max: 5, windowSeconds: 3600 },
  newsletter: { key: 'newsletter', max: 5, windowSeconds: 3600 },
  valuation: { key: 'valuation', max: 5, windowSeconds: 3600 },
  cmaRequest: { key: 'cma', max: 5, windowSeconds: 3600 },
  notifyProperty: { key: 'notify', max: 10, windowSeconds: 3600 },
  /** Billed per call by RentCast, so tighter than the lead forms. */
  valueLookup: { key: 'value', max: 12, windowSeconds: 3600 },
  /** Shared-password portal: the brute-force surface. */
  agentAuth: { key: 'agent-auth', max: 8, windowSeconds: 900 },
  agentContract: { key: 'agent-contract', max: 20, windowSeconds: 3600 },
} as const satisfies Record<string, RateLimitRule>

/**
 * Best-effort client IP. Vercel sets x-forwarded-for; the left-most entry is
 * the original client. Falls back to a single shared bucket, which throttles
 * everyone together rather than nobody.
 */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  /** True when the limiter could not be consulted and we let the request pass. */
  degraded: boolean
}

export async function checkRateLimit(req: Request, rule: RateLimitRule): Promise<RateLimitResult> {
  const bucket = `${rule.key}:${clientIp(req)}`
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.rpc('rate_limit_take', {
      p_bucket: bucket,
      p_max_hits: rule.max,
      p_window_seconds: rule.windowSeconds,
    })
    if (error) {
      console.error('[rate-limit] rpc failed, allowing through:', error.message)
      return { allowed: true, degraded: true }
    }
    return { allowed: data === true, degraded: false }
  } catch (err) {
    console.error('[rate-limit] unavailable, allowing through:', err)
    return { allowed: true, degraded: true }
  }
}

/** 429 with Retry-After, the response a well-behaved client understands. */
export function tooManyRequests(rule: RateLimitRule): Response {
  return new Response(
    JSON.stringify({ error: 'Too many submissions. Please try again later, or call (615) 624-4766.' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rule.windowSeconds),
      },
    },
  )
}
