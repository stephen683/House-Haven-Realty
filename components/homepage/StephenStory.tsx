// Stephen's story — text-only broker note. Slightly longer than the prior
// FromStephen so the homepage actually has the broker's voice on it once.
// The Phase 10 brief calls this section "Stephen's story." A Nashville
// office or neighborhood photo could slot in here later — until then,
// typography-only ships clean and reads as a broker note, not a stock-photo
// set piece.

export default function StephenStory() {
  return (
    <section className="bg-househaven-surface py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          From the broker
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-househaven-navy mt-3 leading-snug">
          Stephen Delahoussaye. Broker, owner, the person you talk to first.
        </h2>

        <div className="mt-8 space-y-5 text-base lg:text-lg text-househaven-text leading-relaxed">
          <p>
            I started House Haven Realty in 2016 because the brokerages I had worked at all
            felt the same — wide funnels, transaction-counters, agents who knew their
            commission better than they knew their clients. I wanted a small office, repeat
            clients, and a way to be the broker I would have wanted when I bought my first
            house.
          </p>
          <p>
            We are eleven agents now, working out of a Centennial Boulevard office in The
            Nations. We have closed more than 500 homes since the doors opened — buyers,
            sellers, relocations, FSBO conversions, sell-or-rent calls, new construction,
            investment property. Every one of them got Stephen on the phone before anyone
            else.
          </p>
          <p>
            If you are buying or selling in Nashville, or you are six months out and just want
            to talk through how this works, that is the call to make.
          </p>
        </div>

        <a
          data-event="phone_click"
          href="tel:+16156244766"
          className="inline-flex mt-10 font-serif text-3xl text-househaven-navy hover:underline"
        >
          (615) 624-4766
        </a>

        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
          Stephen Delahoussaye · Broker | Owner · House Haven Realty
        </p>
      </div>
    </section>
  )
}
