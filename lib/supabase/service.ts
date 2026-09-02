import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client for route handlers and server components.
 *
 * Every table in this project is closed to the anon and authenticated roles:
 * the site has no login, so a request's cookies carry no identity worth
 * honoring, and the anon key ships in the browser bundle. Server-side reads
 * and writes therefore run as the service role, which bypasses RLS. Never
 * import this from a client component.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase service credentials are not configured')
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
