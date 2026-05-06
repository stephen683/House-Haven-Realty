import Link from 'next/link'
import type { Metadata } from 'next'
import { isAgentAuthed } from '@/lib/agent-auth'
import AgentLoginForm from '@/components/forms/AgentLoginForm'
import AgentNav from '@/components/agents/AgentNav'

export const metadata: Metadata = {
  title: 'Agent portal — House Haven Realty',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AgentsPage() {
  const authed = await isAgentAuthed()

  if (!authed) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-white">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-househaven-text mb-2">Agent portal</h1>
          <p className="text-sm text-househaven-text/70 mb-8">
            House Haven Realty agents only. Enter the shared portal password to continue.
          </p>
          <AgentLoginForm />
        </div>
      </main>
    )
  }

  // Authed: chooser. Stephen picks contract or advisory.
  return (
    <main className="min-h-screen bg-househaven-surface">
      <AgentNav active="contract" />
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-12">
        <h1 className="font-serif text-3xl text-househaven-navy">Agent portal</h1>
        <p className="mt-2 text-sm text-househaven-text-muted">
          You are signed in. Pick a tool.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link
            href="/agents/contract"
            className="block rounded-xl bg-white border border-black/10 p-6 hover:border-black/30 hover:shadow-lg transition"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
              Contracts
            </p>
            <p className="font-serif text-xl text-househaven-navy mt-2">Submit a contract</p>
            <p className="mt-3 text-sm text-househaven-text-muted">
              Send a deal to Stephen and Maria. Notifies via Resend, persists to Supabase.
            </p>
          </Link>

          <Link
            href="/agents/advisory"
            className="block rounded-xl bg-white border border-black/10 p-6 hover:border-black/30 hover:shadow-lg transition"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
              Advisory
            </p>
            <p className="font-serif text-xl text-househaven-navy mt-2">Advisory bookings</p>
            <p className="mt-3 text-sm text-househaven-text-muted">
              View upcoming consults, deliver Decision Briefs, cancel bookings.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}
