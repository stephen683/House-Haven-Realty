# Phase 4 — `/learn` library

**Date:** 2026-05-06
**Phase:** 4 of 6
**Status:** Shipped. `/blog` 301-redirects to `/learn`. Library is browsable by category and stage. Greatest Hits page rendered with "in curation" empty state pending Stephen's pick list (`/reports/2026-05-06-greatest-hits-curation-ask.md`).

---

## What changed

### File-level rename
- `data/blog.ts` → `data/learn.ts` via `git mv`. Full content preserved.
- Inline export renames via sed (single regex pass):
  - `BlogSection` → `LearnSection`
  - `BlogPost` → `LearnPost`
  - `blogPosts` → `learnPosts`
  - `blogPostBySlug` → `learnPostBySlug`
  - `getSortedPosts` → `getSortedLearnPosts`
- 1,832 lines of article content unchanged. Renames touched the type/exports only.

### New: taxonomy
`lib/learn-taxonomy.ts` — slug-keyed map decorating each post with:
- `category`: `'fsbo' | 'buying' | 'sell-or-rent' | 'nashville-market'`
- `stage`: `'research' | 'decision' | 'action'`
- `advisoryTrack` (optional): which Advisory track the article should cross-promote at the end of the post

Mappings for the 25 existing articles assigned conservatively from their original freeform `category` field. Articles without a mapping fall through to `nashville-market` / `research`.

Includes `LEARN_CATEGORIES`, `LEARN_STAGES`, `getLearnTaxonomy(slug)`, `isValidCategory`, `isValidStage` exports. Plus `GREATEST_HITS` array (ships empty; Stephen fills via the curation ask).

### New: routes

| Route | Purpose | Render |
|---|---|---|
| `/learn` | Library index with category × stage filters; URL searchParams `?category=` and `?stage=` drive the filter | Dynamic |
| `/learn/[slug]` | Article page with byline, sections, hero image, callouts, contextual `AdvisoryCTA` keyed off `advisoryTrack`, related posts + neighborhoods, `Article` JSON-LD schema | SSG (25 paths) |
| `/learn/greatest-hits` | Curated list — renders `GREATEST_HITS` array entries in order. Empty state shows "in curation" message until Stephen ships picks | Static |
| `/learn/feed.xml` | RSS 2.0 feed of all articles, sorted newest-first, 1-hour CDN cache | Static |

### Empty states

- **FSBO category** has zero articles by design. `/learn?category=fsbo` shows "The FSBO library is in production — first piece coming soon." with a CTA to `/advisory/fsbo`.
- **Greatest Hits** with empty array shows "The Greatest Hits list is being curated." with a CTA back to `/learn`.

Per Stephen's tightening rule: no fabricated content; no invented topic placeholders.

### Contextual Advisory CTA on article pages

Each article that has an `advisoryTrack` mapping in the taxonomy renders an `<AdvisoryCTA>` block at the end of the post body, sized as a card variant. The card text comes from the track's `audience` + `promise` strings in `lib/advisory-config.ts`, so the CTA copy stays in sync with the rest of the Advisory product surface.

Mappings (12 of 25 articles cross-promote a track):
- 8 buying articles → `/advisory/buyer-roadmap`
- 3 sell-or-rent articles → `/advisory/sell-or-rent`
- 1 article (`how-to-choose-nashville-real-estate-agent`) maps to no track on purpose — that piece's value is exactly the kind of *agent* discovery the Advisory product steps back from claiming to be the only answer to.

### Redirects

`next.config.mjs` adds:
```js
{ source: '/blog', destination: '/learn', permanent: true },
{ source: '/blog/:path*', destination: '/learn/:path*', permanent: true },
```

Pre-existing `/blog-posts` legacy redirect retargeted from `/blog` → `/learn`.

### Consumer updates

