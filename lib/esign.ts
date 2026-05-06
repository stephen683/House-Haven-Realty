// Vendor-agnostic e-sign abstraction. Server-side only.
//
// Stephen picks HelloSign or DocuSign and sets ESIGN_VENDOR + the matching
// API key in Vercel env. Until then, sendEngagementLetterForSignature()
// returns a no-op result and the booking flow falls back to the existing
// placeholder PDF email path (lib/advisory-emails.ts:sendEngagementLetter).
//
// Webhook handling lives at /api/advisory/esign-webhook — it parses both
// HelloSign and DocuSign event shapes and updates the booking row when a
// signature is completed.

const HELLOSIGN_API_BASE = 'https://api.hellosign.com/v3'
// Production DocuSign base is account-specific; e.g.
// https://na3.docusign.net/restapi. For Phase 6 we assume na3 — Stephen
// adjusts via DOCUSIGN_BASE_URL env when activating.
const DOCUSIGN_DEFAULT_BASE = 'https://na3.docusign.net/restapi'

export type ESignVendor = 'hellosign' | 'docusign'

export interface ESignSendInput {
  bookingId: string
  clientName: string
  clientEmail: string
  trackName: string
  // Filename or URL of the engagement letter PDF Stephen wants signed.
  // For HelloSign, pass a URL. For DocuSign, the integration must reference
  // a stored template; the vendor implementation will adapt.
  templateRef: string
}

export interface ESignSendResult {
  signatureRequestId: string | null
  provider: ESignVendor | null
  source: 'live' | 'mock' | 'fallback'
  errorReason?: string
}

function getVendor(): ESignVendor | null {
  const v = process.env.ESIGN_VENDOR?.toLowerCase()
  if (v === 'hellosign' || v === 'docusign') return v
  return null
}

function isLive(vendor: ESignVendor): boolean {
  if (vendor === 'hellosign') return Boolean(process.env.HELLOSIGN_API_KEY)
  if (vendor === 'docusign')
    return Boolean(
      process.env.DOCUSIGN_API_KEY &&
        process.env.DOCUSIGN_ACCOUNT_ID &&
        (process.env.DOCUSIGN_TEMPLATE_ID || process.env.ADVISORY_ENGAGEMENT_LETTER_TEMPLATE_URL),
    )
  return false
}

export function isESignLive(): boolean {
  const vendor = getVendor()
  if (!vendor) return false
  return isLive(vendor)
}

// HelloSign: signature_request/send_with_template OR send (file URL)
async function sendViaHelloSign(input: ESignSendInput): Promise<ESignSendResult> {
  const apiKey = process.env.HELLOSIGN_API_KEY
  if (!apiKey) {
    return { signatureRequestId: null, provider: 'hellosign', source: 'fallback' }
  }
  try {
    const auth = Buffer.from(`${apiKey}:`).toString('base64')
    const form = new URLSearchParams()
    form.append('title', `HHR Advisory engagement — ${input.trackName}`)
    form.append('subject', 'Your HHR Advisory engagement letter')
    form.append(
      'message',
      `Hi ${input.clientName.split(/\s+/)[0]} — please sign the engagement letter before our consult. Reply if anything is unclear.\n\n— Stephen`,
    )
    form.append('signers[0][email_address]', input.clientEmail)
    form.append('signers[0][name]', input.clientName)
    form.append('file_url[0]', input.templateRef)
    form.append('test_mode', process.env.HELLOSIGN_TEST_MODE === 'true' ? '1' : '0')
    form.append('metadata[booking_id]', input.bookingId)

    const res = await fetch(`${HELLOSIGN_API_BASE}/signature_request/send`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[esign:hellosign] send failed', res.status, body)
      return {
        signatureRequestId: null,
        provider: 'hellosign',
        source: 'fallback',
        errorReason: `hellosign_${res.status}`,
      }
    }
    const data = (await res.json()) as {
      signature_request?: { signature_request_id?: string }
    }
    const id = data.signature_request?.signature_request_id ?? null
    return {
      signatureRequestId: id,
      provider: 'hellosign',
      source: id ? 'live' : 'fallback',
    }
  } catch (err) {
    console.error('[esign:hellosign] threw', err)
    return {
      signatureRequestId: null,
      provider: 'hellosign',
      source: 'fallback',
      errorReason: 'hellosign_threw',
    }
  }
}

