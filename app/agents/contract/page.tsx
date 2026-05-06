import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { isAgentAuthed } from '@/lib/agent-auth'
import AgentContractForm from '@/components/forms/AgentContractForm'
import AgentNav from '@/components/agents/AgentNav'

export const metadata: Metadata = {
  title: 'Submit a contract — House Haven Realty',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function ContractSubmissionPage() {
  if (!(await isAgentAuthed())) redirect('/agents')

  return (
    <main className="min-h-screen bg-white">
      <AgentNav active="contract" />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-househaven-text mb-2">Submit a contract</h1>
          <p className="text-sm text-househaven-text/70">
            Notifies Stephen and Maria. Upload the executed documents to Dolly separately.
          </p>
        </header>
        <AgentContractForm />
      </div>
    </main>
  )
}
