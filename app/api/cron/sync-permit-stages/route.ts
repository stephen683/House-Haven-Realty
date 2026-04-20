import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { fetchCaseByPermitNumber, fetchCaseTasks } from '@/lib/permits'
import { computeStages } from '@/lib/permit-stages'

export const runtime = 'nodejs'
export const maxDuration = 300

const CONCURRENCY = 5
const WINDOW_DAYS = 90

type SyncOutcome = 'ok' | 'miss' | 'error'

async function syncPermit(
  supabase: SupabaseClient,
  permitNumber: string,
): Promise<SyncOutcome> {
  try {
    const caseRow = await fetchCaseByPermitNumber(permitNumber)
    if (!caseRow) return 'miss'
    const tasks = await fetchCaseTasks(caseRow.caseID)
    const computed = computeStages(caseRow, tasks)
    const { error } = await supabase.from('permit_stages').upsert({
      permit_number: permitNumber,
      case_id: caseRow.caseID,
      status_code: caseRow.statusCode,
      current_stage: computed.currentStage,
      stages_json: computed.stages,
      tasks_json: tasks,
      unmapped_codes: computed.unmapped,
      fetched_at: new Date().toISOString(),
      source: 'cron',
      fetch_error: null,
    })
    if (error) {
      console.error('[sync-permit-stages] upsert failed', permitNumber, error.message)
      return 'error'
    }
    return 'ok'
  } catch (err) {
    console.error('[sync-permit-stages] failed', permitNumber, err)
    return 'error'
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { data: permits, error } = await supabase
    .from('building_permits')
    .select('permit_number')
    .gte('date_issued', since)
    .order('date_issued', { ascending: false })
    .limit(500)

  if (error) {
    return NextResponse.json({ error: 'Failed to load permits', details: error.message }, { status: 500 })
  }

  const numbers = (permits ?? []).map((p) => p.permit_number).filter((n): n is string => !!n)
  const counts: Record<SyncOutcome, number> = { ok: 0, miss: 0, error: 0 }

  for (let i = 0; i < numbers.length; i += CONCURRENCY) {
    const batch = numbers.slice(i, i + CONCURRENCY)
    const results = await Promise.all(batch.map((n) => syncPermit(supabase, n)))
    for (const r of results) counts[r]++
  }

  return NextResponse.json({
    success: true,
    total: numbers.length,
    synced: counts.ok,
    misses: counts.miss,
    errors: counts.error,
    timestamp: new Date().toISOString(),
  })
}
