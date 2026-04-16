import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { teamMembers } from '@/data/team'

interface AgentPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return teamMembers.map((m) => ({ slug: m.slug }))
}

export function generateMetadata({ params }: AgentPageProps): Metadata {
  const agent = teamMembers.find((m) => m.slug === params.slug)
  if (!agent) return { title: 'Agent Not Found' }
  return {
    title: `${agent.name} · ${agent.title}`,
    description: `${agent.name}, ${agent.title} at House Haven Realty. ${agent.bio.slice(0, 140)}`,
  }
}

export default function AgentProfilePage({ params }: AgentPageProps) {
  const agent = teamMembers.find((m) => m.slug === params.slug)
  if (!agent) notFound()

  const agentSchema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `https://househavenrealty.com/team/${agent.slug}#person`,
    name: agent.name,
    jobTitle: agent.title,
    image: agent.headshotUrl,
    url: `https://househavenrealty.com/team/${agent.slug}`,
    description: agent.bio,
    worksFor: { '@id': 'https://househavenrealty.com/#organization' },
    ...(agent.email && { email: agent.email }),
    ...(agent.phone && { telephone: agent.phone }),
    areaServed: { '@type': 'City', name: 'Nashville' },
  }

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agentSchema) }}
      />
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-16 lg:py-24 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-househaven-surface">
            <Image
              src={agent.headshotUrl}
              alt={`${agent.name}, ${agent.title} at House Haven Realty`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <Link
            href="/team"
            className="text-xs uppercase tracking-[0.2em] text-househaven-accent hover:text-househaven-navy"
          >
            ← Back to team
          </Link>
          {/* TREC: agent name must not display larger than the firm name. The firm name
              in the sticky Header and Footer uses serif 2xl; this h1 is a page-local
              heading within a sub-page and is sized comparable to sitewide firm marks. */}
          <h1 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-3">
            {agent.name}
          </h1>
          <p className="text-sm uppercase tracking-[0.18em] text-househaven-text-muted mt-2">
            {agent.title} · House Haven Realty
          </p>

          <div className="mt-8 space-y-5 text-househaven-text leading-relaxed">
            <p>{agent.bio}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            {agent.phone && (
              <a
                data-event="phone_click" href={`tel:${agent.phone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center px-5 py-3 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
              >
                {agent.phone}
              </a>
            )}
            {agent.email && (
              <a
                href={`mailto:${agent.email}`}
                className="inline-flex items-center px-5 py-3 rounded-lg border border-househaven-navy/20 text-househaven-navy font-semibold hover:bg-househaven-navy hover:text-white transition"
              >
                Email {agent.name.split(' ')[0]}
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-3 rounded-lg border border-househaven-navy/20 text-househaven-navy font-semibold hover:bg-househaven-navy hover:text-white transition"
            >
              Send a message
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