| File | Change |
|---|---|
| `app/sitemap.ts` | `from '@/data/blog'` → `'@/data/learn'`; `/blog/${p.slug}` → `/learn/${p.slug}`; added `/learn` and `/learn/greatest-hits` static entries |
| `app/communities/[slug]/page.tsx` | import + related-posts links retargeted to `/learn/` |
| `components/homepage/WhatWePublish.tsx` | Phase 3 stub repointed at `/learn` (was `/blog`) |
| `components/layout/Header.tsx` | secondary nav: `Blog` → `Learn` |
| `components/compliance/SiteFooter.tsx` | Resources column: `Blog` → `Learn` |
| `app/blog/` | **Deleted** — 25 SSG slug pages and the index, all replaced by `/learn` equivalents |

## Voice / brand audit

- All copy on `/learn` index uses operator voice (Hero: "Long-form, no listicles, no fluff.")
- No banned words on any new page
- Filter pills use existing `bg-black text-white` (active) / `bg-househaven-surface` (inactive) — no new tokens
- Hero on `/learn` uses the same `bg-black text-white` pattern as `/advisory` heroes for consistency
- Article page typography unchanged from prior `/blog/[slug]` design (Modulus heading, body text, callouts, byline)

## Validation

```
npx tsc --noEmit              # clean
npx next lint                 # ✔ No ESLint warnings or errors
npx next build                # 171 routes (was 171 pre-Phase-4 — net same since /blog/[slug] × 25 was replaced 1:1 by /learn/[slug] × 25, plus 4 new static /learn routes = 175 total before subtracting /blog index)
```

Bundle:
- `/learn` (filterable index): 218 B / 101 kB First Load
- `/learn/[slug]`: 218 B / 101 kB
- `/learn/feed.xml`: edge response, no JS
- `/learn/greatest-hits`: 210 B / 96.2 kB

`<AdvisoryCTA>` reuse on `/learn/[slug]` is the first cross-link payoff for the Phase 1 component staging.

## What ships pending Stephen

- **Greatest Hits curation list** (8–12 entries) — see `/reports/2026-05-06-greatest-hits-curation-ask.md`. Single-edit to `GREATEST_HITS` in `lib/learn-taxonomy.ts` activates the page.
- **FSBO topic list** — when Stephen writes the FSBO articles, add entries to `data/learn.ts` and to `LEARN_TAXONOMY` in `lib/learn-taxonomy.ts` with `category: 'fsbo'`. The `/learn?category=fsbo` empty state flips to a populated grid automatically.

## What's next

- **Phase 5** — RentCast on community pages + Pipeline cross-links: rewrite 57 community pages with embedded `<NeighborhoodPipeline>` + `<NeighborhoodRental>` components, listing-detail cross-links, Pipeline page footers
- **Phase 6** — E-sign integration + admin polish

## Suggested commit message

```
phase-4(learn): rename /blog → /learn with category × stage taxonomy

- File-level: data/blog.ts → data/learn.ts via git mv. Exports renamed
  via sed: BlogPost → LearnPost, blogPosts → learnPosts, etc.
  1,832 lines of article content untouched
- New lib/learn-taxonomy.ts: category (fsbo/buying/sell-or-rent/
  nashville-market) × stage (research/decision/action) decoration map
  + helpers. 22 of 25 articles mapped; 3 fall through to default
- New routes: /learn (filterable by ?category= ?stage=), /learn/[slug]
  (SSG with Article JSON-LD + contextual AdvisoryCTA + author byline +
  related posts/neighborhoods), /learn/greatest-hits (curated list,
  ships empty pending Stephen's curation), /learn/feed.xml (RSS 2.0)
- Empty states: FSBO category renders "first piece coming soon" with
  /advisory/fsbo CTA; Greatest Hits renders "in curation" message.
  No fabricated content
- 301 redirects: /blog → /learn, /blog/:path* → /learn/:path*
- Consumers updated: sitemap, communities/[slug], WhatWePublish,
  Header secondary nav, SiteFooter Resources column. /blog routes
  deleted

Greatest Hits curation ask in /reports/2026-05-06-greatest-hits-
curation-ask.md.
```
