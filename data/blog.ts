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
]

export const blogPostBySlug = Object.fromEntries(
  blogPosts.map((p) => [p.slug, p]),
)

export function getSortedPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )
}
