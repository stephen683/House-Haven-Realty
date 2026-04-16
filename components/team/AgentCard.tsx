import Image from 'next/image'
import Link from 'next/link'
import type { TeamMember } from '@/data/team'

interface AgentCardProps {
  agent: TeamMember
  compact?: boolean
}

export default function AgentCard({ agent, compact = false }: AgentCardProps) {
  return (
    <Link
      href={`/team/${agent.slug}`}
      className="group block text-center"
    >
      <div
        className={`relative mx-auto overflow-hidden rounded-lg bg-househaven-surface ${
          compact ? 'aspect-square w-40' : 'aspect-[4/5]'
        }`}
      >
        <Image
          src={agent.headshotUrl}
          alt={`${agent.name}, ${agent.title} at House Haven Realty`}
          fill
          sizes="(min-width: 1024px) 20vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-4 font-serif text-xl text-househaven-navy">
        {agent.name}
      </p>
      <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted mt-1">
        {agent.title}
      </p>
    </Link>
  )
}
