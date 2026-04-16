import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { teamMembers } from '@/data/team'

export const metadata: Metadata = {
  title: 'About House Haven Realty',
  description:
    'House Haven Realty is a boutique Nashville brokerage founded by broker Stephen Delahoussaye. 219+ closed sales, $124M+ in volume, and a family-first approach to real estate across Middle Tennessee.',
}

const stats = [
  { value: '219+', label: 'Homes closed' },
  { value: '$124.2M+', label: 'Total volume' },
  { value: '$150K – $5.3M', label: 'Price range' },
  { value: 'Since 2016', label: 'Licensed in TN' },
]

export default function AboutPage() {
  const stephen = teamMembers.find((m) => m.slug === 'stephen-delahoussaye')!

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative bg-househaven-navy text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=2400&q=70"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-househaven-navy/50 via-househaven-navy/75 to-househaven-navy" />
        <div className="relative max-w-5xl mx-auto px-4 lg:px-6 py-24 lg:py-32 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            About us
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl text-white mt-3 leading-tight">
            A small boutique brokerage
            <br />
            with Nashville in its bones.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white/70">
            House Haven Realty was built to feel less like a transaction and more like a
            neighbor walking you home. That was true on day one, and it&rsquo;s still the
            blueprint today.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-4 lg:px-6 py-20 lg:py-28 space-y-8 text-lg leading-relaxed text-househaven-text">
        <p>
          House Haven Realty is a small boutique local Nashville real estate brokerage. We
          help our community find and sell their dream homes, but we are so much more than
          that. Our brokerage is small and local and has no plans to grow out of that. We
          are a family, centered upon helping each other as agents and growing together.
        </p>
        <p>
          We volunteer once a month in our communities and never lose focus on the city
          that we love and strive to make better every day. Our clients walk away feeling
          more like friends or family rather than a transaction, and that&rsquo;s not
          something we&rsquo;re willing to outgrow.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-househaven-navy text-white py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-serif text-4xl lg:text-5xl text-white">{s.value}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/60">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stephen bio */}
      <section className="max-w-6xl mx-auto px-4 lg:px-6 py-20 lg:py-28 grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-househaven-surface">
            <Image
              src={stephen.headshotUrl}
              alt={`${stephen.name}, Broker and Owner of House Haven Realty`}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
            Broker &amp; Owner
          </p>
          <h2 className="font-serif text-4xl lg:text-5xl text-househaven-navy mt-2">
            Stephen Delahoussaye
          </h2>
          <div className="mt-6 space-y-5 text-househaven-text leading-relaxed">
            <p>
              My story is one of discovery. I started out pursuing a career in Physical
              Therapy because of my passion for health and wellness. But while attending
              the University of Tennessee at Chattanooga, I interned at Vanderbilt Bone and
              Joint Clinic and soon discovered it wasn&rsquo;t necessarily the science I
              was passionate about, but more so the people.
            </p>
            <p>
              This connection with people and the ability to add value in any way possible
              is what actually brought me to real estate. House Haven Realty is the
              brokerage I built around that idea — where every client walks away feeling
              more like a friend or family member than a transaction.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-househaven-accent/30 bg-househaven-surface p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-househaven-accent">
              Initiative
            </p>
            <p className="font-serif text-2xl text-househaven-navy mt-2">
              Rent Less, Own More!
            </p>
            <p className="mt-3 text-househaven-text leading-relaxed">
              In 2019, Stephen created an exciting initiative called{' '}
              <em>Rent Less, Own More!</em> with the goal of empowering first-time home
              buyers with the right tools and knowledge to make the home buying process
              smooth, simple and fun.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/team"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-househaven-navy text-white font-semibold hover:bg-househaven-navy-light transition"
            >
              Meet the team
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-househaven-navy/20 text-househaven-navy font-semibold hover:bg-househaven-navy hover:text-white transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
