// Resend email helper. Server-side only.
// When RESEND_API_KEY is unset, logs to console and returns ok — never blocks the
// response path. Real sends kick in the moment the key is configured.

const RESEND_BASE = 'https://api.resend.com/emails'

/**
 * Whether a send would actually leave the building.
 *
 * sendEmail() deliberately returns ok:true on a dry-run so an unconfigured key
 * never blocks a lead from being saved — the right call for the form routes.
 * It is the wrong call for alerting: the canary would detect an outage, "send"
 * an alert into console.info, and stamp last_alerted_at as though a human had
 * been paged. Anything whose job is to reach a person must check this first.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export interface SendEmailInput {
  from: string
  to: string | string[]
  subject: string
  text: string
  replyTo?: string
  cc?: string | string[]
}

export async function sendEmail(input: SendEmailInput): Promise<{ ok: boolean; id: string | null }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.info('[resend] dry-run (no RESEND_API_KEY) →', input.to, '·', input.subject)
    return { ok: true, id: null }
  }
  try {
    const res = await fetch(RESEND_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: input.from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        cc: input.cc === undefined ? undefined : Array.isArray(input.cc) ? input.cc : [input.cc],
        subject: input.subject,
        text: input.text,
        reply_to: input.replyTo,
      }),
    })
    if (!res.ok) {
      console.error('[resend] non-OK', res.status, await res.text().catch(() => ''))
      return { ok: false, id: null }
    }
    const data = await res.json() as { id: string }
    return { ok: true, id: data.id }
  } catch (err) {
    console.error('[resend] send failed', err)
    return { ok: false, id: null }
  }
}
