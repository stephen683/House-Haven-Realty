// Six "why this is safe" cards. Each names a specific reason cold traffic
// should trust paying a real estate broker $200 sight unseen. Order matters:
// money-back guarantee comes first because it is the answer to the loudest
// objection ("what if it sucks").

const CARDS = [
  {
    title: "Money-back guarantee",
    body: "If you don't believe you got $200 of value, request a refund within 7 days of the consult. No questions asked, no hoops. The Decision Brief is yours to keep regardless.",
  },
  {
    title: 'No commission attached',
    body: 'Your $200 covers the hour and the Brief. It never converts into a credit, discount, or deposit on a future transaction. If you list with House Haven later, you pay full standard commission and your $200 stays $200.',
  },
  {
    title: 'A written deliverable',
    body: 'You leave with a PDF, not just a meeting. Bottom line, recommendations, framework, action items — yours to keep, share, or hand to whoever you hire next.',
  },
  {
    title: 'A real licensed broker',
    body: 'Stephen Delahoussaye is a licensed Tennessee real estate broker. House Haven Realty has closed 500+ homes and $250M+ in volume since 2016. Not a coach. Not a course. Not AI.',
  },
  {
    title: 'No CRM funnel',
    body: "We don't add you to a drip campaign after the consult. No sequence emails, no Sunday-night check-ins, no calls from a junior agent. The work is the work; when it is done, it is done.",
  },
  {
    title: 'Independence by design',
    body: "If you ask whether to list with House Haven, we'll tell you what we honestly think and recommend other brokerages to talk to. The structure of the fee is what makes that answer trustworthy.",
  },
]

export default function WhyThisIsSafe() {
  return (
    <section className="bg-househaven-surface py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          Why this is safe
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 max-w-3xl leading-tight">
          Six reasons $200 to a stranger from the internet is actually a fair trade.
        </h2>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-black/10 bg-white p-6 lg:p-7"
            >
              <p className="font-serif text-xl text-househaven-navy leading-snug">{c.title}</p>
              <p className="mt-3 text-sm text-househaven-text leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
