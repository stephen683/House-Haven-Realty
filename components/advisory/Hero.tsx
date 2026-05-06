interface AdvisoryHeroProps {
  eyebrow: string
  headline: string
  lede: string
}

export default function AdvisoryHero({ eyebrow, headline, lede }: AdvisoryHeroProps) {
  return (
    <section className="bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{eyebrow}</p>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mt-3 leading-[1.05]">
          {headline}
        </h1>
        <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-3xl leading-relaxed">{lede}</p>
      </div>
    </section>
  )
}
