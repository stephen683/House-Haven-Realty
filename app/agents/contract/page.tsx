import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { isAgentAuthed } from '@/lib/agent-auth'
import AgentContractForm from '@/components/forms/AgentContractForm'

export const metadata: Metadata = {
  title: 'Submit a contract — House Haven Realty',
}

export const dynamic = 'force-dynamic'

export default async function ContractSubmissionPage() {
  if (!(await isAgentAuthed())) redirect('/agents')

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <h1 className="text-3xl font-bold text-househaven-text">Submit a contract</h1>
            <Link href="/agents/leads" className="text-sm underline underline-offset-4 text-househaven-text/70">
              ← Lead queue
            </Link>
          </div>
          <p className="text-sm text-househaven-text/70">
            Notifies Stephen and Maria. Upload the executed documents to Dolly separately.
          </p>
        </header>
        <AgentContractForm />
      </div>
    </main>
  )
}
