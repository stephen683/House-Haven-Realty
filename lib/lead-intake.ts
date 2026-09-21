import 'server-only'
import { createServiceClient } from './supabase/service'
import { isEmailConfigured, sendEmail } from './resend'

/**
 * The one path every public form takes from submission to Stephen's inbox.
 *
 * Before this existed each route improvised. /api/contact and /api/valuation
 * posted to Resend with a raw fetch and never read the response;
 * /api/newsletter notified nobody at all. The result was 156 leads in the
 * table and not one confirmed notification — including a double-sided deal
 * that sat unread for eight weeks.
 *
 * Three things happen here, in this order:
 *
 *   1. Save to `leads`. A failure here fails the request, because a lead we
 *      cannot store is a lead we have lost.
 *   2. Email Stephen, checking the send actually succeeded.
 *   3. Stamp `notified_at`, or `notify_error` if it did not.
 *
 * Steps 2–3 never fail the request. The lead is already saved; a mailer outage
 * must not tell a real client their enquiry was rejected. The canary reads
 * those columns instead, which is what makes a silent outage visible.
 *
 * Email is deliberately the only delivery mechanism. The CRM leg was removed
 * 2026-09-21: House Haven runs leads through Meet Corinne, not a CRM this site
 * writes to, and an integration nobody uses is an integration that fails
 * quietly. If a Corinne intake ever wants a webhook, add it here — one place.
 */

export const ALERT_FROM = 'House Haven Alerts <alerts@househavenrealty.com>'
export const ALERT_TO = 'stephen@househavenrealty.com'

export interface LeadIntake {
  formType: string
  source: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string | null
  interest?: string | null
  message?: string | null
  timeline?: string | null
  propertyAddress?: string | null
  tcpaConsent: boolean
  pageUrl?: string | null
  formData?: Record<string, unknown>
  /** Subject and body of the alert to Stephen. */
  alertSubject: string
  alertBody: string
}

export interface IntakeResult {
  saved: boolean
  leadId: string | null
  notified: boolean
  /** Why a non-fatal step did not complete, for the route log. */
  warnings: string[]
}

export async function recordLead(intake: LeadIntake): Promise<IntakeResult> {
  const warnings: string[] = []
  const now = () => new Date().toISOString()

  // 1. Save. The only step allowed to fail the request.
  let leadId: string | null = null
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('leads')
      .insert({
        first_name: intake.firstName ?? '',
        last_name: intake.lastName ?? '',
        email: intake.email,
        phone: intake.phone ?? null,
        form_type: intake.formType,
        source: intake.source,
        interest: intake.interest ?? null,
        message: intake.message ?? null,
        timeline: intake.timeline ?? null,
        property_address: intake.propertyAddress ?? null,
        tcpa_consent: intake.tcpaConsent,
        tcpa_consent_at: intake.tcpaConsent ? now() : null,
        page_url: intake.pageUrl ?? null,
        form_data: intake.formData ?? {},
      })
      .select('id')
      .single()
    if (error) throw error
    leadId = data.id as string
  } catch (err) {
    console.error(`[intake:${intake.formType}] lead insert failed`, err)
    return { saved: false, leadId: null, notified: false, warnings }
  }

  // 2 & 3. Notify, and record whether it actually went.
  let notified = false
  if (isEmailConfigured()) {
    const sent = await sendEmail({
      from: ALERT_FROM,
      to: ALERT_TO,
      replyTo: intake.email,
      subject: intake.alertSubject,
      text: intake.alertBody,
    })
    notified = sent.ok
    await stamp(
      leadId,
      sent.ok
        ? { notified_at: now(), notify_error: null }
        : { notify_error: 'resend rejected the send' },
    )
    if (!sent.ok) warnings.push('notification email was not accepted by Resend')
  } else {
    warnings.push('RESEND_API_KEY unset — nobody was notified of this lead')
    await stamp(leadId, { notify_error: 'RESEND_API_KEY unset' })
  }

  if (warnings.length) {
    console.error(`[intake:${intake.formType}] lead ${leadId} —`, warnings.join('; '))
  }
  return { saved: true, leadId, notified, warnings }
}

/** Best-effort column update. Never throws: the lead is already saved. */
async function stamp(leadId: string, patch: Record<string, string | null>): Promise<void> {
  try {
    const supabase = createServiceClient()
    await supabase.from('leads').update(patch).eq('id', leadId)
  } catch (err) {
    console.error('[intake] stamp failed', err)
  }
}
