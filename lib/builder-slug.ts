// Contractor names arrive from Metro unnormalized — mixed case, individual
// people's names beside LLCs. Grouping and slugging must agree everywhere or
// /pipeline/builders/[slug] 404s on links built elsewhere.

/** Grouping key. Mirrors the `contractor_key` generated column in Postgres. */
export function normalizeBuilderName(raw: string): string {
  return raw.toUpperCase().trim()
}

/** Slug used by /pipeline/builders and /pipeline/builders/[slug]. */
export function slugifyBuilder(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/** Metro's catch-all bucket — not a real builder, never link it as one. */
export const SELF_CONTRACTOR_KEY = 'SELF CONTRACTOR RESIDENTIAL (SEE APPLICANT INFORMATION)'

export function isRealBuilder(raw: string | null | undefined): boolean {
  if (!raw) return false
  const key = normalizeBuilderName(raw)
  return key.length >= 3 && !key.startsWith('SELF CONTRACTOR')
}
