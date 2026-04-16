// Long-form blog content for the House Haven Realty site.
// Stored as structured TS rather than MDX until we wire up next-mdx-remote.
// Sections render as rich text on /blog/[slug]; internal links are authored inline.

export interface BlogSection {
  heading?: string
  paragraphs: string[]
  callout?: { title: string; body: string }
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  authorSlug: string
  publishedAt: string // ISO
  updatedAt: string // ISO
  readTimeMinutes: number
  heroImage: string
  heroCaption: string
  category: string
  tags: string[]
  sections: BlogSection[]
  relatedCommunitySlugs?: string[]
  relatedPostSlugs?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'moving-to-nashville-2026',
    title: 'Moving to Nashville in 2026: the honest, neighborhood-by-neighborhood guide',
    excerpt:
      'Commutes, cost of living, schools, taxes, and the neighborhoods that actually match how you want to live. A real guide, not a listicle.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-10T13:00:00.000Z',
    updatedAt: '2026-04-15T13:00:00.000Z',
    readTimeMinutes: 14,
    heroImage:
      'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Downtown Nashville, looking south from the Cumberland.',
    category: 'Relocating',
    tags: ['relocating', 'cost of living', 'neighborhoods'],
    sections: [
      {
        paragraphs: [
          'Every week we get an email from someone about to move to Nashville. They have spent three weekends on Zillow, they have watched a few YouTube videos, and they are still not sure where they actually want to live. That is not their fault — most of the content online about moving to Nashville is either written by a national relocation company that has never driven I-24 at 5 p.m., or it is a listicle that describes East Nashville and Germantown as if those are the only two neighborhoods in town.',
          'This is the guide we wish we could hand out. It is long on purpose. Nashville is a real city with real tradeoffs, and the only way to make a good decision is to understand them before you sign a lease or put in an offer.',
        ],
      },
      {
        heading: 'The 10-second version',
        paragraphs: [
          'Nashville is growing fast, Middle Tennessee is growing even faster, and the center-of-gravity of the real estate market has shifted outward every year since 2018. If you want to live inside Davidson County, you will pay more per square foot and get less yard — but you will have a 15-minute commute, walkability in many neighborhoods, and proximity to the things you probably moved here for. If you want more house, more land, and better schools in the strict test-score sense, your answer is likely in Williamson, Sumner, Wilson, or Robertson County. This guide will help you figure out which one.',
        ],
      },
      {
        heading: 'Cost of living and taxes',
        paragraphs: [
          'Tennessee has no state income tax. That alone is worth $5,000 to $30,000 a year for most households relocating from California, New York, Illinois, or New Jersey — money that goes straight to your mortgage budget. Property taxes are also lower than most metro areas, though they have crept up as assessments catch up with the market.',
          'Sales tax is higher than average (9.25% combined in Davidson County) and groceries are taxed, which is a real hit for large families. Insurance — car, home, and health — has risen sharply in the last three years, and most newcomers are surprised by their first home insurance quote. Get two quotes before you buy.',
          'Everything else — utilities, gas, dining out — is roughly national-average. Nashville is not cheap anymore, but it is still meaningfully cheaper than Denver, Austin, or Raleigh for the same quality of life.',
        ],
      },
      {
        heading: 'Inside Davidson County',
        paragraphs: [
          'If you want to be in the city and can afford it, the core neighborhoods worth short-listing are East Nashville, Germantown, 12 South, Sylvan Park, The Nations, and Hillsboro Village. Each has its own character — East Nashville is walkable and music-forward, Germantown is historic-meets-luxury, Sylvan Park is family-quiet, 12 South is boutique-shopping-with-a-park, The Nations is new-construction-heavy, Hillsboro Village is Vanderbilt-adjacent.',
          'If value matters more than the zip code prestige, look at Madison, Inglewood, Donelson, and Bordeaux. These are all within a 15-minute drive of downtown and have real housing stock in the $400s — which is increasingly rare inside Davidson County. We have guides for each of these. Start with Inglewood if you want the East-Nashville-feel at a lower price, and Donelson if being near the airport matters.',
        ],
        callout: {
          title: "Tip from the field",
          body: 'When you are touring homes in the core neighborhoods, drive them at 5 p.m. on a Tuesday. The commute math is completely different than it looks on Google Maps at 11 a.m.',
        },
      },
      {
        heading: 'The suburbs: Williamson, Sumner, Rutherford, Wilson, Robertson',
        paragraphs: [
          'If you have kids in public school and you are coming from a district you liked, Williamson County is almost certainly on your list. Franklin, Brentwood, Nolensville, and Thompsons Station all feed into Williamson County Schools, which is consistently rated among the strongest districts in the state. Franklin is historic and charming but increasingly expensive. Brentwood is where the $1M+ primary homes cluster. Thompsons Station and Nolensville are where growth is happening right now and where buyers priced out of Franklin land.',
          'Sumner County is the I-65 north corridor — Hendersonville, Gallatin, Goodlettsville, Portland. It is lake country (Old Hickory Lake), and the commute to downtown is manageable for most households. Rutherford County includes Murfreesboro, Smyrna, and La Vergne, and it is the fastest-growing county in the state. Wilson County (Mount Juliet, Lebanon) has become the east-side alternative to Williamson. Robertson County (Springfield, Greenbrier, Coopertown) is where real value lives right now for buyers who are okay with a 35-minute commute.',
          'Each of these has different math and we have a community guide for every single one.',
        ],
      },
      {
        heading: 'What commute actually looks like',
        paragraphs: [
          'Nashville traffic is not Los Angeles. It is also not Des Moines. The honest version: downtown-to-suburb commutes are usually 25 to 45 minutes depending on where you are coming from and what time you leave. I-24 from the southeast (Murfreesboro, Smyrna, La Vergne) is the worst stretch in the region at peak hours. I-65 north (Goodlettsville, Hendersonville) is second-worst. I-65 south (Franklin, Brentwood) is slow but steady. I-40 east (Mount Juliet, Lebanon) is fine unless there is a wreck. I-40 west (Bellevue, Kingston Springs, Dickson) is the easiest major artery.',
          'If you can work from home two or three days a week, your practical commute radius doubles. That is the single biggest lever in where you can afford to live and what kind of house you can buy.',
        ],
      },
      {
        heading: 'Schools and the real estate market',
        paragraphs: [
          'Schools drive a huge portion of the real estate decision in Middle Tennessee, and the districts you hear about most — Williamson County Schools, Franklin Special School District, Oak Ridge — deserve their reputations. But school zones change more often than families expect, especially in high-growth counties. Always confirm the current assignment for a specific address with the district directly before making an offer. A home that was zoned to a top-tier elementary two years ago may not be today.',
          'Metro Nashville Public Schools operates a choice system that lets families apply to schools outside their zone, and many buyers find the right public fit through choice schools, charter options, and magnet programs. It is a real option — do not rule out living inside Davidson County just because of a default zone.',
        ],
      },
      {
        heading: 'How to actually make the decision',
        paragraphs: [
          'Every relocating buyer we work with starts with the same question: where should we live? The honest answer is always "it depends on three things" — how often you need to be downtown, what your kids (if any) need from a school, and how much yard you want to mow. If you can answer those three, the list of neighborhoods that fit you usually collapses to three or four.',
          'After that, the best thing you can do is come spend a weekend driving the short list. Stay in a short-term rental in each neighborhood for one night, eat at local restaurants, drive the route to the places you care about at the time of day you would actually drive them. Twenty-four hours on the ground beats twenty hours on Zillow every time.',
          'And when you are ready, we are happy to put together a custom tour plan for you — no obligation, no pressure, just a few hours with someone who knows the area well. That is how most of our relocations start.',
        ],
        callout: {
          title: 'Ready to start?',
          body: 'Send us a note and we will build you a personalized Nashville relocation plan — neighborhoods, tour schedule, and a CMA on any address you are already watching.',
        },
      },
    ],
    relatedCommunitySlugs: [
      'inglewood',
      'donelson',
      'thompsons-station',
      'greenbrier',
      'lebanon',
    ],
    relatedPostSlugs: ['first-time-buyer-programs-tn', 'rent-vs-buy-nashville-2026'],
  },
  {
    slug: 'nashville-market-report-april-2026',
    title: 'Nashville housing market report — April 2026',
    excerpt:
      'Where median prices, inventory, and days on market sit right now across Middle Tennessee — and what it actually means for buyers and sellers this spring.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-12T12:00:00.000Z',
    updatedAt: '2026-04-15T13:00:00.000Z',
    readTimeMinutes: 8,
    heroImage:
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'The Middle Tennessee market has finally caught its breath.',
    category: 'Market Reports',
    tags: ['market report', 'data', 'spring 2026'],
    sections: [
      {
        paragraphs: [
          'Every month we pull together what the Realtracs MLS is telling us about the Middle Tennessee housing market and translate it into plain English for our clients. This is the April 2026 edition. If you want these delivered to your inbox each month, sign up at the bottom of the page.',
          'The big picture this spring is that the market has settled into something that feels more familiar to longtime agents than anything we have seen since 2019. Inventory has started to build, days on market are stretching, and buyers finally have a little negotiating room. Sellers who come to market prepared — real staging, real photography, a realistic price — are still getting strong results. Everyone else is sitting.',
        ],
      },
      {
        heading: 'Median price: up modestly, cooling fast',
        paragraphs: [
          'Year-over-year, the Nashville-area median sale price is still up — but the pace of that appreciation has slowed sharply compared with the last three springs. That is the number most news headlines are missing. Prices in many suburbs are basically flat month-over-month, and a handful of hot neighborhoods actually ticked down a percent or two from the late-2025 peak.',
          'For buyers, this is the biggest shift of the year. You are no longer competing in a waiving-inspections, 24-hour-deadline environment. You can ask for repairs. You can take a second look before writing the offer. That is a meaningful change in negotiating dynamics, and if you have been sitting on the sidelines, it is the right moment to take another look.',
        ],
      },
      {
        heading: 'Inventory has built, finally',
        paragraphs: [
          'Active inventory across Davidson, Williamson, Sumner, Wilson, Rutherford, Robertson, Dickson, and Cheatham counties has climbed noticeably since Q4 2025. Some of that is seasonal — spring always brings listings — but a portion of it is sellers who have been waiting two or three years for the "right" time and finally decided to come to market. That is a healthy sign for the overall market.',
          'For sellers, this means your home is being compared against more alternatives than it was last year. Pricing at or just below the last comp is more likely to generate traffic than pricing at last-comp-plus-10-percent and hoping.',
        ],
      },
      {
        heading: 'Days on market: the real story',
        paragraphs: [
          'Days on market is the single most telling metric right now because it is where the shift from a seller market to a balanced market shows up most clearly. Homes that would have sold in a weekend in 2022 are taking one to three weeks in the most active neighborhoods. In the outer-ring counties, well-priced homes are still moving fast; overpriced ones are sitting for 45 to 90 days and then cutting.',
          'What that means in practice: if your home has been on the market for three weeks without a good offer, do not wait until week eight to make a price adjustment. The buyers watching your home are comparing it to the homes that just came on last week. The longer you sit without a move, the more you signal that something is wrong with the house.',
        ],
      },
      {
        heading: 'What this means for buyers',
        paragraphs: [
          'If you were waiting for "the market to break" — this is what that looks like in Middle Tennessee. Not a collapse. Not a fire sale. Just a meaningful rebalancing where you have time to think, room to negotiate, and less fear that the perfect home will vanish before you can get back for a second look.',
          'Get pre-approved, get specific about what you want, and plan to write offers that ask for the things you would have had to skip last year — inspection time, repairs, closing credits toward your rate buydown.',
        ],
      },
      {
        heading: 'What this means for sellers',
        paragraphs: [
          'Spring is still the best window to come to market, and most of the meaningful listing activity for the year happens in the next 10 weeks. Price it right, present it well, and do not assume the premium pricing strategies of 2022 still work. They do not.',
          'If you are thinking about selling but you want to see actual comps for your specific home before deciding, send us a note. We will put together a real CMA — not an automated estimate — and walk you through what we expect you would net at three different price points.',
        ],
      },
    ],
    relatedPostSlugs: [
      'rent-vs-buy-nashville-2026',
      'new-construction-contracts-nashville',
    ],
  },
  {
    slug: 'first-time-buyer-programs-tn',
    title: 'First-time homebuyer programs in Tennessee: everything you need to know',
    excerpt:
      'THDA, GreatChoice, downpayment assistance, and the lender combos that actually stack. Real numbers for real Nashville budgets.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-03-28T14:00:00.000Z',
    updatedAt: '2026-04-15T13:00:00.000Z',
    readTimeMinutes: 11,
    heroImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'First key, first home. Every Nashville first-time buyer gets this moment.',
    category: 'Buyer guides',
    tags: ['first-time buyer', 'THDA', 'downpayment assistance', 'Rent Less Own More'],
    sections: [
      {
        paragraphs: [
          'A huge part of what we do at House Haven Realty — and a huge part of why Stephen launched the Rent Less, Own More! initiative back in 2019 — is helping first-time Tennessee homebuyers get into their first home without the anxiety that usually comes with it. A lot of that anxiety is information asymmetry. Most first-time buyers have no idea how many state and federal programs exist, how they stack, or which ones they actually qualify for.',
          'This guide is our cheat sheet. It is written for Middle Tennessee buyers, and we update it whenever program rules change. If you want to talk through your specific numbers, message us and one of our agents will walk you through it — no obligation, no sales pitch.',
        ],
      },
      {
        heading: 'THDA Great Choice Home Loan',
        paragraphs: [
          'The flagship Tennessee first-time buyer program is the THDA (Tennessee Housing Development Agency) Great Choice Home Loan. It is a 30-year fixed-rate government-backed mortgage with income limits that vary by household size and county, and purchase price limits that adjust each year. Rates are typically a fraction of a percent below conventional market rates because THDA gets favorable pricing.',
          'The biggest win is not the rate itself — it is what you can combine with it.',
        ],
      },
      {
        heading: 'Great Choice Plus downpayment assistance',
        paragraphs: [
          'THDA layers a program called Great Choice Plus on top of the base loan. It provides up to a set dollar amount or a percentage of the sales price toward your downpayment and closing costs, in the form of a second mortgage that is forgivable over time if you stay in the home.',
          'In practice, this means a lot of our Middle Tennessee first-time buyers close on a home with effectively zero out-of-pocket expense beyond earnest money and an inspection. On a $350,000 home that typically means bringing a few thousand dollars to closing instead of the twenty or thirty thousand they thought they needed.',
        ],
        callout: {
          title: 'Worth checking',
          body: 'Income limits and purchase price caps change annually. Do not assume you are over the limit — most Nashville households we run numbers for still qualify.',
        },
      },
      {
        heading: 'Homeownership for the Brave',
        paragraphs: [
          'THDA also runs Homeownership for the Brave, which is available to active-duty military, veterans, National Guard, and reservists. It is typically a lower interest rate on the Great Choice loan and has the same Great Choice Plus stacking option. If you served — even briefly — ask your lender about this before settling on a standard conventional loan.',
        ],
      },
      {
        heading: 'Federal programs that stack (or do not)',
        paragraphs: [
          'FHA loans allow 3.5% down with more flexible credit. VA loans allow 0% down for qualified military. USDA Rural Development loans allow 0% down in eligible rural areas — and a surprising number of Middle Tennessee towns still qualify as "rural" for USDA purposes, including parts of Ashland City, Greenbrier, Pegram, and Dickson County. If you are open to a 30-45 minute commute, USDA can be transformative.',
          'These can be combined with THDA Great Choice Plus in most cases, though the exact combination depends on underwriter guidelines. Your lender will guide you — if they do not know, get a different lender.',
        ],
      },
      {
        heading: 'The lender matters more than most people realize',
        paragraphs: [
          'Not every lender in Tennessee is a THDA-approved originator. The list is public and changes periodically. Our strongest advice to every first-time buyer we work with is this: get two quotes, at least one of which should be from a lender who actively works with THDA and downpayment assistance programs. The difference between a lender who "can do" these programs and one who runs them every week is night and day.',
          'We keep a short list of lenders we trust across Middle Tennessee and we are happy to share it — not a kickback arrangement, just lenders who consistently close these loans cleanly for our clients.',
        ],
      },
      {
        heading: 'What Rent Less, Own More! actually looks like',
        paragraphs: [
          'When Stephen started Rent Less, Own More! in 2019, the goal was simple: stop first-time buyers from feeling like they needed to be perfect before they could start. You do not need 20% down. You do not need a 780 credit score. You do not need to have read every personal-finance blog. You need a lender who knows these programs, a REALTOR® who knows the market, and a plan you understand.',
          'We run first-time buyer workshops a few times a year and we are happy to do one-on-one walkthroughs any time. Send us a message and tell us your rough numbers — we will come back with a real, specific plan for how to get you into your first home.',
        ],
      },
    ],
    relatedCommunitySlugs: ['greenbrier', 'ashland-city', 'dickson', 'madison', 'inglewood'],
    relatedPostSlugs: ['rent-vs-buy-nashville-2026', 'moving-to-nashville-2026'],
  },
  {
    slug: 'rent-vs-buy-nashville-2026',
    title: 'Rent vs. buy in Nashville: the 2026 breakdown',
    excerpt:
      'We run the math at five Middle Tennessee price points and show where buying still beats renting — and where it genuinely does not.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-03T11:00:00.000Z',
    updatedAt: '2026-04-15T13:00:00.000Z',
    readTimeMinutes: 10,
    heroImage:
      'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'The math is different than it was three years ago. Here is where it still works.',
    category: 'Buyer guides',
    tags: ['rent vs buy', 'finance', 'first-time buyer'],
    sections: [
      {
        paragraphs: [
          'Every first-time buyer we meet in 2026 asks the same question, just with different words: does it still make sense to buy right now? The answer has gotten more nuanced than it was three years ago, and the honest version — the version we give our own family — is that it depends entirely on how long you plan to own the home and how much rent you would be paying instead.',
          'Here is how we actually run the numbers.',
        ],
      },
      {
        heading: 'The five-year rule',
        paragraphs: [
          'The single biggest factor is not interest rates, not property taxes, not appreciation assumptions. It is how long you expect to stay in the home. Our rule of thumb is that under five years, you need a very specific set of circumstances for buying to beat renting — you probably have to assume above-average appreciation or below-average maintenance. At five to seven years, the math usually favors buying for most Nashville households. At ten years and beyond, buying almost always wins, even at current rates.',
          'If you know you will not be in the home for at least four or five years, think hard before you commit.',
        ],
      },
      {
        heading: 'Running the numbers at five price points',
        paragraphs: [
          'We ran a quick comparison at $350k, $450k, $550k, $750k, and $1.1M with current rates, a 6.5% assumed appreciation cap (well below the last five years of Nashville actuals), and typical Middle Tennessee taxes and insurance. Rent comps were pulled from representative Nashville neighborhoods.',
          'At $350k — buyer wins after about 4 years. At $450k — buyer wins after about 4.5 years. At $550k — buyer wins after about 5 years. At $750k — buyer wins after about 5.5 years. At $1.1M+ — buyer wins after 6+ years, and you want to be sure about the neighborhood.',
          'These are rough numbers and every household is different. The point is that at the Middle Tennessee price points most of our first-time buyers target — $350k to $550k — the break-even window is around four or five years.',
        ],
      },
      {
        heading: 'What renters keep missing in the math',
        paragraphs: [
          'Renters usually compare rent to a mortgage payment and stop there. That is the wrong comparison. The right comparison is: rent-plus-opportunity-cost-of-your-savings versus mortgage-plus-taxes-plus-insurance-plus-maintenance-minus-equity-buildup-minus-tax-deductions.',
          'Once you model both sides honestly, the gap between renting and owning in Middle Tennessee narrows much faster than the sticker price suggests. Every month you pay a mortgage, you are paying down principal — which is forced savings. Every year, you capture some appreciation, even if it is modest. And at the end of 30 years, you own the house free and clear, which is not a small thing.',
        ],
      },
      {
        heading: 'When renting genuinely wins',
        paragraphs: [
          'There are scenarios where renting is the right call, and we will say so even though we sell houses for a living. If you are not sure you want to be in Nashville long-term — rent first. If you have not figured out what kind of neighborhood you want — rent for a year and drive the city. If your job may relocate you in the next two years — rent. If you do not have an emergency fund beyond your down payment — rent until you do.',
          'Owning a home is a commitment. If the commitment is not right for your life right now, that is a perfectly fine answer, and we would rather you come back in 18 months ready than buy something you will regret.',
        ],
      },
      {
        heading: 'If you want us to run your specific numbers',
        paragraphs: [
          'Every household math is different. If you want a custom rent-vs-buy analysis for your exact situation, send us a note. We will pull current rates from our lender partners, model your realistic timeline, compare it against rent in the neighborhoods you are considering, and give you an honest answer.',
        ],
      },
    ],
    relatedPostSlugs: ['first-time-buyer-programs-tn', 'nashville-market-report-april-2026'],
  },
  {
    slug: 'new-construction-contracts-nashville',
    title: 'What to know before buying new construction in Nashville',
    excerpt:
      'Builder contracts are written for the builder. Here is what to read, what to negotiate, and why you need your own agent in the room.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-08T15:00:00.000Z',
    updatedAt: '2026-04-15T13:00:00.000Z',
    readTimeMinutes: 9,
    heroImage:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'New construction is often the right call. The contract still needs a real review.',
    category: 'Buyer guides',
    tags: ['new construction', 'builder contracts', 'permit map'],
    sections: [
      {
        paragraphs: [
          'New construction is one of the best opportunities in the current Middle Tennessee market. Builders are motivated to move inventory, incentive packages have gotten meaningful, and many subdivisions have the kind of floor plans and yards that resale inventory just does not offer at the same price point. We are big fans.',
          'But we have also negotiated enough builder contracts to know that the default forms they hand you across the sales desk are not written in your favor. Here is the short list of what every new construction buyer in Nashville should know — and why having your own agent involved from the start is not optional.',
        ],
      },
      {
        heading: 'The sales agent works for the builder',
        paragraphs: [
          'When you walk into a builder sales office without your own agent, the person sitting across from you is representing the builder. Full stop. They are friendly, they are knowledgeable, they may be legitimately lovely — and they are not your advocate. They cannot be. Their fiduciary duty runs to the builder, not to you.',
          'Most builders have a policy that if you bring your own licensed REALTOR® on your very first visit and have them register you, you can be represented throughout the transaction at no additional cost to you. If you walk in alone first, that option often disappears. Visit number one matters.',
        ],
        callout: {
          title: 'Rule of thumb',
          body: 'Never visit a builder sales office for the first time without your own REALTOR® present or pre-registered. This single mistake costs more Nashville buyers than any other.',
        },
      },
      {
        heading: 'Use your own lender, at least for a quote',
        paragraphs: [
          "Builders typically steer you toward their preferred lender with an incentive package (closing costs, rate buydowns, upgraded appliances). Those incentives can be real — but they can also hide an above-market rate or unnecessarily tight appraisal. Always get an independent quote from at least one lender you know and trust before committing to the builder's lender. If the builder's deal is genuinely better, great. If it is not, you have just saved yourself real money.",
        ],
      },
      {
        heading: 'The contract: what to actually read',
        paragraphs: [
          'Builder contracts are long, dense, and written by builder attorneys. We are not going to replace an attorney in this post, but the items that matter most in the contracts we see weekly are: the completion date and what happens if it slips, the deposit structure and what is refundable under what circumstances, the punch-list and warranty provisions, the change-order process, and the dispute resolution clause (arbitration versus court).',
          'Pay special attention to the "substantial completion" definition. On some contracts, a home can be declared substantially complete even with significant punch items outstanding. On others, you have real leverage to hold closing until things are truly done.',
        ],
      },
      {
        heading: 'Inspections — yes, you still need one',
        paragraphs: [
          'Every new construction buyer asks us the same question: do I need a home inspection on a brand new house? Yes. Unambiguously yes. New construction is built quickly, and even reputable builders have subcontractors who make mistakes. We see HVAC units that were never connected, plumbing fittings that were left loose, electrical panels that were labeled wrong, and insulation that was installed incorrectly — all on brand-new homes from reputable builders.',
          'Get a full inspection. Ideally, also get a pre-drywall inspection before the walls close up. The cost is trivial relative to what it catches.',
        ],
      },
      {
        heading: 'Use our permit map',
        paragraphs: [
          'One of the reasons we built our New Construction permit map is that a huge number of Nashville buyers do not realize how much is being built outside of the obvious subdivisions. There are pockets of infill new construction happening in Bordeaux, Inglewood, Madison, and Donelson — inside Davidson County — that offer modern product at meaningfully lower prices than the popular Williamson County master plans. The map surfaces them the same day the permit is filed.',
          'Spend 10 minutes on it. You will probably find a street you did not know existed.',
        ],
      },
    ],
    relatedCommunitySlugs: ['bordeaux', 'madison', 'donelson', 'thompsons-station'],
    relatedPostSlugs: ['moving-to-nashville-2026', 'first-time-buyer-programs-tn'],
  },
  {
    slug: 'best-neighborhoods-nashville-families-2026',
    title: 'Best Nashville Neighborhoods for Families in 2026',
    excerpt:
      'Where to raise a family in Nashville depends on your priorities — schools, yard space, commute, or community feel. Here are our top picks for 2026.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-14T10:00:00Z',
    updatedAt: '2026-04-14T10:00:00Z',
    readTimeMinutes: 10,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Family homes in Middle Tennessee — where community meets convenience.',
    category: 'Neighborhood Guides',
    tags: ['families', 'schools', 'neighborhoods', 'nashville'],
    sections: [
      {
        heading: 'What makes a neighborhood family-friendly?',
        paragraphs: [
          'Every family defines "family-friendly" differently. Some prioritize school ratings above everything. Others want a cul-de-sac and a big backyard. Some need a short commute so they can make it to daycare pickup by 5:30. And some just want neighbors who wave.',
          'In Nashville, the good news is that you have options across every price range. The challenge is that the best family neighborhoods are often the most competitive — and the ones that seem affordable sometimes come with trade-offs that are not obvious from a Zillow listing.',
          'Here is our honest assessment of where to look in 2026, based on actually helping families buy homes in these neighborhoods — not aggregated data or sponsored content.',
        ],
      },
      {
        heading: 'Nolensville — the new-construction family magnet',
        paragraphs: [
          'Nolensville has become the default answer for families who want Williamson County schools and are willing to pay for new construction. Nolensville High School opened in 2016 and the feeder schools are strong. The town itself has invested in a walkable Main Street with restaurants and shops.',
          'The trade-off is price — most family homes start in the low $500s and push past $700k in premium subdivisions. Nolensville Road traffic during rush hour is also a real consideration.',
        ],
        callout: { title: 'House Haven insight', body: 'We help Nolensville buyers evaluate which builders are actually delivering quality versus cutting corners. In a market with this much new construction, that distinction matters.' },
      },
      {
        heading: 'Hendersonville — lake life with Sumner County schools',
        paragraphs: [
          'Hendersonville wraps around Old Hickory Lake and offers a suburban lifestyle with genuine outdoor recreation. Sumner County Schools is a strong district, and the Streets of Indian Lake provides retail and dining without driving to Cool Springs.',
          'Entry-level family homes start in the mid $300s, making Hendersonville significantly more accessible than Williamson County options. Lakefront properties push into the $800s and beyond.',
        ],
      },
      {
        heading: 'Franklin — if the budget allows',
        paragraphs: [
          'Franklin is the gold standard for families who prioritize school district, downtown walkability, and community events. The Williamson County school system consistently ranks among the best in Tennessee. The downtown Main Street is genuinely charming.',
          'The floor price for a family home in Franklin is roughly $500k, with most inventory in the $600k-$900k range. If your budget supports it, Franklin is hard to beat.',
        ],
      },
      {
        heading: 'Bellevue — west Nashville\'s family anchor',
        paragraphs: [
          'Bellevue offers Davidson County living with a suburban feel. The Harpeth River provides kayaking and outdoor recreation. Red Caboose Park is a neighborhood favorite. And the commute to downtown is about 20 minutes.',
          'Prices range from the low $300s for starter homes to $600s+ for larger properties. For families who want to stay in Davidson County without paying East Nashville prices, Bellevue is worth a serious look.',
        ],
      },
      {
        heading: 'Mt. Juliet — Wilson County\'s family corridor',
        paragraphs: [
          'Mt. Juliet has transformed from a small town into one of Nashville\'s most desirable family suburbs. Wilson County Schools is strong, Providence Marketplace provides retail convenience, and the housing stock skews newer.',
          'Prices range from the mid $300s for townhomes to $600s+ for larger family homes. The I-40 commute is the main trade-off.',
        ],
      },
      {
        heading: 'The bottom line',
        paragraphs: [
          'The best family neighborhood is the one that matches your specific priorities — not a ranking on a national website. School ratings matter, but so do commute times, lot sizes, community vibe, and monthly budget.',
          'If you are evaluating family neighborhoods in Nashville, reach out. We will give you the real talk on each area — including the things that do not show up on listings.',
        ],
      },
    ],
    relatedCommunitySlugs: ['nolensville', 'hendersonville', 'franklin', 'bellevue', 'mt-juliet'],
    relatedPostSlugs: ['moving-to-nashville-2026', 'first-time-buyer-programs-tn'],
  },
  {
    slug: 'nashville-home-inspection-guide',
    title: 'The Nashville Home Inspection Guide — What to Expect and What to Negotiate',
    excerpt:
      'Your home inspection is the most important 3 hours of the buying process. Here is what Nashville buyers need to know about inspections, repair requests, and when to walk away.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-10T10:00:00Z',
    readTimeMinutes: 9,
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Home inspection day — where preparation meets protection.',
    category: 'Buyer Education',
    tags: ['home-inspection', 'buyers', 'negotiation', 'nashville'],
    sections: [
      {
        heading: 'Why the inspection matters more than the price',
        paragraphs: [
          'You can negotiate a purchase price. You cannot un-buy a house with a cracked foundation. The home inspection is your one window to understand what you are actually purchasing — and in Nashville\'s market, where competition can pressure buyers to skip contingencies, understanding this process is critical.',
          'A standard home inspection in Nashville runs $400-$600 depending on the size of the home. It takes about 2-3 hours. And it is worth every penny.',
        ],
      },
      {
        heading: 'What a Nashville home inspection covers',
        paragraphs: [
          'A licensed Tennessee home inspector will evaluate the structural integrity, roof condition, HVAC systems, plumbing, electrical, foundation, grading and drainage, insulation, windows and doors, and general safety items.',
          'In Nashville specifically, pay attention to: foundation issues (Nashville\'s clay soil causes movement), water intrusion (especially in older homes near creeks), HVAC age (systems wear out faster in our humid climate), and roof condition (hail damage is common).',
        ],
        callout: { title: 'Nashville-specific concern', body: 'Nashville\'s expansive clay soil causes more foundation issues than most cities. If the inspector flags cracks wider than 1/4 inch, or doors that won\'t close properly, get a structural engineer involved before making any decisions.' },
      },
      {
        heading: 'The inspection report — how to read it',
        paragraphs: [
          'Inspection reports in Nashville typically run 30-50 pages with photos. Do not panic at the length — every house has issues. The question is whether the issues are cosmetic, maintenance-related, or structural.',
          'We categorize findings into three buckets: safety issues (must fix), significant defects (negotiate), and cosmetic items (ignore for now). Your agent should walk you through the report line by line.',
        ],
      },
      {
        heading: 'What to negotiate and what to let go',
        paragraphs: [
          'In Tennessee, the inspection contingency gives you the right to request repairs, ask for a credit, or walk away. The standard TREC contract allows a specific number of days for this process.',
          'Request repairs for: safety issues (electrical hazards, gas leaks), structural problems, roof leaks, HVAC failures, and plumbing issues. Do not request: cosmetic items, normal wear and tear, or items disclosed in the seller\'s property disclosure.',
          'The goal is not to get a perfect house — it is to understand what you are buying and make an informed decision.',
        ],
      },
      {
        heading: 'When to walk away',
        paragraphs: [
          'Walking away is always an option during the inspection period. Consider it if: foundation issues require $20k+ in repairs, the seller refuses to address safety items, mold remediation costs exceed your budget, or the cumulative repair list fundamentally changes the value proposition.',
          'We have walked clients away from homes they loved when the inspection revealed problems that would haunt them. That is what having an advocate means.',
        ],
      },
      {
        heading: 'Choosing a Nashville home inspector',
        paragraphs: [
          'We recommend inspectors we have worked with for years — professionals who are thorough, honest, and willing to explain findings in plain English. We never recommend inspectors who rush, minimize issues, or have conflicts of interest.',
          'If you are buying in Nashville, ask us for our inspector recommendations. The right inspector can save you thousands or prevent a costly mistake.',
        ],
      },
    ],
    relatedCommunitySlugs: ['east-nashville', 'germantown', 'bellevue', 'hermitage', 'antioch'],
    relatedPostSlugs: ['first-time-buyer-programs-tn', 'rent-vs-buy-nashville-2026'],
  },
  {
    slug: 'selling-your-nashville-home-spring-2026',
    title: 'Selling Your Nashville Home in Spring 2026 — Timing, Pricing, and Strategy',
    excerpt:
      'Spring is Nashville\'s strongest selling season. Here is how to time your listing, price it correctly, and avoid the mistakes that cost sellers thousands.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-05T10:00:00Z',
    updatedAt: '2026-04-05T10:00:00Z',
    readTimeMinutes: 11,
    heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Spring selling season in Nashville — when preparation meets opportunity.',
    category: 'Seller Strategy',
    tags: ['selling', 'spring-market', 'pricing', 'nashville'],
    sections: [
      {
        heading: 'Why spring 2026 is different',
        paragraphs: [
          'Nashville\'s spring market in 2026 is shaped by three forces: interest rates that have stabilized in the mid-6% range, inventory that is slowly increasing from record lows, and buyer demand that remains strong due to continued corporate relocations and population growth.',
          'For sellers, this means: you still have leverage, but less than you had in 2021-2022. Pricing correctly is more important than ever. Overpriced homes are sitting, while correctly priced homes are still moving quickly with multiple offers.',
        ],
      },
      {
        heading: 'When to list — the Nashville calendar',
        paragraphs: [
          'Nashville\'s selling season runs from mid-March through June, with a secondary window in September-October. The data consistently shows that homes listed in April and May sell faster and for higher prices than any other months.',
          'The ideal timeline: start prep work in February, professional photos in March, list in early-to-mid April. This catches the wave of spring buyers before summer slowdown and school year concerns kick in.',
        ],
        callout: { title: 'Timing tip', body: 'List on a Thursday. Nashville buyers browse online over the weekend and schedule showings for Saturday and Sunday. A Thursday listing maximizes your first-weekend exposure.' },
      },
      {
        heading: 'Pricing strategy — the biggest mistake sellers make',
        paragraphs: [
          'The single most common mistake Nashville sellers make is overpricing. An overpriced home does not sit quietly — it actively damages your leverage. Every day on market above 14 tells buyers something is wrong.',
          'Your CMA (Comparative Market Analysis) should be based on actual closed sales within the last 90 days in your specific neighborhood — not Zillow estimates, not your neighbor\'s asking price, and not what you "need" to net.',
          'We price to create competition. A correctly priced home generates multiple offers, and multiple offers push the final price above list. An overpriced home generates zero offers and eventually sells below where it should have been priced originally.',
        ],
      },
      {
        heading: 'Prep checklist — ROI-focused improvements',
        paragraphs: [
          'Not all pre-listing improvements are created equal. The highest-ROI items in Nashville\'s current market: professional cleaning (including windows), fresh exterior mulch and landscaping, neutral interior paint in bold rooms, and fixing deferred maintenance items that will show up in the buyer\'s inspection.',
          'Do NOT invest in: kitchen remodels (you will not recoup the cost), pool installations, or trendy finishes that may not match buyer taste. The goal is to present a clean, well-maintained home — not a magazine spread.',
        ],
      },
      {
        heading: 'Marketing that actually sells homes',
        paragraphs: [
          'Professional photography is non-negotiable — smartphone photos cost you money. Drone photography matters for properties with land or views. 3D tours have become standard for serious listings.',
          'At House Haven, every listing gets professional photography, custom copywriting, social media promotion, and strategic MLS positioning. We also leverage our network of active buyers who are already searching.',
        ],
      },
      {
        heading: 'Negotiation — protecting your bottom line',
        paragraphs: [
          'In a spring 2026 market, expect buyers to request inspection repairs and potentially ask for closing cost credits. The key is knowing what is reasonable and what is a negotiation tactic.',
          'We pull apart every offer and explain it in plain English — price, contingencies, financing strength, timeline, and the things between the lines that most sellers miss. Our job is to maximize your net, not just accept the highest number.',
        ],
      },
      {
        heading: 'Ready to sell?',
        paragraphs: [
          'If you are thinking about selling your Nashville home this spring, the first step is a free CMA. We will tell you what your home is actually worth based on real data — not an algorithm. No obligation, no pressure.',
        ],
      },
    ],
    relatedCommunitySlugs: ['east-nashville', 'franklin', 'brentwood', 'green-hills', 'sylvan-park'],
    relatedPostSlugs: ['nashville-market-report-april-2026', 'rent-vs-buy-nashville-2026'],
  },
  {
    slug: 'nashville-property-tax-guide-2026',
    title: 'Nashville Property Taxes Explained — What Homeowners Actually Pay in 2026',
    excerpt:
      'Property taxes in Nashville vary dramatically by county, city, and assessment. Here is what you need to know before you buy.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
    readTimeMinutes: 8,
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Understanding Nashville property taxes — county by county.',
    category: 'Buyer Education',
    tags: ['property-taxes', 'davidson-county', 'williamson-county', 'nashville'],
    sections: [
      {
        heading: 'Why Nashville property taxes confuse everyone',
        paragraphs: [
          'Nashville property taxes are confusing because the metro area spans multiple counties, each with different tax rates, assessment schedules, and special districts. A home in Davidson County (Nashville proper) is taxed differently than an identical home in Williamson County (Franklin) or Sumner County (Hendersonville).',
          'Add in the fact that Tennessee has no state income tax — property taxes and sales taxes carry more of the government funding burden — and the numbers start to matter more than in most states.',
        ],
      },
      {
        heading: 'How Nashville property taxes are calculated',
        paragraphs: [
          'Tennessee uses a two-part formula: assessed value times the tax rate. Residential property is assessed at 25% of appraised value. So a $400,000 home has an assessed value of $100,000. Multiply that by your county\'s tax rate to get your annual bill.',
          'Davidson County\'s combined tax rate (county + city) is approximately $3.254 per $100 of assessed value. On a $400,000 home: $100,000 assessed x $3.254 / 100 = roughly $3,254 per year.',
        ],
        callout: { title: 'Key distinction', body: 'Williamson County\'s rate is lower — approximately $1.73 per $100 of assessed value. That same $400,000 home would cost roughly $1,730 per year in property taxes. This is why Williamson County communities like Franklin and Brentwood attract buyers despite higher home prices.' },
      },
      {
        heading: 'County-by-county tax rate comparison',
        paragraphs: [
          'Davidson County (Nashville): ~$3.25 per $100 assessed. The highest in the metro due to combined city/county government. However, Nashville offers urban services that suburban counties do not.',
          'Williamson County (Franklin, Brentwood, Nolensville): ~$1.73 per $100 assessed. Significantly lower, which partially offsets higher home prices.',
          'Sumner County (Hendersonville, Gallatin): ~$2.30 per $100 assessed. A middle ground between Davidson and Williamson.',
          'Rutherford County (Murfreesboro, Smyrna): ~$2.19 per $100 assessed. Combined with lower home prices, this makes Rutherford County attractive for budget-conscious buyers.',
          'Wilson County (Mt. Juliet, Lebanon): ~$2.23 per $100 assessed. Competitive with strong schools.',
        ],
      },
      {
        heading: 'Reappraisal years — when your taxes change',
        paragraphs: [
          'Tennessee reappraises property values on a regular cycle — Davidson County reappraises every 4 years. The most recent reappraisal significantly increased assessed values across Nashville, which translates to higher tax bills even if the rate stays the same.',
          'If you believe your assessment is too high, you can appeal to the county assessor\'s office. We help our clients understand the appeal process and whether it makes financial sense.',
        ],
      },
      {
        heading: 'Tax implications for home buyers',
        paragraphs: [
          'When comparing homes in different counties, always factor in the property tax difference. A $500,000 home in Franklin (Williamson) may have a lower total monthly cost than a $400,000 home in Nashville (Davidson) once you add property taxes to the mortgage payment.',
          'Your House Haven agent will run the full monthly cost comparison — principal, interest, taxes, insurance, and HOA — for every property you consider. The sticker price is just the beginning.',
        ],
      },
    ],
    relatedCommunitySlugs: ['franklin', 'brentwood', 'hendersonville', 'murfreesboro', 'mt-juliet'],
    relatedPostSlugs: ['first-time-buyer-programs-tn', 'rent-vs-buy-nashville-2026'],
  },
  {
    slug: 'nashville-new-construction-what-to-know',
    title: 'Buying New Construction in Nashville — The Complete 2026 Buyer\'s Guide',
    excerpt:
      'New construction in Nashville is booming, but not all builders and subdivisions are created equal. Here is what you need to know before signing a contract.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-03-25T10:00:00Z',
    updatedAt: '2026-03-25T10:00:00Z',
    readTimeMinutes: 12,
    heroImage: 'https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'New construction in Nashville — where opportunity meets due diligence.',
    category: 'Buyer Education',
    tags: ['new-construction', 'builders', 'nashville', 'contracts'],
    sections: [
      {
        heading: 'Nashville\'s new construction landscape in 2026',
        paragraphs: [
          'Nashville\'s new construction market has been one of the most active in the Southeast for a decade. From infill townhomes in The Nations to master-planned communities in Spring Hill, new builds account for a significant share of transactions.',
          'Our New Construction Map at househavenrealty.com/new-construction pulls live building permit data from Metro Nashville\'s open data portal — so you can see exactly where new homes are being built before they hit the MLS.',
        ],
      },
      {
        heading: 'Do you need an agent for new construction?',
        paragraphs: [
          'Yes. The builder\'s sales representative works for the builder, not for you. Having your own agent costs you nothing extra — the builder has already budgeted for buyer agent compensation. But having your own advocate during contract review, inspections, and negotiations can save you thousands.',
          'We have represented buyers in transactions with every major Nashville builder. We know which builders deliver on promises and which ones cut corners.',
        ],
        callout: { title: 'Critical warning', body: 'If you visit a builder\'s model home without your agent the first time, many builders will refuse to pay your agent\'s commission later. Always register with your House Haven agent before your first visit to any new construction site.' },
      },
      {
        heading: 'Understanding new construction contracts',
        paragraphs: [
          'New construction contracts in Tennessee are different from resale contracts. They typically include: a longer timeline (4-12 months from contract to close), builder-specific addenda that favor the builder, escalation clauses that allow price increases for material costs, and limited inspection rights.',
          'We review every clause of the builder\'s contract and negotiate on your behalf. Common negotiation points include: closing cost credits, upgrade packages, lot premiums, and warranty terms.',
        ],
      },
      {
        heading: 'The inspection — yes, new homes need inspections',
        paragraphs: [
          'One of the biggest mistakes new construction buyers make is skipping the independent home inspection. Even brand-new homes have defects — missing insulation, improperly graded lots, HVAC issues, plumbing mistakes.',
          'We recommend two inspections: a pre-drywall inspection (before walls are closed up) and a final inspection before closing. The pre-drywall inspection is your only chance to see the framing, wiring, and plumbing before it is hidden.',
        ],
      },
      {
        heading: 'Where to buy new construction in Nashville',
        paragraphs: [
          'The hottest new construction corridors in 2026: Spring Hill and Thompsons Station (master-planned communities), Nolensville (Williamson County schools), The Nations and Salemtown (urban infill), Hendersonville and Gallatin (Sumner County value), and Antioch (Davidson County affordability).',
          'Each area has different builders, price points, and trade-offs. We help buyers evaluate which corridor and which builder best matches their priorities.',
        ],
      },
      {
        heading: 'Builder reputation matters',
        paragraphs: [
          'Not all Nashville builders are equal. We track builder quality across warranty responsiveness, construction timelines, material choices, and client satisfaction. We will share our honest assessment of any builder you are considering.',
          'Questions to ask: How many homes has this builder completed in Nashville? What is their average construction timeline? What does their standard warranty cover? Can I bring my own inspector?',
        ],
      },
    ],
    relatedCommunitySlugs: ['spring-hill', 'thompsons-station', 'nolensville', 'the-nations', 'hendersonville'],
    relatedPostSlugs: ['new-construction-contracts-nashville', 'nashville-home-inspection-guide'],
  },
  {
    slug: 'nashville-investment-property-guide-2026',
    title: 'Investing in Nashville Real Estate — A 2026 Guide for First-Time Investors',
    excerpt:
      'Nashville remains one of the strongest real estate investment markets in the country. Here is how to evaluate properties, neighborhoods, and returns.',
    authorSlug: 'stephen-delahoussaye',
    publishedAt: '2026-03-18T10:00:00Z',
    updatedAt: '2026-03-18T10:00:00Z',
    readTimeMinutes: 11,
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2400&q=70',
    heroCaption: 'Nashville investment properties — where data drives decisions.',
    category: 'Investing',
    tags: ['investing', 'rental-properties', 'nashville', 'roi'],
    sections: [
      {
        heading: 'Why Nashville for real estate investment',
        paragraphs: [
          'Nashville\'s investment case is built on fundamentals: sustained population growth (roughly 80 people per day move to the Nashville metro), a diversified economy anchored by healthcare, music, tech, and tourism, and a regulatory environment that generally favors property owners.',
          'The numbers: Nashville metro home values have appreciated over 80% in the last decade. Rent growth has outpaced the national average. And Tennessee\'s lack of state income tax makes the after-tax returns more attractive than many competing markets.',
        ],
      },
      {
        heading: 'Long-term rental vs. short-term rental',
        paragraphs: [
          'Nashville\'s short-term rental (STR) regulations have tightened significantly. Only owner-occupied properties in most residential zones can operate as STRs, and enforcement has increased. Non-owner-occupied STR permits are limited and no longer being issued in many areas.',
          'For most first-time investors in 2026, long-term rentals are the more predictable play. The cash flow may be lower than a STR, but the regulatory risk is near zero and tenant demand in Nashville is strong.',
        ],
        callout: { title: 'Regulatory warning', body: 'Before purchasing any Nashville property for short-term rental use, verify the current STR permit status with Metro Nashville codes. Permit rules change frequently and violations carry significant fines.' },
      },
      {
        heading: 'How to evaluate a Nashville investment property',
        paragraphs: [
          'We evaluate investment properties on four metrics: cash-on-cash return (annual cash flow divided by total cash invested), cap rate (net operating income divided by purchase price), appreciation potential (based on neighborhood trajectory and development pipeline), and rent-to-price ratio (monthly rent divided by purchase price — look for 0.7% or higher).',
          'In Nashville\'s current market, most single-family investment properties in desirable areas will not generate strong cash flow at purchase. The play is usually appreciation plus moderate cash flow, not pure cash-flow investing.',
        ],
      },
      {
        heading: 'Best neighborhoods for Nashville investment in 2026',
        paragraphs: [
          'For appreciation: East Nashville, Wedgewood-Houston, The Nations, and Germantown continue to show the strongest price growth. These are urban neighborhoods where demand consistently exceeds supply.',
          'For cash flow: Antioch, La Vergne, Madison, and Hermitage offer lower entry points with strong rental demand. The rent-to-price ratio is more favorable in these areas.',
          'For long-term value: Gallatin, Murfreesboro, and Mt. Juliet offer suburban growth corridors where both rents and values are appreciating steadily.',
        ],
      },
      {
        heading: 'Financing investment properties',
        paragraphs: [
          'Investment property loans typically require 20-25% down and carry interest rates 0.5-1% higher than primary residence loans. DSCR (Debt Service Coverage Ratio) loans have become popular for investors — they qualify based on the property\'s rental income rather than your personal income.',
          'We work with lenders who specialize in Nashville investment properties and can structure creative financing for portfolio builders.',
        ],
      },
      {
        heading: 'Working with House Haven on investment properties',
        paragraphs: [
          'We help Nashville investors evaluate properties with the same rigor we apply to every transaction — plus the additional analysis that investment purchases require. Comps, rent estimates, expense projections, and neighborhood trajectory are all part of our process.',
          'Whether you are buying your first rental or your tenth, we bring the local knowledge that makes the difference between a good investment and a regretted one.',
        ],
      },
    ],
    relatedCommunitySlugs: ['east-nashville', 'antioch', 'madison', 'gallatin', 'wedgewood-houston'],
    relatedPostSlugs: ['nashville-market-report-april-2026', 'rent-vs-buy-nashville-2026'],
  },
]

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((p) => [p.slug, p]),
)

export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}
