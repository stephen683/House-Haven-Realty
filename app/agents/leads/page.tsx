import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { isAgentAuthed } from '@/lib/agent-auth'
import { loadQueue, queueCounts, isQueueView, QUEUE_VIEWS, type QueueLead, type QueueView } from '@/lib/leads-queue'
import LeadQueue from '@/components/agents/LeadQueue'
import { teamMembers } from '@/data/team'

export const metadata: Metadata = {
  title: 'Lead queue — House Haven Realty',
}

export const dynamic = 'force-dynamic'

export default async function LeadQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  if (!(await isAgentAuthed())) redirect('/agents')

  const params = await searchParams
  const view: QueueView = isQueueView(params.view) ? params.view : 'unworked'

  let leads: QueueLead[] = []
  let counts: Record<QueueView, number> | null = null
  let error: string | null = null
  try {
    ;[leads, counts] = await Promise.all([loadQueue(view), queueCounts()])
  } catch (err) {
    error = err instanceof Error ? err.message : 'Could not load the queue.'
  }

  const agents = teamMembers.map((t) => t.name).sort((a, b) => a.localeCompare(b))

  return (
    <main className="min-h-screen bg-white px-4 lg:px-6 py-10 lg:py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="text-3xl font-bold text-househaven-text">Lead queue</h1>
            <Link
              href="/agents/contract"
              className="text-sm underline underline-offset-4 text-househaven-text/70"
            >
              Submit a contract →
            </Link>
          </div>
          <p className="mt-2 text-sm text-househaven-text/70 max-w-2xl">
            Every website enquiry, best first. Claim one and it shows as yours to the rest
            of the team. Leads from before 21 September have no triage score — they were
            never scored, and are shown rather than hidden.
          </p>
        </header>

        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Queue views">
          {QUEUE_VIEWS.map((v) => {
            const active = v.key === view
            return (
              <Link
                key={v.key}
                href={`/agents/leads?view=${v.key}`}
                aria-current={active ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'border-black/15 text-househaven-text/70 hover:bg-black/5'
                }`}
              >
                {v.label}
                {counts && (
                  <span className={active ? 'text-white/60' : 'text-househaven-text/40'}>
                    {' '}
                    {counts[v.key]}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {error ? (
          <p className="text-sm font-semibold text-black border border-black/20 rounded-xl p-4">
            Could not load the queue: {error}. Call (615) 624-4766 if this persists.
          </p>
        ) : (
          <LeadQueue leads={leads} agents={agents} />
        )}
      </div>
    </main>
  )
}
