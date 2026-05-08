// Advisory email templates and dispatch via lib/resend.ts. Server-side only.
// All sends go through sendEmail() which dry-runs to console when
// RESEND_API_KEY is unset — no real sends until key lands.

import { sendEmail } from '@/lib/resend'
import type { AdvisoryBookingRow } from '@/lib/advisory-bookings'

const FROM_ADVISORY = 'House Haven Advisory <advisory@househavenrealty.com>'
const FROM_ALERTS = 'House Haven Alerts <alerts@househavenrealty.com>'
const STEPHEN_EMAIL = 'stephen@househavenrealty.com'
const PRODUCT_NAME = 'Decision Brief'

function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? ''
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

export async function sendBookingConfirmation(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const subject = `Confirmed: ${PRODUCT_NAME} on ${fmtCentral(booking.slot_central)}`
  const text = `Hi ${firstName(booking.client_name)},

Confirmed: your ${PRODUCT_NAME} consult is on ${fmtCentral(booking.slot_central)} (Central Time).

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

What happens next:
1. Engagement letter coming in a separate email.
2. Reminders 48 hours and 2 hours before.
3. After our hour, your written Decision Brief arrives within 48 hours.

If anything changes, reply to this email or call (615) 624-4766.

— Stephen
House Haven Realty`
  return sendEmail({ from: FROM_ADVISORY, to: booking.client_email, subject, text })
}

export async function sendEngagementLetter(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const url = process.env.ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL ?? ''
  const subject = 'Your engagement letter — HHR Advisory'
  const text = `Hi ${firstName(booking.client_name)},

Engagement letter for your HHR Advisory consult:
${url || '[link will appear here once ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL is set]'}

This is a one-page acknowledgment that the consult is real estate consulting, paid for the advice, and not legal/financial/tax advice. Read it before our hour. If you have questions, reply to this email.

— Stephen
House Haven Realty`
  return sendEmail({ from: FROM_ADVISORY, to: booking.client_email, subject, text })
}

export async function sendReminder48h(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const text = `Hi ${firstName(booking.client_name)},

Quick reminder: your ${PRODUCT_NAME} consult is in 48 hours — ${fmtCentral(booking.slot_central)}.

A few things to come prepared:
- The 2 or 3 questions you most want answered (you wrote them on intake).
- For property-specific decisions, any property details that the public records would not show.
- For buyer questions, your latest pre-approval letter or a screenshot of your current loan calculator.

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

— Stephen`
  return sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: `Reminder: ${PRODUCT_NAME} in 48 hours`,
    text,
  })
}

export async function sendReminder2h(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const text = `Hi ${firstName(booking.client_name)},

We are on in 2 hours.

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

— Stephen`
  return sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: 'Starting in 2 hours',
    text,
  })
}

export async function sendBriefDelivery(
  booking: AdvisoryBookingRow,
  briefPdfUrl: string,
): Promise<{ ok: boolean }> {
  const text = `Hi ${firstName(booking.client_name)},

Your ${PRODUCT_NAME} is ready.

Brief: ${briefPdfUrl}

This is yours to keep, share, or hand to whoever you hire next. If anything in it raises follow-up questions, reply to this email.

— Stephen
House Haven Realty`
  return sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: `Your ${PRODUCT_NAME}`,
    text,
  })
}

// Discovery-call templates — free 15-min cold-traffic conversion call.
// Three templates per spec: confirm + 24h + 1h reminder.

export async function sendDiscoveryCallConfirmation(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const subject = `Confirmed: discovery call ${fmtCentral(booking.slot_central)}`
  const text = `Hi ${firstName(booking.client_name)},

Confirmed: your free 15-minute discovery call is on ${fmtCentral(booking.slot_central)} (Central Time).

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

What this call covers:
- The decision you are actually trying to make.
- Whether the Decision Brief is the right deliverable for it.
- What you would walk away from a paid consult with — concretely.
- If we are not the right fit, who in Nashville probably is.

There is no payment, no pitch, and no follow-up sequence. Reminders 24 hours and 1 hour before.

If anything changes, reply to this email or call (615) 624-4766.

— Stephen
House Haven Realty`
  return sendEmail({ from: FROM_ADVISORY, to: booking.client_email, subject, text })
}

export async function sendDiscoveryReminder24h(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const text = `Hi ${firstName(booking.client_name)},

Quick reminder: your discovery call is in 24 hours — ${fmtCentral(booking.slot_central)} (Central Time).

It's 15 minutes. Come with whatever decision is in front of you, in your own words. We'll tell you whether the Decision Brief is the right deliverable.

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

— Stephen`
  return sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: 'Reminder: discovery call in 24 hours',
    text,
  })
}

export async function sendDiscoveryReminder1h(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const text = `Hi ${firstName(booking.client_name)},

We are on in an hour.

Google Meet: ${booking.meet_link ?? '(in your calendar invite)'}

— Stephen`
  return sendEmail({
    from: FROM_ADVISORY,
    to: booking.client_email,
    subject: 'Starting in 1 hour',
    text,
  })
}

export async function notifyStephenOfDiscoveryCall(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const phoneLine = booking.client_phone ? ` · ${booking.client_phone}` : ''
  const intake = booking.intake_responses as Record<string, unknown>
  const text = `New discovery call booked.

Client: ${booking.client_name} <${booking.client_email}>${phoneLine}
Slot: ${fmtCentral(booking.slot_central)} (Central)
Booking ID: ${booking.id}

Intake responses:
${JSON.stringify(intake, null, 2)}

Stephen-only admin: if the call leads to a paid Brief, convert via /api/agents/advisory/${booking.id}/convert-to-paid.`
  return sendEmail({
    from: FROM_ALERTS,
    to: STEPHEN_EMAIL,
    subject: `New discovery call — ${booking.client_name}`,
    text,
  })
}

export async function notifyStephenOfNewBooking(
  booking: AdvisoryBookingRow,
): Promise<{ ok: boolean }> {
  const phoneLine = booking.client_phone ? ` · ${booking.client_phone}` : ''
  const rentcastBlock = booking.rentcast_prepull
    ? `\nRentCast pre-pull:\n${JSON.stringify(booking.rentcast_prepull, null, 2)}\n`
    : ''
  const text = `New ${PRODUCT_NAME} booking.

Client: ${booking.client_name} <${booking.client_email}>${phoneLine}
Slot: ${fmtCentral(booking.slot_central)} (Central)
Booking ID: ${booking.id}
Payment: ${booking.payment_status}

Intake responses:
${JSON.stringify(booking.intake_responses, null, 2)}
${rentcastBlock}
Stephen-only admin: write the Brief, then trigger delivery via /api/advisory/deliver-brief/${booking.id}.`
  return sendEmail({
    from: FROM_ALERTS,
    to: STEPHEN_EMAIL,
    subject: `New ${PRODUCT_NAME} booking — ${booking.client_name}`,
    text,
  })
}
