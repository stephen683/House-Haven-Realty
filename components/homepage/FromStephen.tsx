// Text-only "From Stephen" section per Phase 0 decision: no Stephen-on-camera
// imagery, no Stephen-CDN headshot, no commissioned photo until the shoot
// Stephen scheduled lands. The brief allows a Nashville office or
// neighborhood photo here, but no such image is in the codebase as of
// Phase 3 — text-only ships clean and the section reads as a broker note,
// not a stock-photo set piece.

export default function FromStephen() {
  return (
    <section className="bg-househaven-surface py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-househaven-text-muted">
          From the broker
        </p>
        <p className="font-serif text-2xl lg:text-3xl text-househaven-navy mt-3 leading-snug">
          We changed the model because the consumers we wanted to serve asked for it.
        </p>
        <div className="mt-6 space-y-4 text-base text-househaven-text leading-relaxed">
          <p>
            The brokerage is what we have always been — 500+ closed transactions and $250M+ in
            volume since 2016. The Advisory is what is new, and we added it because too many
            people came to us already wanting to do most of the work themselves and just
            needing one honest hour. We did not have a way to take their money for that hour.
            Now we do.
          </p>
          <p>
            If you want to talk through your situation before you decide which path fits, call
            me directly.
          </p>
        </div>

        <a
          data-event="phone_click"
          href="tel:+16156244766"
          className="inline-flex mt-8 font-serif text-3xl text-househaven-navy hover:underline"
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
