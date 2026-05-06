const STEPS = [
  {
    n: '1',
    title: 'Pick a track and complete intake.',
    body: 'FSBO Sanity-Check, Buyer Roadmap, or Sell-or-Rent. The intake is short — under five minutes — and it tells me what you actually want to walk away with.',
  },
  {
    n: '2',
    title: 'Pre-pay $200.',
    body: 'Stripe checkout, in-page. The fee is for the advice, not for a transaction. It is never credited against future commission if you later decide to list with us.',
  },
  {
    n: '3',
    title: 'One hour on Google Meet.',
    body: 'Tuesday or Thursday, Central Time. The link is in your calendar invite. Bring your spouse, your business partner, your notebook — whoever needs to be in the room.',
  },
  {
    n: '4',
    title: 'Written Decision Brief in 48 hours.',
    body: 'A PDF in your inbox: bottom line, recommendations, framework, and the action items you asked for. Yours to keep, share, or hand to whoever you hire next.',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 lg:py-24 border-t border-black/5">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">How it works</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">
          Four steps. No hidden gates.
        </h2>

        <ol className="mt-10 grid md:grid-cols-2 gap-8 lg:gap-10">
          {STEPS.map((s) => (
            <li key={s.n} className="flex gap-5">
              <div className="shrink-0 h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center font-serif text-base">
                {s.n}
              </div>
              <div>
                <p className="font-serif text-xl text-househaven-navy leading-snug">{s.title}</p>
                <p className="mt-2 text-sm text-househaven-text-muted leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
