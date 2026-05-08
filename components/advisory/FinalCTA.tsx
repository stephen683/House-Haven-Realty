import Link from 'next/link'

// Final CTA block at the bottom of /advisory. Primary path is the free
// 15-min discovery call (the cold-traffic conversion mechanism). Secondary
// is a direct purchase of the Decision Brief for visitors who don't need
// the call first.

interface FinalCTAProps {
  discoveryHref?: string
  bookHref?: string
}

export default function FinalCTA({
  discoveryHref = '/advisory/discovery-call',
  bookHref = '/advisory/book',
}: FinalCTAProps) {
  return (
    <section className="bg-black text-white py-20 lg:py-24">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">Two ways to start</p>
        <h2 className="font-serif text-3xl lg:text-5xl text-white mt-3 leading-[1.1]">
          Talk first, decide after.
        </h2>
        <p className="mt-6 text-base lg:text-lg text-white/70 leading-relaxed">
          Most people start with a free 15-minute call. Tell us what is in front of you, and we
          tell you whether the Decision Brief actually fits your situation. If it does not, we
          will say so.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={discoveryHref}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-lg bg-white text-black font-semibold hover:bg-househaven-accent transition text-base"
          >
            Book a free 15-min discovery call →
          </Link>
          <Link
            href={bookHref}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/[0.07] transition text-base"
          >
            Skip the call — book a Decision Brief →
          </Link>
        </div>

        <p className="mt-8 text-xs text-white/50">
          Discovery call is 15 minutes, free, no payment required. Decision Brief is $200 flat,
          pre-paid, written and delivered within 48 hours.
        </p>
      </div>
    </section>
  )
}
