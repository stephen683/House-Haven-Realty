// Recent client examples. Phase 8 ships placeholder paragraphs marked as
// such; Stephen replaces them with real anonymized cases when he writes
// them. Status flag drives the disclosure label so we never appear to
// publish fabricated cases as real.

interface Example {
  label: string
  body: string
  status: 'placeholder' | 'real'
}

const EXAMPLES: Example[] = [
  {
    label: 'FSBO seller in The Nations',
    body: 'Listed at $625K, three weeks on market, zero offers. We ran fresh comps, identified two listing-photo issues that were killing showings, and recommended a $30K price drop with a re-shoot rather than a full price relaunch. Sold within 11 days at $605K.',
    status: 'placeholder',
  },
  {
    label: 'Buyer roadmap, twelve months out',
    body: 'Pre-approved at $475K, wanted Sylvan Park or East Nashville, working remote so location flexibility was high. We mapped a sequence: stay where they were renting six months longer to grow the down payment, target October–December for lower competition, and three alternative neighborhoods where the price-per-square-foot math was better. Brief is in their saved files; they reference it on every Zillow scroll.',
    status: 'placeholder',
  },
  {
    label: 'Sell-or-rent in East Nashville',
    body: 'Inherited duplex, 2.875% mortgage, considering selling vs. converting to rental. We modeled cash-flow under three scenarios, factored in the mortgage rate they would lose, the tax exposure on a future sale, and Nashville short-term-rental rules. The math said keep and rent. They did.',
    status: 'placeholder',
  },
]

export default function RecentExamples() {
  const placeholdersOnly = EXAMPLES.every((e) => e.status === 'placeholder')

  return (
    <section className="bg-white py-20 lg:py-24 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Recent examples
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          What a Decision Brief actually looks like in practice.
        </h2>

        {placeholdersOnly && (
          <p className="mt-4 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
            Anonymized examples · representative of real consults · published cases coming
          </p>
        )}

        <ol className="mt-10 space-y-6 lg:space-y-7">
          {EXAMPLES.map((e) => (
            <li
              key={e.label}
              className="rounded-xl border border-black/10 bg-white p-6 lg:p-7"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
                Example
              </p>
              <p className="font-serif text-xl text-househaven-navy mt-1.5 leading-snug">
                {e.label}
              </p>
              <p className="mt-3 text-sm text-househaven-text leading-relaxed">{e.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
