# House Haven Realty — Tier One Plan

**Written:** 2026-09-21 · **Status:** proposed, not locked
**Companions:** `docs/ROADMAP.md` (build spec, locked) · `docs/TODO.md` (live tracker)

This plan is sequenced by money lost, not by how interesting the work is.

---

## 1. Where the site actually stands

Measured today against production, not inferred from docs.

| | |
|---|---|
| Live on | `househavenrealty.com` + `www` — **both verified, serving production** since April |
| Routes | 152, building green in ~62s |
| Tests | 173 passing, 19 files |
| Form submissions since 2026-04-18 | **156** |
| Of those, real clients | **3** |
| Leads with a confirmed notification | **0 of 156** |
| Leads still marked `status: 'new'` | **156 of 156** |
| `listings_cache` rows | **0** — `/homes-for-sale` is serving 8 mock listings |
| `valuation_cache` rows | **0** — `/value` has never recorded a successful RentCast call |
| `canary_runs` rows | 90,391 and unbounded |

**Correction to a working assumption:** `CLAUDE.md` says the site is "pre-launch on
`project-bmq0e.vercel.app` until DNS cutover." That is stale. The apex and `www` are
verified and aliased to production. **The site has been live on the real domain for
months.** Every item below is a live-site problem, not a pre-launch one. That changes
the urgency of §3 and §4 in particular.

---

## 2. The frame

Tier one is not more features. This site already has more tools than most brokerages in
Nashville. Tier one is four properties, in this order:

1. **A real lead reaches a human in minutes and is never lost.**
2. **The listings are real, current, and complete.**
3. **The site is found for the searches Chris, Sarah and the Thompsons actually type.**
4. **Nothing on it is fabricated, stale, or silently broken.**

Every phase below serves one of those. Anything that serves none of them is a Post-Launch
Layer and waits — including work that sounds strategic.

---

## 3. Phase 0 — Stop the bleeding ✅ shipped today

Spam protection across all nine POST endpoints: honeypot, fill timer, Gmail dot-stuffing,
gibberish names, link stuffing, per-IP rate limits on a Postgres bucket table that fails
open. Calibrated against the real corpus: blocks 100 of the 156 historical submissions,
refuses none of the 3 real clients.

**What this fixed:** the inbox is readable again. A bot hit contact → valuation → contact
in 40 seconds this morning, four hours before the fix deployed. That specific pattern is
now dead.

**What this did not fix — and this is the important part.** Spam protection is a
*hygiene* fix. It removes noise. It does not route, qualify, or deliver a single lead.
The 3 real clients would have been just as lost with perfect spam filtering. Phase 1 is
the one that makes money.

**Known gaps, deliberately left for Phase 1:**
- Rate limits are per-IP **per-endpoint**. The observed bot spread its 3 hits across
  three different endpoints, so each stayed under its own ceiling. A per-canonical-email
  ceiling closes that.
- One known bot (`uyon.itaj540@gmail.com`, name `zwKlVkMrTndEAPemLoipOPO`) slips both
  content rules — 1 dot, vowel ratio 0.304 against a 0.30 threshold. Do **not** chase it
  by loosening the threshold; that is how false positives start. It is what the honeypot
  is for.
- Offshore realtor-bait (~31 of the 156) is well-formed prose. Content rules will never
  catch it. Scoring and triage will (§4.2).

---

## 4. Phase 1 — The lead is the product ⭐ highest value, start now

> **Lauren Kane** submitted on the structured search form: buying in West Nashville
> at ≤$900k, 3+ beds, *and has a home in The Nations she needs to sell*. A double-sided
> deal. It sat unread for 55 days. It is still sitting there, marked `new`.
>
> This is the single largest dollar loss on the site, and no amount of new features
> touches it.

### 4.1 Close the pipeline ✅ shipped 2026-09-21

**Email is the lead path.** There is no CRM on the site: leads are emailed to Stephen
and worked in Meet Corinne. The HubSpot integration was removed rather than left
dormant — an integration nobody uses fails quietly, which is the failure mode this
whole phase exists to kill.

