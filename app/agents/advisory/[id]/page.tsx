import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { isAgentAuthed } from '@/lib/agent-auth'
import { getBookingById } from '@/lib/advisory-bookings'
import AgentNav from '@/components/agents/AgentNav'
import DeliverBriefForm from './DeliverBriefForm'
import CancelBookingForm from './CancelBookingForm'
import ConvertToPaidForm from './ConvertToPaidForm'

export const metadata: Metadata = {
  title: 'Booking detail — Advisory admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

interface PageProps {
  params: { id: string }
}

function fmtCentral(iso: string | null): string {
  if (!iso) return '—'
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

export default async function AdvisoryBookingDetail({ params }: PageProps) {
  if (!(await isAgentAuthed())) redirect('/agents')

  const booking = await getBookingById(params.id)
  if (!booking) notFound()

  const typeLabel =
    booking.booking_type === 'discovery_call' ? 'Discovery call' : 'Paid Decision Brief'

  const intake = booking.intake_responses as Record<string, unknown>
  const rentcast = booking.rentcast_prepull as Record<string, unknown> | null

  return (
    <main className="min-h-screen bg-househaven-surface">
      <AgentNav active="advisory" />

      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
        <Link
          href="/agents/advisory"
          className="text-xs text-househaven-text-muted hover:text-househaven-navy"
        >
          ← All bookings
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-househaven-text-muted">
            {typeLabel}
          </p>
          <h1 className="font-serif text-3xl text-househaven-navy mt-1">
            {booking.client_name}
          </h1>
          <p className="mt-2 text-sm text-househaven-text-muted">
            {fmtCentral(booking.slot_central ?? booking.slot_utc)}
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column: status + actions */}
          <div className="lg:col-span-1 space-y-4">
            <Card title="Status">
              <Row label="Payment" value={booking.payment_status} />
              <Row label="Brief" value={booking.brief_status.replace('_', ' ')} />
              <Row
                label="Engagement letter"
                value={booking.engagement_letter_status.replace('_', ' ')}
              />
              {booking.canceled_at && (
                <Row
                  label="Canceled"
                  value={new Date(booking.canceled_at).toLocaleString('en-US')}
                />
              )}
            </Card>

            <Card title="Contact">
              <Row label="Email" value={booking.client_email} />
              {booking.client_phone && <Row label="Phone" value={booking.client_phone} />}
            </Card>

            {(booking.meet_link || booking.google_calendar_event_id) && (
              <Card title="Calendar">
                {booking.meet_link && (
                  <a
                    href={booking.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-househaven-navy hover:underline truncate"
                  >
                    {booking.meet_link}
                  </a>
                )}
                {booking.google_calendar_event_id && (
                  <p className="text-[11px] text-househaven-text-muted mt-2">
                    Event ID: {booking.google_calendar_event_id}
                  </p>
                )}
              </Card>
            )}

            {booking.stripe_payment_intent_id && (
              <Card title="Stripe">
                <p className="text-[11px] text-househaven-text-muted break-all">
                  Intent: {booking.stripe_payment_intent_id}
                </p>
                {booking.stripe_charge_id && (
                  <p className="text-[11px] text-househaven-text-muted break-all mt-1">
                    Charge: {booking.stripe_charge_id}
                  </p>
                )}
              </Card>
            )}

            {booking.esign_signature_request_id && (
              <Card title="E-sign">
                <Row label="Provider" value={booking.esign_provider ?? '—'} />
                <p className="text-[11px] text-househaven-text-muted break-all mt-2">
                  Request: {booking.esign_signature_request_id}
                </p>
              </Card>
            )}
          </div>

          {/* Middle + right: intake + actions */}
          <div className="lg:col-span-2 space-y-4">
            <Card title="Intake responses">
              <pre className="text-xs text-househaven-text leading-relaxed whitespace-pre-wrap break-all">
                {JSON.stringify(intake, null, 2)}
              </pre>
            </Card>

            {rentcast && (
              <Card title="RentCast prepull (for Stephen's prep)">
                <pre className="text-xs text-househaven-text leading-relaxed whitespace-pre-wrap break-all">
                  {JSON.stringify(rentcast, null, 2)}
                </pre>
              </Card>
            )}

            {booking.admin_notes && (
              <Card title="Admin notes">
                <p className="text-sm text-househaven-text whitespace-pre-line">
                  {booking.admin_notes}
                </p>
              </Card>
            )}

            {!booking.canceled_at && (
              <>
                {booking.booking_type === 'paid_brief' && (
                  <Card title={`Deliver Decision Brief${booking.brief_status === 'delivered' ? ' (already delivered)' : ''}`}>
                    <DeliverBriefForm
                      bookingId={booking.id}
                      alreadyDelivered={booking.brief_status === 'delivered'}
                    />
                  </Card>
                )}

                {booking.booking_type === 'discovery_call' && (
                  <Card title="Convert to paid Decision Brief">
                    <ConvertToPaidForm bookingId={booking.id} />
                  </Card>
                )}

                <Card title="Cancel booking">
                  <CancelBookingForm bookingId={booking.id} />
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg bg-white border border-black/10 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-househaven-text-muted mb-3">
        {title}
      </p>
      {children}
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm border-b border-black/5 last:border-0">
      <span className="text-househaven-text-muted">{label}</span>
      <span className="text-househaven-navy font-medium truncate text-right">{value}</span>
    </div>
  )
}
