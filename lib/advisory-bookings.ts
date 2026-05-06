// Booking CRUD on Supabase. Source-of-truth for paid Decision Brief
// bookings. Supabase is always the source of truth; Stripe + Calendar
// failures never drop a booking.

import { createClient } from '@/lib/supabase/server'
import type { AdvisoryTrackSlug } from '@/lib/advisory-config'

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type EngagementStatus = 'not_sent' | 'sent' | 'signed' | 'not_required'
export type BriefStatus = 'not_started' | 'drafted' | 'delivered'

export interface AdvisoryBookingRow {
  id: string
  created_at: string
  updated_at: string
  track: AdvisoryTrackSlug
  client_name: string
  client_email: string
  client_phone: string | null
  intake_responses: Record<string, unknown>
  rentcast_prepull: Record<string, unknown> | null
  amount_cents: number
  payment_status: PaymentStatus
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  slot_utc: string | null
  slot_central: string | null
  google_calendar_event_id: string | null
  meet_link: string | null
  engagement_letter_status: EngagementStatus
  engagement_letter_sent_at: string | null
  engagement_letter_signed_at: string | null
  brief_status: BriefStatus
  brief_delivered_at: string | null
  reminder_48h_sent_at: string | null
  reminder_2h_sent_at: string | null
  canceled_at: string | null
  cancellation_reason: string | null
  admin_notes: string | null
}

export interface CreateBookingInput {
  track: AdvisoryTrackSlug
  clientName: string
  clientEmail: string
  clientPhone?: string
  intakeResponses: Record<string, unknown>
  rentcastPrepull?: Record<string, unknown> | null
  slotUtc: Date
  slotCentral: Date
  amountCents?: number
}

export async function createBooking(
  input: CreateBookingInput,
): Promise<AdvisoryBookingRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('advisory_bookings')
    .insert({
      track: input.track,
      client_name: input.clientName,
      client_email: input.clientEmail.trim().toLowerCase(),
      client_phone: input.clientPhone ?? null,
      intake_responses: input.intakeResponses,
      rentcast_prepull: input.rentcastPrepull ?? null,
      amount_cents: input.amountCents ?? 20000,
      slot_utc: input.slotUtc.toISOString(),
      slot_central: input.slotCentral.toISOString(),
    })
    .select()
    .single()
  if (error) {
    console.error('[advisory-bookings] create failed', error.message)
    return null
  }
  return data as AdvisoryBookingRow
}

export async function getBookingById(id: string): Promise<AdvisoryBookingRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('advisory_bookings')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as AdvisoryBookingRow
}

export async function getBookingByPaymentIntent(
  intentId: string,
): Promise<AdvisoryBookingRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('advisory_bookings')
    .select('*')
    .eq('stripe_payment_intent_id', intentId)
    .single()
  if (error) return null
  return data as AdvisoryBookingRow
}

export interface UpdateBookingInput {
  paymentStatus?: PaymentStatus
  stripePaymentIntentId?: string
  stripeChargeId?: string
  googleCalendarEventId?: string
  meetLink?: string
  engagementLetterStatus?: EngagementStatus
  engagementLetterSentAt?: Date
  engagementLetterSignedAt?: Date
  briefStatus?: BriefStatus
  briefDeliveredAt?: Date
  reminder48hSentAt?: Date
  reminder2hSentAt?: Date
  canceledAt?: Date
  cancellationReason?: string
  adminNotes?: string
}

function toDb(input: UpdateBookingInput): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (input.paymentStatus !== undefined) out.payment_status = input.paymentStatus
  if (input.stripePaymentIntentId !== undefined)
    out.stripe_payment_intent_id = input.stripePaymentIntentId
  if (input.stripeChargeId !== undefined) out.stripe_charge_id = input.stripeChargeId
  if (input.googleCalendarEventId !== undefined)
    out.google_calendar_event_id = input.googleCalendarEventId
  if (input.meetLink !== undefined) out.meet_link = input.meetLink
  if (input.engagementLetterStatus !== undefined)
    out.engagement_letter_status = input.engagementLetterStatus
  if (input.engagementLetterSentAt !== undefined)
    out.engagement_letter_sent_at = input.engagementLetterSentAt.toISOString()
  if (input.engagementLetterSignedAt !== undefined)
    out.engagement_letter_signed_at = input.engagementLetterSignedAt.toISOString()
  if (input.briefStatus !== undefined) out.brief_status = input.briefStatus
  if (input.briefDeliveredAt !== undefined)
    out.brief_delivered_at = input.briefDeliveredAt.toISOString()
  if (input.reminder48hSentAt !== undefined)
    out.reminder_48h_sent_at = input.reminder48hSentAt.toISOString()
  if (input.reminder2hSentAt !== undefined)
    out.reminder_2h_sent_at = input.reminder2hSentAt.toISOString()
  if (input.canceledAt !== undefined) out.canceled_at = input.canceledAt.toISOString()
  if (input.cancellationReason !== undefined)
    out.cancellation_reason = input.cancellationReason
  if (input.adminNotes !== undefined) out.admin_notes = input.adminNotes
  return out
}

export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('advisory_bookings')
    .update(toDb(input))
    .eq('id', id)
  if (error) {
    console.error('[advisory-bookings] update failed', error.message)
    return false
  }
  return true
}

// Bookings within `windowHours` of their start that haven't yet had the
// reminder fired. The cron driver picks 48h or 2h based on which timestamp
// column is null.
export async function listBookingsForReminderWindow(
  windowHours: 48 | 2,
): Promise<AdvisoryBookingRow[]> {
  const supabase = await createClient()
  const now = Date.now()
  // Look in a range that brackets the target window with a one-hour
  // tolerance, so a 15-min cron at the right time will catch it.
  const lowerMin = now + (windowHours - 0.5) * 3600 * 1000
  const upperMax = now + (windowHours + 0.5) * 3600 * 1000
  const sentColumn = windowHours === 48 ? 'reminder_48h_sent_at' : 'reminder_2h_sent_at'

  const { data, error } = await supabase
    .from('advisory_bookings')
    .select('*')
    .eq('payment_status', 'succeeded')
    .is('canceled_at', null)
    .is(sentColumn, null)
    .gt('slot_utc', new Date(lowerMin).toISOString())
    .lt('slot_utc', new Date(upperMax).toISOString())

  if (error) {
    console.error('[advisory-bookings] list-reminder-window failed', error.message)
    return []
  }
  return (data ?? []) as AdvisoryBookingRow[]
}