- `lib/lead-intake.ts` is now the single path for every public form: save, notify,
  record the outcome. Only the save can fail the request.
- `/api/contact` and `/api/valuation` were posting to Resend with a raw `fetch` and
  **never reading the response**; `/api/newsletter` notified nobody at all. All three
  now go through `lib/resend.ts` with the result checked and written to `notified_at`
  or `notify_error`.
- The **agent contract route** was worse and is fixed the same way: it inserted a deal
  under contract, logged any error, and returned 201 regardless. It now refuses on a
  failed save and warns the agent when the desk was not emailed.
- Canary check **Lead delivery (notify)**: every lead from the last 24h produced a
  confirmed notification. Silence was the failure mode we kept shipping.

Two things found and recorded while removing HubSpot: the portal holds 7,060 contacts
and refuses new ones, and the client was writing two properties that do not exist in
it — so the CRM leg could not have worked with any token.

### 4.2 Score, don't just block (est. 2–3 days)

Binary spam/not-spam is the wrong shape for realtor-bait. Score every submission 0–100 and
route by band: **auto-file** the obvious junk, **inbox** the real ones, **hold for review**
the middle. The signals are already sitting in the data:

- **Local specificity is the strongest signal in the corpus.** All 3 real clients named a
  real Nashville neighbourhood — The Nations, 12 South, Spring Hill. Zero bait messages
  named one. Cross-reference the message against `data/communities.ts` (57 entries) and
  `lib/pipeline-zips.ts`.
- **Form shape.** All 3 real clients used the structured `HomeSearchForm`. Essentially all
  bait came through free-text contact. That is a product lever, not just a filter — see 4.3.
- WhatsApp / international dial codes in a Nashville enquiry.
- Canonical-email repeat rate (`canonicalEmail()` already exists and is tested).

### 4.3 Design the funnel toward structure (est. 2–3 days)

The data is unambiguous: **structured intake produced 100% of the real leads; free text
produced 100% of the bait.** Act on it.

- Make the structured search form the primary path on `/buyers`, `/contact` and the
  homepage. Free text becomes the fallback, not the default.
- Ask one qualifying question that a bait script cannot answer plausibly — neighbourhood
  or ZIP, bound to real Nashville geography we already have.
- **Within the locked kill list.** No account creation, no email wall, no chatbot, no
  exit-intent. Structure is not friction: Lauren Kane filled in five fields voluntarily.

### 4.4 Make the inbox an actual queue (est. 2 days)

156 leads all marked `new` means nobody is working the list — the status field is
decoration. An internal `/agents` view already exists behind a password. Give it: unworked
leads first, score visible, one click to claim, one click to mark contacted. Ten agents,
one queue.

---

## 5. Phase 2 — Be the listings authority 🔴 blocked on Stephen

**`/homes-for-sale` is serving 8 mock listings on the live public domain.** `listings_cache`
is empty. This is the largest credibility and SEO gap on the site and it has been live for
months. A brokerage site whose listings are fake is not tier one at any level of polish.

The code is done and shipped — RESO client, search, detail pages, full NAR IDX compliance,
schema. **It is blocked on one thing: the MLS Grid API key.** No engineering unblocks it.

- **Stephen: submit the MLS Grid application.** Realtracs 615-385-0777 / info@mlsgrid.com.
  ~$250/mo, ~2-day approval. This is the highest-leverage hour on the entire list.
- Until the key exists, the mock listings must be **labelled as samples or the route taken
  down.** Publishing eight fabricated listings as real inventory on a live brokerage domain
  is the same class of problem as the fabricated valuations we removed from `/value` — and
  that one we fixed in an afternoon.
- On key arrival: smoke test, 15-min ISR, verify the compliance surface against live data.

Same shape at `/value`: the RentCast key is set, but `valuation_cache` has **zero** rows,
so no successful call has ever been recorded. Either nobody has used it or it is failing
silently. **Test it with a real Nashville address before trusting it.** One of the June
leads is still holding a fabricated estimate from before the fix.

