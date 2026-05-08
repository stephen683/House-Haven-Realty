import Link from 'next/link'

// "What we built for Nashville" — the four free tools the brokerage built.
// Frames them as something the brokerage built for the city, not as a peer
// offering competing with the brokerage. Free to use; no email walls.

const TOOLS = [
  {
    name: 'Find Homes',
    body: 'Live Realtracs IDX search, every Nashville-area listing, no email gate.',
    href: '/homes-for-sale',
  },
  {
    name: 'Nashville Pipeline',
    body: 'Live new-construction permit map. See what is breaking ground six months before it lists.',
    href: '/pipeline',
  },
  {
    name: 'Home Value',
    body: 'Real AVM (RentCast). Instant home-value estimate for any Nashville-area address.',
    href: '/value',
  },
  {
    name: 'Communities',
    body: '57 Nashville-area neighborhoods, written by people who actually live here.',
    href: '/communities',
  },
]

export default function WhatWeBuilt() {
  return (
    <section className="bg-black text-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          What we built for Nashville
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl text-white mt-2 max-w-3xl leading-tight">
          Four free tools we built because our clients asked for them.
        </h2>
        <p className="mt-4 text-base lg:text-lg text-white/70 leading-relaxed max-w-2xl">
          No email wall, no account, no chatbot. Use them as much as you want, whether you ever
          hire us or not.
        </p>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col rounded-xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30 transition p-6"
            >
              <p className="font-serif text-xl text-white">{t.name}</p>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">{t.body}</p>
              <span className="mt-auto pt-6 text-sm font-semibold text-white group-hover:translate-x-1 transition">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
