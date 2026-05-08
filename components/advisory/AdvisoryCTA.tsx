// Reusable cross-link surface used across community pages, listing details,
// and /learn articles. Takes context props so the messaging fits the
// surrounding page without hardcoding per-page links.

import Link from 'next/link'

interface AdvisoryCTAProps {
  context?: string
  variant?: 'card' | 'inline'
  className?: string
}

export default function AdvisoryCTA({
  context,
  variant = 'card',
  className = '',
}: AdvisoryCTAProps) {
  const href = '/advisory'

  if (variant === 'inline') {
    return (
      <Link
        href={href}
        className={`inline-flex items-center text-sm font-semibold text-househaven-navy underline-offset-2 hover:underline ${className}`}
      >
        Learn about HHR Advisory →
      </Link>
    )
  }

  return (
    <div className={`rounded-xl bg-black text-white p-6 lg:p-8 ${className}`}>
      <p className="text-xs uppercase tracking-[0.2em] text-white/50">HHR Advisory</p>
      <p className="font-serif text-2xl lg:text-3xl text-white mt-2 leading-tight">
        Want a personalized read on your situation? Book a Decision Brief.
      </p>
      {context && <p className="mt-3 text-sm text-white/70">For {context}.</p>}
      <Link
        href={href}
        className="inline-flex items-center mt-6 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition"
      >
        Learn about HHR Advisory →
      </Link>
    </div>
  )
}
