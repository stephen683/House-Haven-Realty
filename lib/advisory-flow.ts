// High-level orchestration that ties booking → calendar event → emails.
// Called from two places:
//  - /api/advisory/create-intent in mock mode (Stripe key absent — skip
//    Stripe entirely and run side effects inline)
//  - /api/advisory/stripe-webhook on payment_intent.succeeded
//
// Idempotent. Each side effect has its own guard so re-running is safe.

import { getBookingById, updateBooking } from '@/lib/advisory-bookings'
import { createEvent } from '@/lib/google-calendar'
import {
  sendBookingConfirmation,
  sendEngagementLetter,
  notifyStephenOfNewBooking,
  sendDiscoveryCallConfirmation,
  notifyStephenOfDiscoveryCall,
} from '@/lib/advisory-emails'
import { sendEngagementLetterForSignature } from '@/lib/esign'
import {
  PAID_BRIEF_SLOT_CONFIG,
  DISCOVERY_CALL_SLOT_CONFIG,
} from '@/lib/advisory-config'

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
    const end = new Date(
      start.getTime() + PAID_BRIEF_SLOT_CONFIG.durationMinutes * 60_000,
    )
    const event = await createEvent({
      startUtc: start,
      endUtc: end,
      summary: `HHR Advisory — Decision Brief (${booking.client_name})`,
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
    const templateRef =
      process.env.ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL ?? ''
    if (templateRef) {
      const esign = await sendEngagementLetterForSignature({
        bookingId,
        clientName: updated.client_name,
        clientEmail: updated.client_email,
        trackName: 'Decision Brief',
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

// Discovery call has no Stripe leg — this runs synchronously after the
// booking row is created. Idempotent on calendar + emails.
export async function runPostDiscoveryBookingSideEffects(
  bookingId: string,
): Promise<{ ok: boolean }> {
  const booking = await getBookingById(bookingId)
  if (!booking || booking.booking_type !== 'discovery_call') return { ok: false }

  if (!booking.google_calendar_event_id && booking.slot_utc) {
    const start = new Date(booking.slot_utc)
    const end = new Date(
      start.getTime() + DISCOVERY_CALL_SLOT_CONFIG.durationMinutes * 60_000,
    )
    const event = await createEvent({
      startUtc: start,
      endUtc: end,
      summary: `HHR Advisory — Discovery call (${booking.client_name})`,
      description: `Free 15-min discovery call.\n\nClient: ${booking.client_name} <${booking.client_email}>\nBooking ID: ${bookingId}`,
      attendeeEmails: [booking.client_email, STEPHEN_EMAIL],
      conferenceRequestId: `hhr-discovery-${bookingId}`,
    })
    await updateBooking(bookingId, {
      googleCalendarEventId: event.eventId,
      meetLink: event.meetLink ?? undefined,
    })
  }

  // Re-fetch with calendar fields populated for email templates
  const updated = await getBookingById(bookingId)
  if (!updated) return { ok: false }

  // Idempotency guard: stamp engagement_letter_sent_at after the email batch
  // so a repeat run doesn't re-send. Discovery calls don't require an
  // engagement letter, but the column gives us a single guard for "first
  // run completed."
  if (!updated.engagement_letter_sent_at) {
    await sendDiscoveryCallConfirmation(updated)
    await notifyStephenOfDiscoveryCall(updated)
    await updateBooking(bookingId, {
      engagementLetterStatus: 'not_required',
      engagementLetterSentAt: new Date(),
    })
  }

  return { ok: true }
}