---

## 6. Phase 3 — Be found (est. 1 week, after Phase 1)

The site is technically well-built for SEO — 152 routes, schema, sitemap, 57 community
pages, 25 posts. Two things are missing.

- **Conversion analytics.** Vercel Analytics counts pageviews. Nothing connects a pageview
  to a lead. `leads.page_url` is captured on every row and has never been queried. Report
  leads per page per month — that is what tells us which of the 57 community pages earn
  their keep and which are dead weight.
- **Voice cleanup.** 13 instances of banned words (`luxury`, `world-class`, `premier`) in
  `data/communities.ts` and `data/blog.ts`, several in meta descriptions where they do SEO
  work and brand damage at once. Brentwood is described as "luxury living"; the Nolensville
  Pike food scene is "world-class." Rewrite them. `blog.ts` also calls Sylvan Park
  "family-quiet" — worth rewording on Fair Housing grounds.
  *(Earlier in this session I flagged a "Brentwood familial-status tagline." That was
  overstated — it is a voice-word problem, not a Fair Housing one. No "family-friendly,"
  "safe area," or "good neighborhood" phrasing exists anywhere in the codebase.)*

---

## 7. Phase 4 — Operate like infrastructure (est. 2–3 days, ongoing)

The canary went 7 → 13 checks today and all are green. Extend it to the things that have
actually failed here, which is always the quiet stuff:

- Lead sync freshness (§4.1) and notification delivery.
- `listings_cache` and `valuation_cache` non-empty once their keys land.
- **Prune `canary_runs`** — 90,391 rows and growing every 15 minutes, monitoring the site
  by slowly filling its database. 30-day retention.
- Wire the migration drift checker into CI so the 8-vs-29 gap cannot silently reopen.
  *(Blocked: creating a GitHub Actions workflow was refused by the harness in this session.
  Stephen adds the workflow file, or we run the check pre-release.)*

---

## 8. Sequence

| When | What | Blocked on |
|---|---|---|
| ✅ Today | Phase 0 — spam protection | done, deployed |
| ✅ Today | 4.1 close the pipeline (email path + delivery canary) | done, deployed |
| **This week** | **MLS Grid application** | **Stephen, ~1 hour** |
| Week 2 | 4.2 scoring, 4.3 structured funnel | nothing |
| Week 2 | Label or pull the mock listings | nothing |
| Week 3 | 4.4 agent queue | nothing |
| On key arrival | Phase 2 — real IDX | MLS Grid |
| Week 4 | Phase 3 — conversion analytics, voice cleanup | nothing |
| Ongoing | Phase 4 — canary, retention, CI | Actions workflow |

## 9. What I need from you

1. **Submit the MLS Grid application.** Highest-leverage hour on this list. Everything in
   Phase 2 is finished code waiting on a key.
2. **Call Lauren Kane.** 55 days. She is buying *and* selling.
3. **Decide on the mock listings:** label as samples, or take the route down until the feed
   is live. My recommendation is take it down — a 404 costs less than fake inventory on a
   licensed brokerage's domain.
4. **Run `node scripts/migrate-team-headshots.mjs`** — still outstanding from earlier today.
5. **Tell me when Meet Corinne should receive leads directly.** Today they land in your
   inbox only. `lib/lead-intake.ts` is the one place a Corinne webhook would go.

## 10. What this plan deliberately does not do

Per ROADMAP §13 and the kill list, and per the strategic frame: no chatbot, no AI
assistant, no accounts or logins, no Zestimate, no exit-intent, no floating widgets, no new
blog posts, no mortgage calculator on the homepage, no property-management cross-promotion.

It also does not add a single new tool. House Haven has ten. The constraint is not tool
count — it is that the tools produced 156 submissions, 3 of which were real, and all 3 were
lost anyway. **Fix the path from submission to phone call before building the eleventh tool.**
