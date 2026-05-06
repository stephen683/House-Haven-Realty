// Track-page "honest data" block. Names the structural conflict for each track
// directly, with citation when the track page provides it.

interface HonestFramingProps {
  eyebrow: string
  headline: string
  body: string
  source?: string
}

export default function HonestFraming({ eyebrow, headline, body, source }: HonestFramingProps) {
  return (
    <section className="bg-white py-16 lg:py-20 border-t border-black/5">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">{eyebrow}</p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-2 leading-tight">
          {headline}
        </h2>
        <p className="mt-6 text-base lg:text-lg text-househaven-text leading-relaxed">{body}</p>
        {source && (
          <p className="mt-4 text-xs text-househaven-text-muted italic">{source}</p>
        )}
      </div>
    </section>
  )
}
