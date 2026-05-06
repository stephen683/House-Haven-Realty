// Internal nav for the Stephen-only /agents/* portal.

import Link from 'next/link'

interface AgentNavProps {
  active: 'contract' | 'advisory'
}

export default function AgentNav({ active }: AgentNavProps) {
  return (
    <nav
      className="border-b border-black/10 bg-white"
      aria-label="Agent portal navigation"
    >
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-3 flex items-center gap-1 text-sm">
        <span className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted mr-3">
          Agent portal
        </span>
        <Link
          href="/agents/contract"
          className={`px-3 py-1.5 rounded ${
            active === 'contract'
              ? 'bg-black text-white'
              : 'text-househaven-text hover:bg-househaven-surface'
          }`}
        >
          Submit a contract
        </Link>
        <Link
          href="/agents/advisory"
          className={`px-3 py-1.5 rounded ${
            active === 'advisory'
              ? 'bg-black text-white'
              : 'text-househaven-text hover:bg-househaven-surface'
          }`}
        >
          Advisory bookings
        </Link>
      </div>
    </nav>
  )
}
