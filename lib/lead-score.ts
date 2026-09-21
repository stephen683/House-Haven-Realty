import { communities } from '@/data/communities'
import { PIPELINE_ZIPS } from './pipeline-zips'

/**
 * Triage for submissions that survive the spam guard.
 *
 * The guard is binary and deliberately conservative: it blocks only patterns
 * with no observed false positives. What it cannot touch is the other half of
 * the corpus — B2B pitches and offshore "realtor bait", both well-formed prose
 * that no content heuristic separates from a real enquiry on style alone.
 *
 * The corpus does separate them, on two signals that were perfect across all
 * 156 submissions:
 *
 *   1. **Local specificity.** All three real clients named a real place — The
 *      Nations, 12 South, Spring Hill. Not one bait message named anywhere.
 *   2. **Form shape.** All three used the structured search form. Essentially
 *      all bait came through free text.
 *
 * Note what is deliberately *not* a signal: an out-of-state phone number. All
 * three real clients had one (734 Michigan, 303 Colorado, 203 Connecticut).
 * Relocating buyers are a third of the target market — penalising them would
 * throw away the Thompsons persona entirely.
 *
 * Scoring never silently discards. Only an explicit negative classifier can
 * route a submission away from the inbox, because a filed real client costs a
 * commission and a filed bot costs nothing.
 */

export type LeadBand = 'inbox' | 'review' | 'file'

export interface LeadScoreInput {
  message?: string | null
  /** The form's `source`; 'home_search' is the structured search form. */
  source?: string | null
  email?: string | null
  formType?: string | null
  /** Structured fields the search form collects, when present. */
  budget?: string | null
  beds?: string | null
  timeline?: string | null
}

export interface LeadScore {
  score: number
  band: LeadBand
  /** Human-readable, in the order they were applied. Goes in the alert. */
  reasons: string[]
  /** Nashville places the message named, if any. */
  places: string[]
}

/** Metro place names that are not also the name of a larger US city. */
const AMBIGUOUS = new Set([
  'charlotte', 'madison', 'franklin', 'portland', 'springfield', 'lebanon',
  'dickson', 'burns', 'brentwood', 'hermitage', 'gallatin', 'watertown',
])

/**
 * Aliases and sub-neighbourhoods the community directory does not carry as
 * their own entries, plus the shorthand real clients actually typed ("12 S").
 */
const EXTRA_PLACES = [
  'the nations', 'sylvan park', 'belle meade', 'music row', 'midtown',
  'downtown nashville', 'east nashville', 'west nashville', 'north nashville',
  'south nashville', 'charlotte pike', 'shelby park', 'five points',
  'hillsboro', 'edgehill', 'west end', 'davidson county', 'williamson county',
  'sumner county', 'rutherford county', 'wilson county', 'robertson county',
  '12 s', '8th ave', 'woodbine', 'crieve hall', 'oak hill', 'forest hills',
]

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Every place name the site already knows about, lowercased. */
function buildVocabulary(): { strong: string[]; ambiguous: string[]; zips: Set<string> } {
  const strong = new Set<string>(EXTRA_PLACES)
  const ambiguous = new Set<string>()
  const zips = new Set<string>()

  const add = (raw: string) => {
    for (const part of raw.split('/')) {
      const name = normalize(part)
      if (name.length < 3) continue
      if (AMBIGUOUS.has(name)) ambiguous.add(name)
      else strong.add(name)
    }
  }

  for (const c of communities) {
    add(c.name)
    for (const z of c.zips) zips.add(z)
  }
  for (const z of PIPELINE_ZIPS) {
    add(z.name)
    add(z.area)
    zips.add(z.zip)
  }
  // Longest first so "east nashville" wins over "nashville".
  const byLength = (a: string, b: string) => b.length - a.length
  return {
    strong: Array.from(strong).sort(byLength),
    ambiguous: Array.from(ambiguous).sort(byLength),
    zips,
  }
}

const VOCAB = buildVocabulary()

