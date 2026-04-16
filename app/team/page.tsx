import type { Metadata } from 'next'
import AgentCard from '@/components/team/AgentCard'
import { visibleTeam } from '@/data/team'

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    'Meet the House Haven Realty team — a boutique Nashville brokerage led by broker Stephen Delahoussaye. Our agents live, work, and serve across Middle Tennessee.',
}

export default function TeamIndexPage() {
  return (
    <main className="bg-white">
      <section className="bg-househaven-surface py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Meet House Haven
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-househaven-navy mt-3">
            The people behind
            <br />
            House Haven Realty.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-househaven-text-muted">
            A boutique team by design. Every agent you see here is someone Stephen
            personally trusts with his own family&rsquo;s biggest decisions.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {visibleTeam.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>
    </main>
  )
}
