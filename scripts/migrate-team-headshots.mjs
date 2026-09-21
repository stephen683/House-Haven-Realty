#!/usr/bin/env node
// Pull the team headshots off the legacy Blok/AgentA CDN and into the repo.
//
// Every headshot — nine agents plus Stephen's homepage portrait — is hotlinked
// from media.agentaprd.com, the CDN behind the Blok subscription. Cancelling
// Blok removes every face from the site: the team grid, nine profile pages,
// the author card on 25 blog posts, About, the homepage Stephen Moment, and the
// `image` field of each agent's Person JSON-LD.
//
// Run from the repo root, anywhere with network access to that CDN:
//   node scripts/migrate-team-headshots.mjs           # download + rewrite
//   node scripts/migrate-team-headshots.mjs --check   # report only, no writes
//
// Images are accepted on what the bytes say — format and real dimensions — not on
// the status code. Idempotent: a slug whose local file already validates is
// skipped. Exits
// non-zero if any image fails to download or fails validation, and rewrites
// nothing unless every image succeeded — a partial migration would ship broken
// images, which is worse than the hotlink it replaces.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { probeImage, rejectReason } from './lib/image-probe.mjs'

const ROOT = process.cwd()
const OUT_DIR = join(ROOT, 'public/images/team')
const TEAM_TS = join(ROOT, 'data/team.ts')
const HOME_TSX = join(ROOT, 'app/page.tsx')
const NEXT_CONFIG = join(ROOT, 'next.config.mjs')
const LEGACY_HOST = 'media.agentaprd.com'
const MIN_BYTES = 2048
const checkOnly = process.argv.includes('--check')

/** slug -> remote url, read from data/team.ts so this never drifts from the roster. */
function readTeam(src) {
  const out = []
  const re = /slug:\s*'([^']+)'[\s\S]*?headshotUrl:\s*\n?\s*'([^']+)'/g
  let m
  while ((m = re.exec(src)) !== null) out.push({ slug: m[1], url: m[2] })
  return out
}

const teamSrc = readFileSync(TEAM_TS, 'utf8')
const entries = readTeam(teamSrc)
const remote = entries.filter((e) => e.url.includes(LEGACY_HOST))

if (entries.length === 0) {
  console.error('FAIL: parsed no team members out of data/team.ts — the shape changed.')
  process.exit(1)
}
console.log(`${entries.length} team members, ${remote.length} still on ${LEGACY_HOST}`)
if (remote.length === 0) {
  console.log('Nothing to migrate — every headshot is already local.')
  process.exit(0)
}
if (checkOnly) {
  for (const { slug, url } of remote) console.log(`  would fetch ${slug} <- ${url}`)
  process.exit(0)
}

mkdirSync(OUT_DIR, { recursive: true })

const done = []
const failed = []

for (const { slug, url } of remote) {
  const existing = ['webp', 'jpg', 'png']
    .map((ext) => ({ ext, path: join(OUT_DIR, `${slug}.${ext}`) }))
    .find(({ path }) => existsSync(path) && statSync(path).size >= MIN_BYTES)
  if (existing) {
    console.log(`  = ${slug} already local (${existing.ext})`)
    done.push({ slug, ext: existing.ext, url })
    continue
  }
  try {
    const res = await fetch(url, { redirect: 'follow' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < MIN_BYTES) throw new Error(`only ${buf.length} bytes — not a real image`)
    const bad = rejectReason(buf)
    if (bad) throw new Error(bad)
    const { format: ext, width, height } = probeImage(buf)
    writeFileSync(join(OUT_DIR, `${slug}.${ext}`), buf)
    console.log(`  + ${slug}.${ext}  ${width}x${height}  ${(buf.length / 1024).toFixed(0)} KB`)
    done.push({ slug, ext, url })
  } catch (err) {
    console.error(`  ! ${slug}: ${err.message}`)
    failed.push(slug)
  }
}

if (failed.length) {
  console.error(`\nFAIL: ${failed.length} image(s) could not be saved: ${failed.join(', ')}`)
  console.error('Nothing was rewritten. Fix the source images, then re-run.')
  process.exit(1)
}

// Only now, with every byte on disk, repoint the code.
let team = teamSrc
for (const { url, slug, ext } of done) team = team.split(url).join(`/images/team/${slug}.${ext}`)
writeFileSync(TEAM_TS, team)

const stephen = done.find((d) => d.slug === 'stephen-delahoussaye')
if (stephen) {
  const home = readFileSync(HOME_TSX, 'utf8')
  const next = home.split(stephen.url).join(`/images/team/${stephen.slug}.${stephen.ext}`)
  if (next !== home) {
    writeFileSync(HOME_TSX, next)
    console.log('  ~ app/page.tsx repointed')
  }
}

// The remote pattern only existed for this CDN; leaving it invites a new hotlink.
const cfg = readFileSync(NEXT_CONFIG, 'utf8')
const stripped = cfg.replace(
  /^\s*\{ protocol: 'https', hostname: '(media|extassets)\.agentaprd\.com' \},\n/gm, '')
if (stripped !== cfg) {
  writeFileSync(NEXT_CONFIG, stripped)
  console.log('  ~ next.config.mjs: agentaprd remote patterns removed')
}

console.log(`\nMigrated ${done.length} headshot(s). Now run: npm run build && npm run lint`)
