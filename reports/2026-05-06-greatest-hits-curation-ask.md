# Greatest Hits curation — request for Stephen

**Date:** 2026-05-06
**Phase:** 4 — `/learn` library
**Action needed:** pick 8–12 articles from the library; write one sentence per piece naming who it's for.

---

## What this is

`/learn/greatest-hits` is the page Stephen sends to inbound Advisory leads when they ask "where do I start?" Per the brief, it is curated by reader job-to-be-done, not by date. Until you fill the curation list, the page renders an "in curation" message and routes visitors to the full library.

## How the page reads each entry

```ts
// lib/learn-taxonomy.ts
export const GREATEST_HITS: GreatestHitsEntry[] = [
  // {
  //   slug: 'first-time-buyer-programs-tn',
  //   jobToBeDone: 'first-time buyers in Nashville who need to know about THDA',
  // },
  // ...
]
```

Each entry pairs a post slug with a reader-job-to-be-done sentence. The sentence shows on the curated list as the framing for that piece — "For: [your sentence here]" — so a reader can scan the list and find the one that matches them.

## What I am asking for

**8–12 entries** from the 25-article library. Each entry needs:
1. The post **slug** (the URL after `/learn/`)
2. A single sentence about **who that piece is for** — written in your operator voice. Examples:
   - "first-time buyers six months out who haven't talked to a lender yet"
   - "homeowners considering converting to a rental in The Nations"
   - "relocators from a high-tax state pricing out Williamson County"

Keep the sentences specific. "Anyone considering buying" is too broad; "buyers debating new construction vs. resale in 37013" is right.

## All 25 articles, with slugs

Sorted by published date, newest first.

### nashville-market

- `nashville-market-report-april-2026` — *Nashville housing market report — April 2026*
- `nashville-real-estate-market-forecast-2026` — *Nashville Real Estate Market Forecast 2026: Where Prices, Rates, and Inventory Are Heading*
- `moving-to-nashville-2026` — *Moving to Nashville in 2026: the honest, neighborhood-by-neighborhood guide*
- `nashville-relocation-guide-remote-workers` — *Nashville Relocation Guide for Remote Workers*
- `best-nashville-suburbs-commuters` — *Best Nashville Suburbs for Commuters: Ranked by Drive Time and Affordability*
- `nashville-property-tax-guide-2026` — *Nashville Property Taxes Explained — What Homeowners Actually Pay in 2026*
- `living-in-franklin-tn-2026` — *Living in Franklin, TN — The Complete 2026 Guide*
- `living-in-brentwood-tn` — *Living in Brentwood, TN — Schools, Homes & What to Know*
- `mt-juliet-tn-guide` — *Mt. Juliet, TN guide*
- `hendersonville-tn-guide` — *Hendersonville, TN — Lake Life Meets Nashville Commute*
- `spring-hill-tn-guide` — *Spring Hill, TN — The Two-County Growth Story*

### buying

- `first-time-buyer-programs-tn` — *First-time homebuyer programs in Tennessee*
- `rent-vs-buy-nashville-2026` — *Rent vs. buy in Nashville: the 2026 breakdown*
- `new-construction-contracts-nashville` — *What to know before buying new construction in Nashville*
- `nashville-new-construction-what-to-know` — *Buying New Construction in Nashville — The Complete 2026 Buyer's Guide*
- `best-neighborhoods-nashville-families-2026` — *Best Nashville Neighborhoods for Families in 2026*
- `nashville-home-inspection-guide` — *The Nashville Home Inspection Guide — What to Expect and What to Negotiate*
- `nashville-closing-costs-explained` — *Nashville Closing Costs Explained: What Buyers and Sellers Actually Pay*
- `how-to-choose-nashville-real-estate-agent` — *How to Choose a Nashville Real Estate Agent*
- `nashville-hoa-guide` — *Nashville HOA Guide: What Buyers Need to Know Before Signing*
- `nashville-va-loan-guide` — *Nashville VA Loan Guide for Military Buyers in Tennessee*
- `understanding-nashville-flood-zones` — *Understanding Nashville Flood Zones*

### sell-or-rent

- `selling-your-nashville-home-spring-2026` — *Selling Your Nashville Home in Spring 2026*
- `nashville-investment-property-guide-2026` — *Investing in Nashville Real Estate — A 2026 Guide for First-Time Investors*
- `downsizing-in-nashville` — *Downsizing in Nashville: A Guide for Empty Nesters and Right-Sizers*

### fsbo

*(Empty by design. Stephen will add FSBO topics.)*

## Where the picks slot in

Edit `lib/learn-taxonomy.ts` and replace the `GREATEST_HITS` array:

```ts
export const GREATEST_HITS: GreatestHitsEntry[] = [
  { slug: 'rent-vs-buy-nashville-2026', jobToBeDone: 'first-time buyers debating whether 2026 is the year' },
  { slug: 'nashville-property-tax-guide-2026', jobToBeDone: 'relocators from no-tax states sticker-shocked by Williamson County' },
  // ...
]
```

That single edit lights up the page. No code changes anywhere else.

## Order matters

The list renders in the order you write it. Put the entries in the order a new visitor should read them — the first three should answer the most common inbound questions.
