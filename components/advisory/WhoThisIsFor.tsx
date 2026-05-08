// Three audience paragraphs. The /advisory page is universal — the reader
// self-identifies here rather than picking a track. Order matches Stephen's
// inbound: FSBO seller, future buyer (6–18 months out), sell-or-rent decider.

const AUDIENCES = [
  {
    label: 'Selling without an agent',
    body: 'You are listing FSBO, considering it, or already on the market and the showings are not matching the activity you expected. You want a broker who has no incentive to talk you out of it — just an honest read on price, terms, and what is actually working in your zip code right now.',
  },
  {
    label: 'A buyer six to eighteen months out',
    body: 'You are not ready to tour, and an agent who cannot earn commission for a year does not have time for you. We do — for an hour, paid up front. You leave with a roadmap, lender intros if you want them, and a personalized neighborhoods list to walk through on weekends.',
  },
  {
    label: 'Deciding sell vs. rent',
    body: 'You are moving, but the house could be a rental. Most agents nudge you toward selling because that is how they get paid. We will run the math both ways and tell you which one is actually better given your numbers, your timeline, and what the Nashville rental market looks like right now.',
  },
]

export default function WhoThisIsFor() {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Who this is for
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          One product. Three kinds of people we hear from most.
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6 lg:gap-8">
          {AUDIENCES.map((a) => (
            <div
              key={a.label}
              className="rounded-xl border border-black/10 bg-white p-6 lg:p-7"
            >
              <p className="font-serif text-xl text-househaven-navy leading-snug">{a.label}</p>
              <p className="mt-4 text-sm text-househaven-text leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-househaven-text-muted max-w-2xl leading-relaxed">
          If your situation does not fit one of these cleanly — relocation, downsizing,
          investment, divorce, inherited property — book the consult. The Decision Brief is
          designed for whichever decision you actually have.
        </p>
      </div>
    </section>
  )
}
