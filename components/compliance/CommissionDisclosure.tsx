// NAR settlement (effective Aug 17 2024) — verbatim conspicuous disclosure for any
// seller-facing surface that discusses representation. Same wording sitewide.

interface CommissionDisclosureProps {
  variant?: 'inline' | 'card'
  className?: string
}

export default function CommissionDisclosure({
  variant = 'inline',
  className = '',
}: CommissionDisclosureProps) {
  if (variant === 'card') {
    return (
      <div
        className={`rounded-lg border border-black/10 bg-househaven-surface px-4 py-3 ${className}`}
        role="note"
        aria-label="Broker commission disclosure"
      >
        <p className="text-sm font-semibold text-househaven-navy">
          Broker commissions are not set by law and are fully negotiable.
        </p>
      </div>
    )
  }

  return (
    <p
      className={`text-sm font-semibold text-househaven-navy ${className}`}
      role="note"
      aria-label="Broker commission disclosure"
    >
      Broker commissions are not set by law and are fully negotiable.
    </p>
  )
}
