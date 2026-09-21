// Submission screening for every public form.
//
// The site ran from April to September with no spam defence of any kind — no
// honeypot, no timing check, no rate limit, no content rules. 156 submissions
// reached the leads table and 97% were automated. Three genuine buyers were
// buried in it, one of them a listing-plus-purchase that sat unread for eight
// weeks.
//
// Every threshold here is calibrated against that corpus rather than guessed,
// because a false positive costs a real client. Where a rule could not be made
// safe against the real leads, it downgrades to a signal instead of a block.

export interface SubmissionCandidate {
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  name?: string | null
  message?: string | null
  /** Hidden field. Any value means a machine filled the form. */
  honeypot?: string | null
  /** Epoch ms the form was rendered, echoed back by the client. */
  formLoadedAt?: number | null
}

export type Screen =
  | { spam: false; signals: string[] }
  | { spam: true; rule: string; detail: string }

/** A human does not complete and submit a form faster than this. */
export const MIN_FILL_MS = 2500
/**
 * Gmail local-part dots. Measured over all 156 submissions: 0–1 dots covers
 * real clients (lauren.kane05), 2 was already bot-only, and every one of the
 * 95 submissions at 3+ dots was automated. 3 is the conservative line.
 */
export const MAX_GMAIL_DOTS = 2

const GIBBERISH_MIN_LEN = 12
const GIBBERISH_MAX_VOWEL_RATIO = 0.3
const MAX_LINKS = 2

function vowelRatio(s: string): number {
  if (!s.length) return 1
  return (s.match(/[aeiou]/gi)?.length ?? 0) / s.length
}

/** Gmail ignores dots and +tags; this is the address that actually receives. */
export function canonicalEmail(raw: string): string {
  const email = raw.trim().toLowerCase()
  const at = email.lastIndexOf('@')
  if (at < 1) return email
  let local = email.slice(0, at)
  const domain = email.slice(at + 1)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0].replace(/\./g, '')
    return `${local}@gmail.com`
  }
  return `${local.split('+')[0]}@${domain}`
}

function gmailDots(email: string): number {
  const [local, domain] = email.toLowerCase().split('@')
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') return 0
  return (local.match(/\./g) ?? []).length
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|us|eu)\b/gi) ?? []).length
}

/**
 * Screens one submission. Returns spam:true only on rules with no observed
 * false positives; weaker indicators come back as signals for triage.
 */
export function screenSubmission(c: SubmissionCandidate): Screen {
  const signals: string[] = []

  // 1. Honeypot. Nothing legitimate ever fills a field humans cannot see.
  if (typeof c.honeypot === 'string' && c.honeypot.trim() !== '') {
    return { spam: true, rule: 'honeypot', detail: 'hidden field was filled' }
  }

  // 2. Fill time. Bots post the instant the DOM is ready.
  if (typeof c.formLoadedAt === 'number' && Number.isFinite(c.formLoadedAt)) {
    const elapsed = Date.now() - c.formLoadedAt
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return { spam: true, rule: 'too_fast', detail: `submitted ${elapsed}ms after load` }
    }
    if (elapsed < 0) signals.push('clock_skew')
  }

  // 3. Gmail dot-stuffing — the single largest source in the corpus.
  const email = c.email?.trim() ?? ''
  if (email) {
    const dots = gmailDots(email)
    if (dots > MAX_GMAIL_DOTS) {
      return { spam: true, rule: 'gmail_dot_stuffing', detail: `${dots} dots in the gmail local part` }
    }
    if (dots === MAX_GMAIL_DOTS) signals.push('gmail_dots_borderline')
  }

  // 4. Keyboard-mash names. Long, and almost no vowels. Guarded by length so
  //    short real names are never in scope.
  const first = (c.firstName ?? c.name ?? '').trim()
  if (first.length >= GIBBERISH_MIN_LEN && /^[A-Za-z]+$/.test(first)) {
    const vr = vowelRatio(first)
    if (vr < GIBBERISH_MAX_VOWEL_RATIO) {
      return { spam: true, rule: 'gibberish_name', detail: `"${first.slice(0, 24)}" vowel ratio ${vr.toFixed(2)}` }
    }
  }

  // 5. Link-stuffed messages are pitches, not enquiries.
  const message = c.message ?? ''
  if (message) {
    const links = countLinks(message)
    if (links > MAX_LINKS) {
      return { spam: true, rule: 'link_stuffing', detail: `${links} links in the message` }
    }
    if (links > 0) signals.push('contains_link')
  }

  // 6. A missing surname was bot-only in the corpus, but the forms differ in
  //    whether they ask for one — a signal, never a block.
  if (c.firstName !== undefined && !(c.lastName ?? '').trim()) signals.push('no_surname')

  return { spam: false, signals }
}
