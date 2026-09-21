import { NextRequest, NextResponse } from 'next/server'
import { isAgentAuthed } from '@/lib/agent-auth'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit, tooManyRequests, LIMITS } from '@/lib/rate-limit'
import { isLeadStatus } from '@/lib/leads-queue'
import { teamMembers } from '@/data/team'

export const runtime = 'nodejs'

const AGENT_NAMES = new Set(teamMembers.map((t) => t.name))

interface Payload {
  id?: string
  status?: string
  /** Who is taking it. Must be a name from data/team.ts. */
  agent?: string | null
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, LIMITS.agentContract)
  if (!limited.allowed) return tooManyRequests(LIMITS.agentContract)

  if (!(await isAgentAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Payload
  try {
    body = (await req.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const id = body.id?.toString().trim()
  const status = body.status?.toString().trim()
  const agent = body.agent?.toString().trim() || null

  if (!id) return NextResponse.json({ error: 'Lead id is required.' }, { status: 400 })
  if (!isLeadStatus(status)) {
    return NextResponse.json({ error: 'Unknown status.' }, { status: 400 })
  }
  // The portal password is shared, so the claimed name is the only attribution
  // there is. Pinning it to the roster stops it becoming a free-text field.
  if (agent !== null && !AGENT_NAMES.has(agent)) {
    return NextResponse.json({ error: 'Unknown agent.' }, { status: 400 })
  }
  if (status === 'working' && !agent) {
    return NextResponse.json({ error: 'Claiming a lead requires a name.' }, { status: 400 })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('leads')
      .update({
        status,
        assigned_agent: status === 'new' ? null : agent,
        status_changed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, status, assigned_agent, status_changed_at')
      .single()
    if (error) throw error
    return NextResponse.json({ ok: true, lead: data })
  } catch (err) {
    console.error('[agents/leads] status update failed', err)
    return NextResponse.json({ error: 'Could not update this lead.' }, { status: 500 })
  }
}