async function sendViaDocuSign(input: ESignSendInput): Promise<ESignSendResult> {
  const apiKey = process.env.DOCUSIGN_API_KEY
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID
  const templateId = process.env.DOCUSIGN_TEMPLATE_ID
  const baseUrl = process.env.DOCUSIGN_BASE_URL ?? DOCUSIGN_DEFAULT_BASE

  if (!apiKey || !accountId || !templateId) {
    return { signatureRequestId: null, provider: 'docusign', source: 'fallback' }
  }
  try {
    const res = await fetch(`${baseUrl}/v2.1/accounts/${accountId}/envelopes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailSubject: `HHR Advisory engagement — ${input.trackName}`,
        templateId,
        templateRoles: [
          {
            email: input.clientEmail,
            name: input.clientName,
            roleName: 'signer',
          },
        ],
        status: 'sent',
        customFields: {
          textCustomFields: [{ name: 'booking_id', value: input.bookingId }],
        },
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.error('[esign:docusign] send failed', res.status, body)
      return {
        signatureRequestId: null,
        provider: 'docusign',
        source: 'fallback',
        errorReason: `docusign_${res.status}`,
      }
    }
    const data = (await res.json()) as { envelopeId?: string }
    return {
      signatureRequestId: data.envelopeId ?? null,
      provider: 'docusign',
      source: data.envelopeId ? 'live' : 'fallback',
    }
  } catch (err) {
    console.error('[esign:docusign] threw', err)
    return {
      signatureRequestId: null,
      provider: 'docusign',
      source: 'fallback',
      errorReason: 'docusign_threw',
    }
  }
}

export async function sendEngagementLetterForSignature(
  input: ESignSendInput,
): Promise<ESignSendResult> {
  const vendor = getVendor()
  if (!vendor) {
    return { signatureRequestId: null, provider: null, source: 'fallback' }
  }
  if (vendor === 'hellosign') return sendViaHelloSign(input)
  return sendViaDocuSign(input)
}

// Webhook payload parsing — used by /api/advisory/esign-webhook to update
// engagement_letter_status. Returns booking_id + signed status, or null
// if the event isn't a recognized signature-completed event.

export interface ESignSignedEvent {
  bookingId: string
  signatureRequestId: string | null
  vendor: ESignVendor
}

export function parseHelloSignEvent(
  rawPayload: string,
): ESignSignedEvent | null {
  try {
    const data = JSON.parse(rawPayload) as {
      event?: { event_type?: string }
      signature_request?: {
        signature_request_id?: string
        metadata?: { booking_id?: string }
      }
    }
    if (data.event?.event_type !== 'signature_request_all_signed') return null
    const sr = data.signature_request
    const bookingId = sr?.metadata?.booking_id
    if (!bookingId) return null
    return {
      bookingId,
      signatureRequestId: sr?.signature_request_id ?? null,
      vendor: 'hellosign',
    }
  } catch {
    return null
  }
}

export function parseDocuSignEvent(
  rawPayload: string,
): ESignSignedEvent | null {
  try {
    const data = JSON.parse(rawPayload) as {
      event?: string
      data?: {
        envelopeId?: string
        envelopeSummary?: {
          envelopeId?: string
          status?: string
          customFields?: {
            textCustomFields?: Array<{ name?: string; value?: string }>
          }
        }
      }
    }
    if (data.event !== 'envelope-completed') return null
    const summary = data.data?.envelopeSummary
    if (summary?.status !== 'completed') return null
    const bookingField = summary.customFields?.textCustomFields?.find(
      (f) => f.name === 'booking_id',
    )
    const bookingId = bookingField?.value
    if (!bookingId) return null
    return {
      bookingId,
      signatureRequestId: data.data?.envelopeId ?? summary.envelopeId ?? null,
      vendor: 'docusign',
    }
  } catch {
    return null
  }
}