export function findPlaces(text: string): { strong: string[]; ambiguous: string[]; zips: string[] } {
  const hay = ` ${normalize(text)} `
  const hit = (name: string) => hay.includes(` ${name} `)
  return {
    strong: VOCAB.strong.filter(hit),
    ambiguous: VOCAB.ambiguous.filter(hit),
    zips: (text.match(/\b3[57]\d{3}\b/g) ?? []).filter((z) => VOCAB.zips.has(z)),
  }
}

/** Typographic apostrophes are common in pasted pitch templates. */
function flatten(text: string): string {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
}

/** Someone selling something to the brokerage, not buying a house. */
const SOLICITATION = [
  /\bvirtual assistant/i,
  /\bwe (?:offer|provide|specialize|built|turn|help)\b/i,
  /\bour (?:services|platform|team|company|tool|system)\b/i,
  /\b(?:i|we) (?:do|help|handle) (?:seo|local businesses|businesses|companies)\b/i,
  /\bi(?:'m| am) [A-Z]?\w+[,]? (?:reaching out )?(?:with|from|at) [A-Z]/,
  /\bi represent [A-Z]/,
  /\b(?:i|we) own [A-Z][\w']*(?:\s+[A-Z][\w']*)*\s*,?\s*(?:LLC|Inc|Group|Co\b)/,
  /\bwe'd love the opportunity\b/i,
  /\bwould like the opportunity to discuss\b/i,
  /\bi tried (?:emailing|to find) you\b/i,
  /\bno obligation\b/i,
  /\bquick quote\b/i,
  /\bbook (?:a|some) (?:call|meeting)/i,
  /\bfree trial\b/i,
  /\blooked up (?:your website|\S+\.com)\b/i,
  /\bnot coming up for the searches\b/i,
  /\bprice and catalogue\b/i,
  /\bkindly send us\b/i,
  /\bdirector of (?:sales|marketing)\b/i,
  /\bwhite[\s-]?label(?:ed|led)?\b/i,
  /\bautomates? (?:website )?form submissions\b/i,
  /\breplaces? a \d+[\s-]?(?:man|person) team\b/i,
]

/**
 * A fabricated buyer whose real goal is a referral agreement or a phish.
 *
 * Every one of these in the corpus shares three properties, and needs all
 * three before it is filed: it names nowhere in Middle Tennessee, it describes
 * the property in catalogue language, and it pushes a way to be contacted.
 * Drop any one and a real client could be caught — Christina McPherson's
 * "looking to connect with you as I find the right home" names nowhere and is
 * generic, but asks for nothing, and goes to review rather than the bin.
 */
