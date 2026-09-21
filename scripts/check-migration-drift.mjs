#!/usr/bin/env node
// Compare supabase/migrations/ against what the project has actually applied.
//
// These drifted to 8 files against 29 applied migrations without anything
// noticing: work applied through the Supabase MCP lands in the remote ledger
// but never in git. The gap was invisible because nothing compared the two —
// and it was not cosmetic. The search RPC the typeahead calls, and all four
// migrations that closed the PII tables to the browser key, existed only in
// production. A rebuild from git would have shipped a broken typeahead and
// re-opened the hole.
//
//   SUPABASE_ACCESS_TOKEN=<management api token> \
//   SUPABASE_PROJECT_REF=eefqcgetyxdrvchkwhrq \
//   node scripts/check-migration-drift.mjs
//
// Exits non-zero on any divergence, so it can gate a release.

import { readdirSync } from 'node:fs'

const REF = process.env.SUPABASE_PROJECT_REF || 'eefqcgetyxdrvchkwhrq'
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN
if (!TOKEN) {
  console.error('SUPABASE_ACCESS_TOKEN is required (Supabase account settings -> access tokens).')
  process.exit(2)
}

const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'select version, name from supabase_migrations.schema_migrations order by version',
  }),
})
if (!res.ok) {
  console.error(`Management API ${res.status}: ${await res.text()}`)
  process.exit(2)
}

/** Applied, as "<version>_<name>" — the filename each one should have. */
const applied = (await res.json()).map((r) => `${r.version}_${r.name}`)
const local = readdirSync('supabase/migrations')
  .filter((f) => f.endsWith('.sql'))
  .map((f) => f.replace(/\.sql$/, ''))

const missing = applied.filter((a) => !local.includes(a))   // in the DB, not in git
const extra = local.filter((l) => !applied.includes(l))     // in git, never applied

console.log(`applied: ${applied.length}   local: ${local.length}`)

if (missing.length) {
  console.error(`\n${missing.length} applied migration(s) are NOT in the repo:`)
  for (const m of missing) console.error(`  - ${m}`)
  console.error('  The database cannot be rebuilt from git. Recover each one with:')
  console.error("    select array_to_string(statements, E';\\n') from" +
                ' supabase_migrations.schema_migrations where version = <version>;')
}
if (extra.length) {
  console.error(`\n${extra.length} repo migration(s) were never applied:`)
  for (const e of extra) console.error(`  - ${e}`)
  console.error('  Either apply them or delete them; a file nobody ran is a lie about the schema.')
}

if (missing.length || extra.length) process.exit(1)
console.log('No drift: every applied migration is in the repo, and vice versa.')
