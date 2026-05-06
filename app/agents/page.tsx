import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { isAgentAuthed } from '@/lib/agent-auth'
import AgentLoginForm from '@/components/forms/AgentLoginForm'

export const metadata: Metadata = {
  title: 'Agent portal — House Haven Realty',
}

export const dynamic = 'force-dynamic'

export default async function AgentsPage() {
  if (await isAgentAuthed()) redirect('/agents/contract')

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
