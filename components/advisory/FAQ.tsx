export interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  items: FAQItem[]
  heading?: string
  eyebrow?: string
}

export default function FAQ({ items, heading = 'Questions we get a lot.', eyebrow = 'FAQ' }: FAQProps) {
  return (
    <section className="bg-househaven-surface py-20 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">{eyebrow}</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2">{heading}</h2>

        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {items.map((item, i) => (
            <details key={i} className="group py-5">
              <summary className="flex justify-between items-start gap-6 cursor-pointer list-none">
                <span className="font-serif text-lg lg:text-xl text-househaven-navy leading-snug">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 mt-1 text-househaven-text-muted text-2xl leading-none group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-househaven-text leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
