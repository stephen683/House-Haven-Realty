import {
  ADVISORY_PRICE_USD,
  ADVISORY_DURATION_LABEL,
  ADVISORY_BRIEF_TURNAROUND_LABEL,
} from '@/lib/advisory-config'

interface PricingBlockProps {
  variant?: 'default' | 'compact' | 'inline'
  className?: string
}

export default function PricingBlock({ variant = 'default', className = '' }: PricingBlockProps) {
  if (variant === 'inline') {
    return (
      <p className={`text-sm font-semibold text-househaven-navy ${className}`}>
        ${ADVISORY_PRICE_USD} pre-paid · {ADVISORY_DURATION_LABEL} consult · Brief in{' '}
        {ADVISORY_BRIEF_TURNAROUND_LABEL}
      </p>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-3 gap-4 text-center ${className}`}>
        <Cell value={`$${ADVISORY_PRICE_USD}`} label="Pre-paid" />
        <Cell value={ADVISORY_DURATION_LABEL} label="Consult" />
        <Cell value={ADVISORY_BRIEF_TURNAROUND_LABEL} label="Brief delivered" />
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border border-black/10 bg-househaven-surface p-6 lg:p-8 grid grid-cols-3 gap-6 text-center ${className}`}
    >
      <Cell value={`$${ADVISORY_PRICE_USD}`} label="Pre-paid, flat" big />
      <Cell value={ADVISORY_DURATION_LABEL} label="Consult on Google Meet" big />
      <Cell value={ADVISORY_BRIEF_TURNAROUND_LABEL} label="Written Brief delivered" big />
    </div>
  )
}

function Cell({ value, label, big = false }: { value: string; label: string; big?: boolean }) {
  return (
    <div>
      <p className={`font-serif text-househaven-navy ${big ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wider text-househaven-text-muted mt-1">
        {label}
      </p>
    </div>
  )
}
