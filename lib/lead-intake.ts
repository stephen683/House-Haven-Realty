import 'server-only'
import { createServiceClient } from './supabase/service'
import { isHubSpotConfigured, upsertContact } from './hubspot'
import { isEmailConfigured, sendEmail } from './resend'

/**
 * The one path every public form takes from submission to Stephen's phone.
 *
 * Before this existed each route improvised. /api/contact and /api/valuation
 * posted to Resend with a raw fetch and never read the response; /api/newsletter
 * notified nobody at all; only two of the nine routes called HubSpot. The result
 * was 156 leads in the table, none in the CRM, none ever marked anything but
 * 'new' — including a double-sided deal that sat unread for eight weeks.
 *
 * Four things happen here, in this order, and each records whether it worked:
 *
 *   1. Save to `leads`. A failure here fails the request, because a lead we
 *      cannot store is a lead we have lost.
 *   2. Upsert into HubSpot and stamp `synced_to_crm_at`.
 *   3. Email Stephen, checking the send actually succeeded.
 *   4. Stamp `notified_at`, or `notify_error` if it did not.
 *
 * Steps 2–4 never fail the request. The lead is already saved; a CRM or mailer
 * outage must not tell a real client their enquiry was rejected. The canary
 * watches those columns instead, which is what makes a silent outage visible.
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
  /** `house_haven_source` on the HubSpot contact. */
  hubspotSource: string
  /** Optional HubSpot note, as HTML. */
  noteHtml?: string
}

export interface IntakeResult {
  saved: boolean
  leadId: string | null
  hubspotId: string | null
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
    return { saved: false, leadId: null, hubspotId: null, notified: false, warnings }
  }

  // 2. CRM.
  let hubspotId: string | null = null
  if (isHubSpotConfigured()) {
    hubspotId = await upsertContact({
      email: intake.email,
      firstName: intake.firstName,
      lastName: intake.lastName,
      phone: intake.phone || undefined,
      source: intake.hubspotSource,
      timeline: intake.timeline ?? null,
      noteHtml: intake.noteHtml,
    })
    if (hubspotId) {
      await stamp(leadId, { hubspot_contact_id: hubspotId, synced_to_crm_at: now() })
    } else {
      warnings.push('hubspot upsert returned no contact id')
    }
  } else {
    warnings.push('HUBSPOT_PRIVATE_APP_TOKEN unset — lead saved but not in the CRM')
  }

  // 3 & 4. Notify, and record whether it actually went.
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
  return { saved: true, leadId, hubspotId, notified, warnings }
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
