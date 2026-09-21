'use client'

import { useEffect, useState } from 'react'
import LeadRow from './LeadRow'
import type { QueueLead } from '@/lib/leads-queue'

const AGENT_KEY = 'hh_queue_agent'

/**
 * The queue's working identity.
 *
 * The portal password is shared across the whole team, so there is no session
 * to read a name from. The agent picks themselves once and it is remembered in
 * this browser; the server still validates the name against data/team.ts, so
 * this is a convenience, never the authorisation.
 */
export default function LeadQueue({ leads, agents }: { leads: QueueLead[]; agents: string[] }) {
  const [agent, setAgent] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AGENT_KEY)
      if (saved && agents.includes(saved)) setAgent(saved)
    } catch {
      // Private windows and blocked site data both throw; the picker just
      // starts empty, which is correct rather than broken.
    }
  }, [agents])

  function choose(name: string) {
    setAgent(name)
    try {
      localStorage.setItem(AGENT_KEY, name)
    } catch {
      // Not remembering the name is survivable; claiming still works.
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-househaven-surface">
        <label htmlFor="queue-agent" className="text-sm font-semibold text-househaven-text">
          I&rsquo;m
        </label>
        <select
          id="queue-agent"
          value={agent}
          onChange={(e) => choose(e.target.value)}
          className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm"
        >
          <option value="">Pick your name…</option>
          {agents.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <span className="text-xs text-househaven-text/60">
          Remembered on this device. Needed to claim a lead.
        </span>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-househaven-text/60 py-8">Nothing here.</p>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} agent={agent} />
          ))}
        </ul>
      )}
    </div>
  )
}
