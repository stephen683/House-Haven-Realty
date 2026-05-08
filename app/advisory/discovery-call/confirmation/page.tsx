import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookingById } from '@/lib/advisory-bookings'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'

export const metadata: Metadata = {
  title: 'Discovery call booked — HHR Advisory',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { id?: string }
}

function fmtCentral(iso: string | null): string {
  if (!iso) return 'TBD'
  return new Date(iso).toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

export default async function DiscoveryConfirmationPage({ searchParams }: PageProps) {
  const id = searchParams.id
  if (!id) notFound()

  const booking = await getBookingById(id)
  if (!booking || booking.booking_type !== 'discovery_call') notFound()

  return (
    <main>
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Discovery call booked</p>
          <h1 className="font-serif text-3xl lg:text-5xl text-white mt-3 leading-[1.1]">
            See you {fmtCentral(booking.slot_central ?? booking.slot_utc)}.
          </h1>
          <p className="mt-6 text-base lg:text-lg text-white/70 leading-relaxed">
            Calendar invite is landing in your inbox in the next few minutes. Reminders 24 hours
            and 1 hour before. The Google Meet link is in the invite.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="font-serif text-2xl text-househaven-navy">What to expect.</h2>
          <ul className="mt-4 space-y-3 text-sm text-househaven-text leading-relaxed list-disc pl-5">
            <li>Fifteen minutes on Google Meet — Central Time.</li>
            <li>You describe the decision you are trying to make, in your own words.</li>
            <li>We tell you whether the Decision Brief is the right deliverable.</li>
            <li>If it is not, we tell you what is, and where to go next.</li>
          </ul>

          <div className="mt-12 rounded-xl border border-black/10 bg-househaven-surface p-6 lg:p-7">
            <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted">
              Already know you want the full Brief?
            </p>
            <p className="font-serif text-2xl text-househaven-navy mt-2 leading-snug">
              Skip the call.
            </p>
            <p className="mt-3 text-sm text-househaven-text leading-relaxed">
              You can book the paid Decision Brief consult directly. If you do that today,
              respond to the calendar invite for the discovery call to cancel it.
            </p>
            <Link
              href="/advisory/book"
              className="inline-flex items-center mt-6 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light"
            >
              Book a Decision Brief →
            </Link>
          </div>

          <div className="mt-12">
            <AdvisoryDisclosure />
          </div>

          <div className="mt-8 text-sm text-househaven-text-muted">
            Need to cancel or reschedule? Email{' '}
            <a href="mailto:stephen@househavenrealty.com" className="underline">
              stephen@househavenrealty.com
            </a>{' '}
            or call{' '}
            <Link href="tel:+16156244766" className="underline">
              (615) 624-4766
            </Link>
            .
          </div>
        </div>
      </section>
    </main>
  )
}
