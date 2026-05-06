# Homepage hero headline — three candidates

**Date:** 2026-05-06
**Phase:** 3 — homepage rebrand to three peer paths
**Action needed:** Stephen picks one. Default in code is Option A. Switching is a one-line change in `lib/homepage-config.ts` (`HOMEPAGE_HEADLINE` constant).

---

## Constraints (from the brief and from voice rules)

- Lead with the structural argument, not "we sell answers" or "we built a second product"
- No banned words ("luxury," "world-class," "premier," "trusted," exclamation marks, Music City clichés, "your dream home")
- Operator voice — direct, structural, framework-driven
- Sets up the subhead and the three peer cards naturally (DIY tools / Hire by hour / Hire as agent)
- Reads in under three seconds — this is above the fold

---

## Option A — "Real estate has been all-or-nothing. We changed that."

**Tone:** Boldest. Names the problem in the first sentence, claims the solution in the second.

**Why it works:**
- Mirrors the structural argument language directly from your brief (this is essentially the brief's lead claim, condensed)
- "All-or-nothing" is a familiar consumer-decision frame (you either hire someone or do it yourself) — readers recognize the binary immediately
- "We changed that" is bold but earned — you actually did change it by adding Advisory as a peer
- Sets up the three peer cards as the *evidence* that it changed
- Two short sentences = strong rhythm, scannable, memorable

**Risk:**
- "We changed that" is a strong claim. It only lands if the three peer cards make the case immediately below. (The current Phase 3 layout puts those cards directly below the hero, so the claim is supported on the same screen.)

**Pairs with subhead:**
> Three paths now: free tools you use yourself, a paid hour with a broker who is not trying to take your transaction, or full representation under standard commission. Same brokerage. You pick the level of help.

---

## Option B — "A Nashville brokerage built around your level of help."

**Tone:** Calmer. Frames House Haven as the subject and "your level of help" as the new offering.

**Why it works:**
- "Level of help" is a clean, plain-English frame for the three peer paths — it does the structural work without using the word "structural"
- Less confrontational than Option A; risks less on a single bold claim
- Brokerage-first framing — works well with TREC compliance instinct (firm name leads)
- "Built around" implies deliberate design, which fits the Advisory product origin story

**Risk:**
- Doesn't explicitly name the all-or-nothing status quo. A reader who has never thought about real-estate-advice economics may miss why "level of help" is novel — they may read it as a tagline rather than a structural shift. The "Why this exists" section on `/advisory` does the heavy lifting on the *why*; the homepage only sets up the choice.

**Pairs with subhead:**
> Use the tools yourself. Hire us by the hour. Or hire us as your agent. Same brokerage, same office, same broker — you pick the level.

---

## Option C — "Three paths. You pick the level of help."

**Tone:** Minimal. Front-loads the choice.

**Why it works:**
- Shortest of the three — works well on mobile, works well in social/PR cards
- "You pick" puts the reader in the driver's seat — strong agency framing
- "Level of help" as the consumer-facing concept is clean
- Bridges directly into the three peer cards visually — the cards *are* the three paths

**Risk:**
- Skips the structural argument entirely. Reads more like a tagline and less like a positioning claim. A reader unfamiliar with the all-or-nothing problem may think this is just clever copy, not a structural shift in how real estate gets done.
- The argument has to live entirely below the fold, which weakens the front-door effect.

**Pairs with subhead:**
> Most real estate advice is free because the person giving it only gets paid if you transact. We changed that. Same brokerage; you pick how much help you want.

---

## My recommendation

**Option A.** It's the boldest claim, but it's also the one that is *true* — you genuinely changed the all-or-nothing default by adding Advisory as a peer. Option A makes the structural shift the lead, which is what the brief argued for in the first place ("the structural argument must lead the copy"). Options B and C soften the claim; Option A doesn't.

If your gut says A feels too aggressive, my second pick is B — it's the conservative version of the same message and pairs naturally with the calmer subhead.

---

## How to switch

The selected headline is exported from `lib/homepage-config.ts`:

```ts
export const HOMEPAGE_HEADLINE = 'Real estate has been all-or-nothing. We changed that.'
```

Change the string, deploy. The Hero component reads the constant; nothing else needs to update.

I shipped Phase 3 with **Option A** as the default. If you want B or C, edit the constant and the matching subhead on a single commit.
