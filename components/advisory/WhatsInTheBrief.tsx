import SamplePreview from './SamplePreview'

const PARTS = [
  {
    label: 'Bottom Line',
    body: 'The two- or three-sentence answer to the question you came in with. If the rest of the Brief disappeared, this is what you would still have.',
  },
  {
    label: 'Key recommendations',
    body: 'Three to five concrete actions ranked by what changes the most for you, with the reasoning behind each.',
  },
  {
    label: 'Framework',
    body: 'How to think about the decision when new information arrives. Not a prediction — a way of evaluating tradeoffs you will keep running into.',
  },
  {
    label: 'Action items',
    body: 'Numbered next steps with timing and what to ask for. Hand the list to whoever is doing the work next, including yourself.',
  },
]

export default function WhatsInTheBrief() {
  return (
    <section className="bg-black text-white py-20 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Decision Brief</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-white mt-2 max-w-3xl">
          What you walk away with.
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
          A written document, delivered as a PDF within 48 hours of the consult. Yours to keep,
          share, or hand to whoever you hire next.
        </p>

        <ol className="mt-12 grid md:grid-cols-2 gap-6 lg:gap-8">
          {PARTS.map((p, i) => (
            <li
              key={p.label}
              className="rounded-xl border border-white/15 bg-white/[0.03] p-6 lg:p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                Section {i + 1}
              </p>
              <p className="font-serif text-2xl text-white mt-2">{p.label}</p>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{p.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          <SamplePreview />
        </div>
      </div>
    </section>
  )
}
