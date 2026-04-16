import type { Metadata } from 'next'
import Image from 'next/image'
import AgentCard from '@/components/team/AgentCard'
import { visibleTeam } from '@/data/team'

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    'Meet the House Haven Realty team — a boutique Nashville brokerage led by broker Stephen Delahoussaye. Our agents live, work, and serve across Middle Tennessee.',
  alternates: { canonical: '/team' },
}

export default function TeamIndexPage() {
  return (
    <main className="bg-white">
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Meet House Haven &middot; {visibleTeam.length} agents
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3">
            The people behind
            <br />
            House Haven Realty.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
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
