// High-level orchestration that ties booking → calendar event → emails.
// Called from two places:
//  - /api/advisory/create-intent in mock mode (Stripe key absent — skip
//    Stripe entirely and run side effects inline)
//  - /api/advisory/stripe-webhook on payment_intent.succeeded
//
// Idempotent. Each side effect has its own guard so re-running is safe.

import { ADVISORY_TRACKS } from '@/lib/advisory-config'
import { getBookingById, updateBooking } from '@/lib/advisory-bookings'
import { createEvent } from '@/lib/google-calendar'
import {
  sendBookingConfirmation,
  sendEngagementLetter,
  notifyStephenOfNewBooking,
} from '@/lib/advisory-emails'
import { sendEngagementLetterForSignature } from '@/lib/esign'

const SLOT_DURATION_MINUTES = 60
const STEPHEN_EMAIL = 'stephen@househavenrealty.com'

export async function runPostPaymentSideEffects(
  bookingId: string,
): Promise<{ ok: boolean }> {
  const booking = await getBookingById(bookingId)
  if (!booking) return { ok: false }

  // Mark payment succeeded if not already
  if (booking.payment_status !== 'succeeded') {
    await updateBooking(bookingId, { paymentStatus: 'succeeded' })
  }

  // Calendar event (idempotent: only create if we don't already have one)
  if (!booking.google_calendar_event_id && booking.slot_utc) {
    const start = new Date(booking.slot_utc)
    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60_000)
    const trackName =
      ADVISORY_TRACKS.find((t) => t.slug === booking.track)?.name ??
      'Decision Brief'
    const event = await createEvent({
      startUtc: start,
      endUtc: end,
      summary: `HHR Advisory — ${trackName} (${booking.client_name})`,
      description: `HHR Advisory consult.\n\nClient: ${booking.client_name} <${booking.client_email}>\nBooking ID: ${bookingId}`,
      attendeeEmails: [booking.client_email, STEPHEN_EMAIL],
      conferenceRequestId: `hhr-advisory-${bookingId}`,
    })
    await updateBooking(bookingId, {
      googleCalendarEventId: event.eventId,
      meetLink: event.meetLink ?? undefined,
    })
  }

  // Re-fetch with calendar fields populated for email templates
  const updated = await getBookingById(bookingId)
  if (!updated) return { ok: false }

  // Emails (guarded by engagement_letter_sent_at — set last so partial
  // failures retry the whole batch on next run)
  if (!updated.engagement_letter_sent_at) {
    await sendBookingConfirmation(updated)
    await sendEngagementLetter(updated)
    await notifyStephenOfNewBooking(updated)
    await updateBooking(bookingId, {
      engagementLetterStatus: 'sent',
      engagementLetterSentAt: new Date(),
    })

    // Try e-sign send. Falls back silently when no vendor configured —
    // sendEngagementLetter (placeholder PDF email) above remains the
    // canonical engagement-letter delivery in fallback mode.
    const trackName =
      ADVISORY_TRACKS.find((t) => t.slug === updated.track)?.name ?? 'Decision Brief'
    const templateRef =
      process.env.ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL ?? ''
    if (templateRef) {
      const esign = await sendEngagementLetterForSignature({
        bookingId,
        clientName: updated.client_name,
        clientEmail: updated.client_email,
        trackName,
        templateRef,
      })
      if (esign.signatureRequestId && esign.provider) {
        await updateBooking(bookingId, {
          esignProvider: esign.provider,
          esignSignatureRequestId: esign.signatureRequestId,
          esignSendFailedReason: null,
        })
      } else if (esign.errorReason) {
        await updateBooking(bookingId, {
          esignSendFailedReason: esign.errorReason,
        })
      }
    }
  }

  return { ok: true }
}
