// Recent transactions placeholder. Phase 10 ships placeholder cards flagged
// honestly until Stephen delivers the real anonymized recent closings.
// Status: 'placeholder' renders the placeholder banner; once Stephen swaps
// to 'real', the bottom-line text shows. No code change required to publish.

interface Transaction {
  label: string
  body: string
  status: 'placeholder' | 'real'
}

const TRANSACTIONS: Transaction[] = [
  {
    label: 'The Nations · 4-bed · Sold',
    body: 'Listed at $625K, sold within 11 days at $605K after a re-shoot and a $30K price calibration. Anonymized recent listing.',
    status: 'placeholder',
  },
  {
    label: 'Sylvan Park · First-time buyer · Closed',
    body: 'Pre-approved at $475K, closed on a renovated bungalow at $462K with $8K seller concessions. Cash-to-close came in $4K under the worksheet. Anonymized recent buyer.',
    status: 'placeholder',
  },
  {
    label: 'East Nashville · Investment · Sell-or-rent decision',
    body: 'Inherited duplex at 2.875%, modeled three scenarios in a Decision Brief, kept and rented. Door Collectors is now managing it. Anonymized recent Advisory client.',
    status: 'placeholder',
  },
]

export default function RecentTransactions() {
  const placeholdersOnly = TRANSACTIONS.every((t) => t.status === 'placeholder')

  return (
    <section className="bg-white py-20 lg:py-24 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Recent transactions
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          A few of the most recent.
        </h2>
        {placeholdersOnly && (
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
            Anonymized · representative of recent work · published cases coming
          </p>
        )}

        <div className="mt-10 grid md:grid-cols-3 gap-5 lg:gap-6">
          {TRANSACTIONS.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-black/10 bg-white p-6 lg:p-7"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                Recent transaction
              </p>
              <p className="font-serif text-xl text-househaven-navy mt-2 leading-snug">
                {t.label}
              </p>
              <p className="mt-3 text-sm text-househaven-text leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
