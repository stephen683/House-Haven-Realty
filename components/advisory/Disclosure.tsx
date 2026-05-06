import { getAdvisoryDisclosure } from '@/lib/advisory-config'

interface DisclosureProps {
  className?: string
}

export default function AdvisoryDisclosure({ className = '' }: DisclosureProps) {
  const text = getAdvisoryDisclosure()
  return (
    <div
      className={`rounded-lg border border-black/10 bg-white p-5 text-xs text-househaven-text-muted leading-relaxed ${className}`}
      role="note"
      aria-label="HHR Advisory disclosure"
    >
      {text}
    </div>
  )
}
