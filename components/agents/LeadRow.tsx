'use client'

import { useState } from 'react'
import type { QueueLead } from '@/lib/leads-queue'

const BAND_STYLE: Record<string, string> = {
  inbox: 'bg-black text-white',
  review: 'bg-househaven-accent text-black',
  file: 'bg-black/10 text-black/60',
}

function days(iso: string | null): number {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}

export default function LeadRow({ lead, agent }: { lead: QueueLead; agent: string }) {
  const [status, setStatus] = useState(lead.status)
  const [assigned, setAssigned] = useState(lead.assignedAgent)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const age = days(lead.statusChangedAt ?? lead.createdAt)
  const name = `${lead.firstName} ${lead.lastName}`.trim() || lead.email

  async function move(next: 'working' | 'contacted' | 'new') {
    if (next === 'working' && !agent) {
      setError('Pick your name at the top of the page first.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/agents/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status: next, agent: next === 'new' ? null : agent }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Could not update.')
      setStatus(next)
      setAssigned(next === 'new' ? null : agent)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="border border-black/10 rounded-xl p-4 lg:p-5 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-househaven-text">{name}</h3>
            {lead.band && (
              <span className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded ${BAND_STYLE[lead.band] ?? 'bg-black/10'}`}>
                {lead.band}
                {lead.score !== null && ` ${lead.score}`}
              </span>
            )}
            {status !== 'new' && (
              <span className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded border border-black/20">
                {status}
                {assigned && ` · ${assigned}`}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-househaven-text/70 break-words">
            <a href={`mailto:${lead.email}`} className="underline underline-offset-2">{lead.email}</a>
            {lead.phone && (
              <>
                {' · '}
                <a href={`tel:${lead.phone}`} className="underline underline-offset-2">{lead.phone}</a>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-househaven-text/50">
            {lead.source} · {lead.formType}
            {' · '}
            {age === 0 ? 'today' : `${age} day${age === 1 ? '' : 's'} in ${status}`}
            {lead.notifiedAt === null && status === 'new' && lead.band !== 'file' && (
              <span className="text-black font-semibold"> · never emailed</span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {status === 'new' && (
            <button
              onClick={() => move('working')}
              disabled={busy}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-black text-white hover:bg-househaven-navy-light disabled:opacity-50"
            >
              Claim
            </button>
          )}
          {status !== 'contacted' && status !== 'closed' && (
            <button
              onClick={() => move('contacted')}
              disabled={busy}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-black/20 hover:bg-black/5 disabled:opacity-50"
            >
              Mark contacted
            </button>
          )}
          {status !== 'new' && (
            <button
              onClick={() => move('new')}
              disabled={busy}
              className="px-3 py-1.5 text-sm rounded-lg border border-black/10 text-househaven-text/60 hover:bg-black/5 disabled:opacity-50"
            >
              Reopen
            </button>
          )}
        </div>
      </div>

      {lead.reasons && (
        <p className="mt-3 text-xs text-househaven-text/60">Triage: {lead.reasons}</p>
      )}

      {lead.message && (
        <div className="mt-3">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-semibold underline underline-offset-2 text-househaven-text/70"
          >
            {open ? 'Hide message' : 'Show message'}
          </button>
          {open && (
            <pre className="mt-2 whitespace-pre-wrap break-words text-sm text-househaven-text bg-househaven-surface rounded-lg p-3 font-sans">
              {lead.message}
            </pre>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm font-semibold text-black">{error}</p>}
    </li>
  )
}
