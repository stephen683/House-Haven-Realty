import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookingById, type AdvisoryBookingRow } from '@/lib/advisory-bookings'
import AdvisoryDisclosure from '@/components/advisory/Disclosure'

const PRODUCT_NAME = 'Decision Brief'

export const metadata: Metadata = {
  title: 'Booked — HHR Advisory',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: { id?: string; payment_intent?: string; redirect_status?: string }
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

function externalCalendarLinks(
  booking: AdvisoryBookingRow,
): { google: string | null; outlook: string | null } {
  if (!booking.slot_utc) return { google: null, outlook: null }
  const start = new Date(booking.slot_utc)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const fmtUtc = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const title = encodeURIComponent(`HHR Advisory — ${PRODUCT_NAME}`)
  const details = encodeURIComponent(
    `Decision Brief consult.${booking.meet_link ? ` Google Meet: ${booking.meet_link}` : ''}`,
  )
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmtUtc(start)}/${fmtUtc(end)}&details=${details}`
  const outlook = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&path=/calendar/action/compose&rru=addevent`
  return { google, outlook }
}

export default async function ConfirmationPage({ searchParams }: PageProps) {
  const id = searchParams.id
  if (!id) notFound()

  const booking = await getBookingById(id)
  if (!booking) notFound()

  const { google, outlook } = externalCalendarLinks(booking)

  // Stripe redirects with payment_intent + redirect_status. If status is not
  // 'succeeded' the payment may still be processing or have failed; we show
  // a soft message rather than the booked confirmation.
  const stripeStatus = searchParams.redirect_status
  const isPending = stripeStatus && stripeStatus !== 'succeeded'

  if (isPending) {
    return (
      <main>
        <section className="bg-black text-white py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 lg:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Payment in progress
            </p>
            <h1 className="font-serif text-3xl lg:text-5xl text-white mt-3 leading-[1.1]">
              We are confirming your payment.
            </h1>
            <p className="mt-6 text-base lg:text-lg text-white/70 leading-relaxed">
              Your booking will appear here as soon as Stripe confirms the charge — usually
              within a few seconds. Refresh in a moment, or check your email for the
              confirmation.
            </p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      <section className="bg-black text-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Booked</p>
          <h1 className="font-serif text-3xl lg:text-5xl text-white mt-3 leading-[1.1]">
            You are booked for {fmtCentral(booking.slot_central ?? booking.slot_utc)}.
          </h1>
          <p className="mt-6 text-base lg:text-lg text-white/70 leading-relaxed">
            Engagement letter and calendar invite are landing in your inbox in the next few
            minutes. Decision Brief arrives within 48 hours of the consult.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6">
          <h2 className="font-serif text-2xl text-househaven-navy">
            Add it to your calendar.
          </h2>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={`/api/advisory/booking/${booking.id}/ics`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-househaven-navy-light"
            >
              Download .ics
            </a>
            {google && (
              <a
                href={google}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-househaven-navy hover:bg-househaven-surface"
              >
                Add to Google Calendar
              </a>
            )}
            {outlook && (
              <a
                href={outlook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-black/10 text-sm font-semibold text-househaven-navy hover:bg-househaven-surface"
              >
                Add to Outlook
              </a>
            )}
          </div>

          <h2 className="font-serif text-2xl text-househaven-navy mt-12">What to expect.</h2>
          <ul className="mt-4 space-y-3 text-sm text-househaven-text leading-relaxed list-disc pl-5">
            <li>One hour on Google Meet — link is in the calendar invite.</li>
            <li>Engagement letter arrives separately. Read it before the consult.</li>
            <li>Reminders 48 hours and 2 hours before our hour.</li>
            <li>Written Decision Brief arrives within 48 hours after the consult.</li>
          </ul>

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
