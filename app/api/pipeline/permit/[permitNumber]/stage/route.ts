import { NextRequest, NextResponse } from 'next/server'
import {
  fetchCaseByPermitNumber,
  fetchCaseTasks,
  fetchParcelByAPN,
  fetchPermitByNumber,
  type ParcelInfo,
} from '@/lib/permits'
import { computeStages, type StageView, type StageKey } from '@/lib/permit-stages'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FRESH_MS = 12 * 60 * 60 * 1000
const STALE_OK_MS = 72 * 60 * 60 * 1000

type CacheAge = 'fresh' | 'stale_ok' | 'stale' | 'miss'

interface OverrideView {
  stage: StageKey
  note: string
  confidence: string | null
  at: string
  expiresAt: string | null
}

interface StageResponse {
  permitNumber: string
  caseId: number | null
  currentStage: StageKey
  effectiveStage: StageKey
  stages: StageView[]
  override: OverrideView | null
  parcel: ParcelInfo | null
  fetchedAt: string
  cacheAge: CacheAge
  degraded: boolean
}

function cacheAgeOf(fetchedAt: string): CacheAge {
  const age = Date.now() - new Date(fetchedAt).getTime()
  if (age < FRESH_MS) return 'fresh'
  if (age < STALE_OK_MS) return 'stale_ok'
  return 'stale'
}

function formatOverride(row: {
  override_stage: string | null
  override_note: string | null
  override_confidence: string | null
  override_at: string | null
  override_expires_at: string | null
}): OverrideView | null {
  if (!row.override_stage || !row.override_at) return null
  if (row.override_expires_at && new Date(row.override_expires_at).getTime() < Date.now()) return null
  return {
    stage: row.override_stage as StageKey,
    note: row.override_note ?? '',
    confidence: row.override_confidence,
    at: row.override_at,
    expiresAt: row.override_expires_at,
  }
}

async function liveFetch(permitNumber: string) {
  const caseRow = await fetchCaseByPermitNumber(permitNumber)
  if (!caseRow) return null
  const tasks = await fetchCaseTasks(caseRow.caseID)
  const computed = computeStages(caseRow, tasks)
  return { caseRow, tasks, computed }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ permitNumber: string }> },
) {
  const { permitNumber } = await params
  const supabase = await createClient()

  const [cachedRes, knownRes] = await Promise.all([
    supabase.from('permit_stages').select('*').eq('permit_number', permitNumber).maybeSingle(),
    supabase.from('building_permits').select('permit_number,parcel').eq('permit_number', permitNumber).maybeSingle(),
  ])
  const cached = cachedRes.data
  const knownPermit = knownRes.data
  let apn: string | null = knownPermit?.parcel ?? null
  if (!apn) {
    const live = await fetchPermitByNumber(permitNumber)
    apn = live?.parcel || null
  }
  const parcel = apn ? await fetchParcelByAPN(apn) : null

  if (cached) {
    const age = cacheAgeOf(cached.fetched_at)
    const override = formatOverride(cached)
    const currentStage = cached.current_stage as StageKey
    const body: StageResponse = {
      permitNumber,
      caseId: cached.case_id,
      currentStage,
      effectiveStage: override?.stage ?? currentStage,
      stages: cached.stages_json as StageView[],
      override,
      parcel,
      fetchedAt: cached.fetched_at,
      cacheAge: age,
      degraded: false,
    }
    if (age === 'fresh') return NextResponse.json(body)
    // Return cache, refresh in background. Next.js will keep the process alive
    // long enough for this unawaited promise; ok to swallow errors.
    liveFetch(permitNumber)
      .then(async (r) => {
        if (!r) return
        await supabase.from('permit_stages').upsert({
          permit_number: permitNumber,
          case_id: r.caseRow.caseID,
          status_code: r.caseRow.statusCode,
          current_stage: r.computed.currentStage,
          stages_json: r.computed.stages,
          tasks_json: r.tasks,
          unmapped_codes: r.computed.unmapped,
          fetched_at: new Date().toISOString(),
          source: 'epermits',
          fetch_error: null,
        })
      })
      .catch((err) => console.error('[stage] background refresh failed', err))
    return NextResponse.json(body)
  }

  // Cache miss — gate live fetch behind the ArcGIS allowlist (building_permits).
  if (!knownPermit) {
    // Still allow the fetch if the permit exists in ePermits even when our
    // building_permits cache hasn't caught up — but cap at one lookup.
    const live = await liveFetch(permitNumber)
    if (!live) return NextResponse.json({ error: 'permit not found' }, { status: 404 })
    await supabase.from('permit_stages').upsert({
      permit_number: permitNumber,
      case_id: live.caseRow.caseID,
      status_code: live.caseRow.statusCode,
      current_stage: live.computed.currentStage,
      stages_json: live.computed.stages,
      tasks_json: live.tasks,
      unmapped_codes: live.computed.unmapped,
    })
    const body: StageResponse = {
      permitNumber,
      caseId: live.caseRow.caseID,
      currentStage: live.computed.currentStage,
      effectiveStage: live.computed.currentStage,
      stages: live.computed.stages,
      override: null,
      parcel,
      fetchedAt: new Date().toISOString(),
      cacheAge: 'miss',
      degraded: false,
    }
    return NextResponse.json(body)
  }

  const live = await liveFetch(permitNumber)
  if (!live) {
    return NextResponse.json(
      { error: 'stage data temporarily unavailable', retryAfter: 60 },
      { status: 503, headers: { 'Retry-After': '60' } },
    )
  }

  await supabase.from('permit_stages').upsert({
    permit_number: permitNumber,
    case_id: live.caseRow.caseID,
    status_code: live.caseRow.statusCode,
    current_stage: live.computed.currentStage,
    stages_json: live.computed.stages,
    tasks_json: live.tasks,
    unmapped_codes: live.computed.unmapped,
  })

  const body: StageResponse = {
    permitNumber,
    caseId: live.caseRow.caseID,
    currentStage: live.computed.currentStage,
    effectiveStage: live.computed.currentStage,
    stages: live.computed.stages,
    override: null,
    parcel,
    fetchedAt: new Date().toISOString(),
    cacheAge: 'miss',
    degraded: false,
  }
  return NextResponse.json(body)
}