const WHATSAPP = /\bwhats\s?app\b/i
const GENERIC_PROPERTY = [
  /\bsingle[\s-]family (?:home|residence|house)\b/i,
  /\b(?:family|perfect|right|dream) home\b/i,
  /\b(?:experienced|licensed|professional) (?:realtor|real estate (?:agent|professional|broker))\b/i,
  /\bhigh[\s-]quality .{0,20}residence\b/i,
]
const CONTACT_DIRECTIVE = [
  /(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
  /\bkindly\b/i,
  /\b(?:text|call|reach|contact) (?:me|us)\b/i,
  /\bshare (?:any |your )?(?:available )?(?:propert|listing|detail|information)/i,
  /\bcould share\b/i,
  /\bappreciate your (?:professional )?(?:assistance|guidance|expertise|help)\b/i,
]
/** Middle Tennessee area codes. A local number is evidence of a local person. */
const LOCAL_PHONE = /\b(?:\+?1[\s.-]?)?\(?(?:615|629|931)\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/

export function classify(message: string): 'solicitation' | 'bait' | null {
  const text = flatten(message)
  if (SOLICITATION.some((re) => re.test(text))) return 'solicitation'
  if (WHATSAPP.test(text)) return 'bait'

  // A local phone number is the one thing that vetoes the bait rules: whoever
  // is on a 615 line is not running an offshore referral farm.
  if (LOCAL_PHONE.test(text)) return null

  const places = findPlaces(text)
  const named = places.strong.length + places.zips.length > 0
  if (named) return null

  const generic = GENERIC_PROPERTY.some((re) => re.test(text))
  const directive = CONTACT_DIRECTIVE.some((re) => re.test(text))
  if (generic && directive) return 'bait'
  return null
}

const STRUCTURED_SOURCES = new Set(['home_search', 'pipeline_alert', 'nashbuilds_alert'])

/**
 * Keyboard mash in a field that should hold a place name.
 *
 * Using the structured form is not by itself evidence of a person: 27 of the
 * 30 historical `home_search` submissions were bots filling every field with
 * consonant soup ("VYSoobpnlxmFyXBnkvcKLhEP"). The spam guard catches almost
 * all of them upstream on the email address, but one got through on a single
 * Gmail dot — and it would have scored 71 and reached the inbox on the
 * structured-form bonus alone. The bonus has to be earned, not assumed.
 *
 * Length and the single-token requirement keep every real place out of scope:
 * the longest one-word names the site knows are Murfreesboro (0.42),
 * Goodlettsville and Hendersonville (0.36), all far above the threshold.
 */
const GIBBERISH_MIN_LEN = 12
const GIBBERISH_MAX_VOWEL_RATIO = 0.3

export function looksLikeGibberish(value: string): boolean {
  const v = value.trim()
  if (v.length < GIBBERISH_MIN_LEN) return false
  if (!/^[A-Za-z]+$/.test(v)) return false
  const vowels = (v.match(/[aeiou]/gi) ?? []).length
  return vowels / v.length < GIBBERISH_MAX_VOWEL_RATIO
}

/** The value of a `Label: value` line in the structured form's message. */
function structuredField(message: string, label: string): string {
  const re = new RegExp(`^\\s*${label}:\\s*(.+)$`, 'im')
  return message.match(re)?.[1]?.trim() ?? ''
}

export function scoreLead(input: LeadScoreInput): LeadScore {
  const message = (input.message ?? '').trim()
  const reasons: string[] = []
  let score = 30 // neutral starting point: unknown, not suspect

  const places = findPlaces(`${message} ${input.budget ?? ''}`)
  const named = [...places.strong, ...places.zips]
  if (named.length > 0) {
    score += 40
    reasons.push(`names ${named.slice(0, 3).join(', ')}`)
  } else if (places.ambiguous.length > 0) {
    score += 12
    reasons.push(`mentions ${places.ambiguous[0]} (also a city elsewhere)`)
  }

  const areas = structuredField(message, 'Areas')
  const gibberish =
    looksLikeGibberish(areas) ||
    looksLikeGibberish(structuredField(message, 'Budget')) ||
    looksLikeGibberish(input.budget ?? '')

  if (gibberish) {
    // Machine-filled. Never reward the form bonus, and never reach the inbox.
    score = 5
    reasons.length = 0
    reasons.push('structured fields contain keyboard mash')
    return { score, band: 'file', reasons, places: [] }
  }

  if (STRUCTURED_SOURCES.has(input.source ?? '')) {
    score += 25
    reasons.push('used the structured form')
  }

  if (input.budget) { score += 8; reasons.push('gave a budget') }
  if (input.beds) { score += 4 }
  if (input.timeline) { score += 8; reasons.push('gave a timeline') }

  // Detail beyond the template is the clearest sign of a person: Lauren Kane's
  // "a home in The Nations I'd need to sell", not "I am seeking a property".
  const notes = message.split(/notes:/i)[1]?.trim() ?? ''
  if (notes.length > 40) { score += 10; reasons.push('wrote specific detail') }

  const kind = classify(message)
  if (kind === 'solicitation') {
    score = Math.min(score, 10)
    reasons.unshift('reads as a B2B pitch')
  } else if (kind === 'bait') {
    score = Math.min(score, 10)
    reasons.unshift('reads as realtor bait')
  }

  score = Math.max(0, Math.min(100, score))

  // Only an explicit classifier files a submission away. A merely unremarkable
  // message still reaches the inbox — a filed real client costs a commission.
  const band: LeadBand = kind !== null ? 'file' : score >= 60 ? 'inbox' : 'review'
  return { score, band, reasons, places: named }
}
