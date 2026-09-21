import 'server-only'
import { createServiceClient } from './supabase/service'

/**
 * Reads for the agent queue.
 *
 * All 156 leads sat at status 'new' for five months. The status column was
 * decoration — nothing wrote it and nobody read it — so a buy-and-sell client
 * went eight weeks without a reply while sitting in plain sight. A list is
 * only a queue if it has an order and a way to take something off it.
 */

export const LEAD_STATUSES = ['new', 'working', 'contacted', 'closed'] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v)
}

export interface QueueLead {
  id: string
  createdAt: string
  statusChangedAt: string | null
  firstName: string
  lastName: string
  email: string
  phone: string | null
  formType: string
  source: string
  interest: string | null
  message: string | null
  timeline: string | null
  propertyAddress: string | null
  pageUrl: string | null
  status: LeadStatus
  assignedAgent: string | null
  score: number | null
  band: string | null
  reasons: string | null
  notifiedAt: string | null
}

const COLUMNS =
  'id, created_at, status_changed_at, first_name, last_name, email, phone, form_type, ' +
  'source, interest, message, timeline, property_address, page_url, status, ' +
  'assigned_agent, lead_score, triage_band, triage_reasons, notified_at'

interface Row {
  id: string
  created_at: string
  status_changed_at: string | null
  first_name: string | null
  last_name: string | null
  email: string
  phone: string | null
  form_type: string | null
  source: string | null
  interest: string | null
  message: string | null
  timeline: string | null
  property_address: string | null
  page_url: string | null
  status: string | null
  assigned_agent: string | null
  lead_score: number | null
  triage_band: string | null
  triage_reasons: string | null
  notified_at: string | null
}

function toLead(r: Row): QueueLead {
  return {
    id: r.id,
    createdAt: r.created_at,
    statusChangedAt: r.status_changed_at,
    firstName: r.first_name ?? '',
    lastName: r.last_name ?? '',
    email: r.email,
    phone: r.phone,
    formType: r.form_type ?? 'contact',
    source: r.source ?? 'website',
    interest: r.interest,
    message: r.message,
    timeline: r.timeline,
    propertyAddress: r.property_address,
    pageUrl: r.page_url,
    status: isLeadStatus(r.status) ? r.status : 'new',
    assignedAgent: r.assigned_agent,
    score: r.lead_score,
    band: r.triage_band,
    reasons: r.triage_reasons,
    notifiedAt: r.notified_at,
  }
}

export type QueueView = 'unworked' | 'working' | 'contacted' | 'filed' | 'all'

export const QUEUE_VIEWS: { key: QueueView; label: string }[] = [
  { key: 'unworked', label: 'Unworked' },
  { key: 'working', label: 'Claimed' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'filed', label: 'Filed as spam' },
  { key: 'all', label: 'Everything' },
]

export function isQueueView(v: unknown): v is QueueView {
  return typeof v === 'string' && QUEUE_VIEWS.some((q) => q.key === v)
}

export async function loadQueue(view: QueueView, limit = 200): Promise<QueueLead[]> {
  const supabase = createServiceClient()
  let q = supabase.from('leads').select(COLUMNS).neq('form_type', 'canary')

  if (view === 'unworked') {
    // What an agent should open the page to: never worked, never filed.
    q = q.eq('status', 'new').or('triage_band.is.null,triage_band.neq.file')
  } else if (view === 'working') {
    q = q.eq('status', 'working')
  } else if (view === 'contacted') {
    q = q.in('status', ['contacted', 'closed'])
  } else if (view === 'filed') {
    q = q.eq('triage_band', 'file')
  }

  const { data, error } = await q
    .order('lead_score', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[leads-queue] read failed:', error.message)
    throw new Error(error.message)
  }
  return ((data ?? []) as unknown as Row[]).map(toLead)
}

export async function queueCounts(): Promise<Record<QueueView, number>> {
  const views = QUEUE_VIEWS.map((v) => v.key)
  const results = await Promise.all(views.map((v) => loadQueue(v, 1000).then((r) => r.length).catch(() => 0)))
  return Object.fromEntries(views.map((v, i) => [v, results[i]])) as Record<QueueView, number>
}

/** Whole days a lead has been sitting where it is. */
export function daysSince(iso: string | null): number {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}
