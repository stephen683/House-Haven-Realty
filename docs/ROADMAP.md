# HOUSE HAVEN REALTY — Complete Website Rebuild Roadmap
## Claude Code Build Specification v1.0
### Last Updated: April 14, 2026

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Current Site Discovery & Asset Inventory](#2-current-site-discovery--asset-inventory)
3. [Branding & Design System](#3-branding--design-system)
4. [Compliance Requirements (TAR, TREC, NAR, Fair Housing, IDX)](#4-compliance-requirements)
5. [Tech Stack & Infrastructure](#5-tech-stack--infrastructure)
6. [Site Architecture & Page Map](#6-site-architecture--page-map)
7. [Community & Neighborhood Target List (40-Mile Radius)](#7-community--neighborhood-target-list)
8. [Phase 1: Foundation — Skeleton, Branding, Compliance Shell](#phase-1)
9. [Phase 2: Core Pages — Homepage, About, Team, Contact](#phase-2)
10. [Phase 3: IDX Property Search Integration](#phase-3)
11. [Phase 4: Seller Lead Capture — Home Valuation Tool](#phase-4)
12. [Phase 5: Community Pages — Programmatic SEO Engine](#phase-5)
13. [Phase 6: New Construction Permit Map](#phase-6)
14. [Phase 7: Blog & Market Reports Engine](#phase-7)
15. [Phase 8: Buyer & Seller Journey Pages](#phase-8)
16. [Phase 9: Google Reviews & Social Proof Integration](#phase-9)
17. [Phase 10: SEO Optimization, Metadata, & Structured Data](#phase-10)
18. [Phase 11: Lead Capture Forms, CRM Integration, & Analytics](#phase-11)
19. [Phase 12: QA, Performance, Accessibility, & Launch](#phase-12)
20. [VA Operations Playbook — Past Client Referral System](#va-ops)

---

<a name="1-project-overview"></a>
## 1. PROJECT OVERVIEW

### What We're Building
A custom-built real estate website for House Haven Realty (househavenrealty.com) that replaces the current Blok-hosted template site ($300+/month) with a high-performance Next.js application designed to:

- Generate organic buyer and seller leads through deep community content and Nashville-area SEO
- Capture seller leads through a custom home valuation tool
- Attract first-time homebuyers via a new construction permit map (unique differentiator — no competitor has this)
- Cover every neighborhood, suburb, and city within a 40-mile radius of Nashville
- Display all House Haven agents with headshots and bios
- Integrate IDX/MLS listings from Realtracs via RESO Web API
- Comply fully with TREC Rule 1260-02-.12, NAR IDX Policy 7.58, TAR advertising standards, Fair Housing Act, ADA accessibility, TCPA, CAN-SPAM, and all applicable Tennessee housing law
- Operate on Next.js + Supabase + Vercel at approximately $150-250/month total infrastructure cost

### Who Is Building This
Claude Code, operating from this specification document. The human (Stephen Delahoussaye, broker/owner) will provide access credentials, approve major design decisions, and handle domain DNS changes. All other work — design, code, copy, asset collection, compliance implementation — should be handled by Claude Code referencing this document.

### Non-Negotiable Requirements
1. **Zero assumptions** — every data point, compliance rule, and design decision in this document is sourced from research or the current live site
2. **Brand-accurate** — must match House Haven Realty's existing visual identity (colors, logo, typography, voice)
3. **Legally compliant** — TREC, NAR, TAR, Fair Housing, ADA, TCPA, CAN-SPAM — all requirements specified in Section 4
4. **Agent-complete** — all current team members with headshots pulled from the live site
5. **Community-exhaustive** — every target community within 40 miles gets a dedicated page
6. **Mobile-first** — responsive design, Core Web Vitals optimized, sub-2-second load times
7. **Lead-generating** — every page has a contextual conversion mechanism

---

<a name="2-current-site-discovery--asset-inventory"></a>
## 2. CURRENT SITE DISCOVERY & ASSET INVENTORY

### Current Platform
- **Platform:** Blok (Real Estate Production Company) — uses Chime/AgentA backend
- **Domain:** househavenrealty.com
- **Secondary domain:** househavengroup.com (Compass page — may be deprecated)
- **Monthly cost:** $300+/month
- **IDX Provider:** Chime IDX (pulls from Realtracs MLS)

### Logo & Brand Assets (URLs to scrape)
```
Logo (SVG, dark version): https://media.agentaprd.com/sites/213/house-haven-logo-dark.svg
Home icon/spinner: https://media.agentaprd.com/sites/213/home-icon.svg
Equal Housing logo: https://extassets.agentaprd.com/agenta/logos/realtor-equal-housing-opportunity.png
RealTracs IDX badge: https://cdn.chime.me/image/fs/cmsbuild/2022428/17/original_6558b8ec-c163-4525-8dd3-80d5099a6f3b.png
```

### Team Members (with headshot URLs to scrape)
```
1. Stephen Delahoussaye — Broker | Owner
   Headshot: https://media.agentaprd.com/sites/213/BQXPwDi7x8QXhtLq9sNIHxFrNatzeVTpTA.webp
   Bio page: https://househavenrealty.com/meet-stephen-delahoussaye/
   Email: Stephen@househavenrealty.com
   Phone: (615) 624-4766 (also (615) 604-9785)

2. Camil Medina — Director of Operations
   Headshot: https://media.agentaprd.com/sites/213/Camil-hs.webp
   Bio page: https://househavenrealty.com/meet-camil-medina/

3. Sarah Harris — Transaction Coordinator
   Headshot: https://media.agentaprd.com/sites/213/sarah-headshot.webp
   Bio page: https://househavenrealty.com/meet-sarah-harris/

4. Olivia Mortensen — REALTOR® (marked "hidden" on current site — confirm with Stephen whether to include)
   Headshot: https://media.agentaprd.com/sites/213/olivia-headshot.webp
   Bio page: https://househavenrealty.com/meet-olivia-mortensen/

5. James Belote — REALTOR®
   Headshot: https://media.agentaprd.com/sites/213/james-belote-portrait.webp
   Bio page: https://househavenrealty.com/meet-james-belote/

6. Josh Zehring — REALTOR®
   Headshot: https://media.agentaprd.com/sites/213/josh-headshot-1.webp
   Bio page: https://househavenrealty.com/meet-josh-zehring/

7. Matthew Valluzzi — REALTOR®
   Headshot: https://media.agentaprd.com/sites/213/matthew-valluzzi.webp
   Bio page: https://househavenrealty.com/meet-matthew-valluzzi/

8. Amber Bouldin — REALTOR®
   Headshot: https://media.agentaprd.com/sites/213/amber-bouldin-headshot.webp
   Bio page: https://househavenrealty.com/meet-amber-bouldin/

9. Chuck Starks — REALTOR®
   Headshot: https://media.agentaprd.com/sites/213/chuck-starks-headshot.webp
   Bio page: https://househavenrealty.com/meet-chuck-starks/

10. Philip Elliott — REALTOR®
    Headshot: https://media.agentaprd.com/sites/213/Philip-Elliott-hs.webp
    Bio page: https://househavenrealty.com/meet-philip-elliott/

11. Maria Morales — Digital Operations Manager
    Headshot: https://media.agentaprd.com/sites/213/maria-morales-headshot.webp
    Bio page: https://househavenrealty.com/meet-maria-morales
```

**IMPORTANT:** Claude Code must scrape each headshot URL and each bio page to download images AND extract individual bio text. Do NOT use placeholder text. Extract the actual bios from each agent's page on the current site.

### Business Information
```
Brokerage Name: House Haven Realty
Broker/Owner: Stephen Delahoussaye
Office Address: 5016 Centennial Blvd Suite 200, Nashville, TN 37209
(Note: Stephen references "THE DOJO" as new office — also referenced as 1033 Demonbreun St, Brentwood, TN on Facebook. CONFIRM which address to use with Stephen.)
Phone: (615) 624-4766
Email: Stephen@househavenrealty.com
Facebook: https://www.facebook.com/stephen.delahoussaye (page: /218543425183800/)
Instagram: https://www.instagram.com/househavenrealty/
LinkedIn: https://www.linkedin.com/company/house-haven-realty-nashville
Apparel Store: https://househaven.oakandtwine.com/
```

### Key Stats (from Homes.com profile)
```
219 Closed Sales (prior 5 years)
$124.2M Total Value
$150K - $5.3M Price Range
$567.3K Average Price
Licensed since 2016
Gold Award of Excellence — Greater Nashville Realtors
25M+ year over year sales
```

### Client Testimonials (from current site — use verbatim)
```
1. "As a first time home buyer I was nervous and intimidated to begin the home buying process. Stephen quickly calmed my nerves with his wealth of knowledge and approachable attitude. We found the perfect home for me and due to some road blocks during the closing process, Stephen advocated for me every step of the way! 10/10 would recommend!" — Kelly V.

2. "My husband and I can't even begin to explain how hard working, kind, and helpful Stephen is. Not only is he available at all hours, but he is more than elated to walk you through the process of buying a home, loving your home, and won't stop until you're happy. Even months later after purchasing our home, Stephen is still answering our questions! There's no better realtor in Tennessee, we swear by it." — Grace G.

3. "Stephen is professional, extremely knowledgeable, super friendly, and such a genuine person all around. He helped my husband and I get our dream home basically without lifting any fingers and answered all the questions we had in a timely manner. If you need a Realtor®, Stephen is definitely your guy!" — Emily L.

4. "Working with Stephen was truly the best experience. Of course, every closing has its challenges, but Stephen, Sarah and their team made this otherwise discouraging process enjoyable. Their attention to detail, responsiveness and overall joyful personalities created a professional and pleasant environment. I highly recommend!" — Catherine S.

5. "Stephen is a joy to work with. He is energetic, hilarious, and so on-top of things. He works fast, and is extremely realistic about managing expectations while also trying to get you the best home for the best deal. I would recommend him to any friends and family. Thank you so much, Stephen!" — Julia P.

6. "Stephen is very professional and friendly! He helped us sell our townhome in two weeks, and guided us tremendously in getting a new construction built! Kellie was awesome as well! My wife and I loved working with them! Would recommend to anyone." — Chris K.

7. "Stephen is an amazing agent we used him for 2 transactions in less than a year. He goes above and beyond with his level of communication and detail, I ask a lot of questions and he answered all of them; if he did not know the answer he worked to find the information ASAP. He has great relationships with contractors and service providers. Stephen will be our agent on all TN real estate transactions!" — Chris D.
```

### Current Navigation Structure (to preserve/enhance)
```
Find Your Home → Map Search, Featured Listings, Featured Communities, Market Reports
Buyers → The Buying Process, Tools for Buyers, Mortgage Calculator
Sellers → Selling Your Home, Staging Checklist, What's My Home Worth?
Property Management (links to doorcollectors.com)
About → Meet The Team, Follow Us, Join Our Team
househaven Apparel Store (external: househaven.oakandtwine.com)
Contact
Login/Register
```

### Brand Voice (extracted from current site and NashvilleVoyager interview)
```
Tone: Personal, warm, family-feel, approachable but professional
Tagline implicit: "Our clients are our neighbors"
Key phrases used:
- "going above and beyond to meet and exceed your expectations"
- "partner with you every step of the way"
- "never left in the dark"
- "clients walk away feeling more like friends or family rather than a transaction"
- "Rent Less, Own More!" (FTHB initiative, created 2019)
Identity: "small boutique local Nashville real estate brokerage"
- "no plans to grow out of that"
- "We are a family"
- "We volunteer once a month in our communities"
```

---

<a name="3-branding--design-system"></a>
## 3. BRANDING & DESIGN SYSTEM

### Color Palette
Extract exact colors from the current site's SVG logo and CSS. Based on crawl:
```
Primary Dark (logo/text): #1a1a2e or similar dark navy/black — EXTRACT FROM SVG
Accent: Determine from logo SVG — likely a warm accent
Background: Clean white (#FFFFFF)
Text: Dark charcoal (#1a1a1a or #2d2d2d)
```

**PROMPT FOR CLAUDE CODE:**
```
Download the logo SVG from https://media.agentaprd.com/sites/213/house-haven-logo-dark.svg
Parse the SVG XML to extract all fill/stroke color values.
Use these exact colors as the brand palette.
If the logo uses only 1-2 colors, supplement with:
- A warm accent for CTAs (derive from logo accent or use a sophisticated warm tone)
- Light gray for backgrounds (#F8F9FA)
- Success green for trust indicators (#2E7D32)
Create a Tailwind config extending these as custom colors under 'househaven' namespace.
```

### Typography
Current site uses system fonts. For the rebuild, use:
```
Headings: A distinctive serif or semi-serif that conveys trust and sophistication (research: top luxury real estate sites use serifs for authority)
Body: Clean, highly-readable sans-serif
DO NOT USE: Inter, Roboto, Arial, system-ui
Recommended exploration: Playfair Display + Source Sans Pro, or DM Serif Display + DM Sans
Load via Google Fonts with font-display: swap for performance
```

### Design Direction
```
NOT a template. NOT generic real estate. This should feel like:
- A boutique firm with personality (matches "small boutique local" identity)
- Trustworthy and established (219 sales, $124M+ volume)
- Nashville-local (not corporate, not national-franchise feel)
- Modern but warm (not cold/techy, not cluttered)
- Photo-forward where possible
- Generous whitespace
- Subtle animations on scroll (intersection observer based, not heavy)
```

---

<a name="4-compliance-requirements"></a>
## 4. COMPLIANCE REQUIREMENTS

### TREC Rule 1260-02-.12 — Tennessee Internet Advertising
**These are legally mandatory. Non-compliance = fines up to $1,000 per infraction or license suspension.**

1. **Firm name on every page:** "House Haven Realty" must conspicuously appear on each page of the website. (TREC 1260-02-.12(5)(a))
2. **Firm phone number on every page:** The firm telephone number registered with TREC must appear on each page. (TREC 1260-02-.12(5)(a))
3. **Individual licensee names:** Must appear exactly as licensed with TREC. Do not use nicknames or shortened names unless that is the registered name.
4. **Licensee name size:** Agent names must not appear larger than the firm name in any display.
5. **IDX disclaimer on listing pages:** Each page displaying listings from an outside database must include a statement that some or all listings may not belong to the firm. (TREC 1260-02-.12(5)(b))
6. **Not false/misleading/deceptive:** No advertisement may be false, misleading, or deceptive in any manner.
7. **Indicate real estate business:** All advertising must indicate the licensee is engaged in the real estate business.
8. **Principal broker supervision:** All advertising requires direct supervision by the principal broker (Stephen).

**Implementation:** Create a `<SiteFooter>` component and a `<ComplianceBanner>` component that automatically inject the firm name and phone number on every page. These must be rendered server-side (not client-only) to ensure they appear in the HTML source.

### NAR IDX Policy 7.58 — Internet Data Exchange
**Required for displaying MLS listings:**

1. **Brokerage identification:** The display must clearly identify House Haven Realty in a readily visible color and typeface.
2. **Listing attribution:** Each listing must display the name of the listing agent or listing broker.
3. **Data accuracy disclaimer:** Include a notice that data is deemed reliable but not guaranteed accurate by the MLS.
4. **Copyright notice:** Display Realtracs/MLS copyright notice per their specific requirements.
5. **Last updated timestamp:** Show when listing data was last refreshed.
6. **Opt-out compliance:** Do not display listings where sellers have directed their listing broker to withhold from IDX.
7. **No scraping/redistribution:** IDX data may not be used for any purpose other than IDX display.
8. **Delayed marketing listings:** Respect delayed marketing exemptions per the 2025-2026 Multiple Listing Options for Sellers policy.

**Implementation:** Create an `<IDXDisclaimer>` component rendered on every page that displays MLS data. Include Realtracs-specific copyright text. Example:
```
"Listings marked with the Realtracs logo are provided courtesy of the Realtracs MLS. 
Information is deemed reliable but not guaranteed. 
© [YEAR] Realtracs, Inc. All rights reserved."
```

### NAR Settlement Practice Changes (Effective August 2024)
1. **No offers of compensation in MLS:** The site must not display buyer agent compensation amounts from MLS data.
2. **Written buyer representation:** If the site collects buyer leads who want to tour properties, include language about buyer representation agreements being required before touring.

### Fair Housing Act Compliance
1. **Equal Housing Opportunity logo:** Must appear on the site (already on current site footer).
2. **No discriminatory language:** All copy must avoid references to race, color, religion, sex, national origin, familial status, or disability in property descriptions or neighborhood descriptions.
3. **Neighborhood descriptions:** When writing community pages, describe amenities, commute times, schools, and lifestyle — NEVER demographics, ethnic composition, or language that could be construed as steering.
4. **Images:** Use diverse imagery. Do not select images that suggest preference for or exclusion of any protected class.

**Implementation:** Create a `<FairHousingBadge>` component for the footer. Add a content review checklist for all community page copy.

### ADA Accessibility (WCAG 2.1 Level AA)
Real estate websites are increasingly targeted by ADA lawsuits. Implement:
1. All images must have descriptive alt text
2. Color contrast ratios must meet AA standards (4.5:1 for normal text, 3:1 for large text)
3. All interactive elements must be keyboard-navigable
4. Form inputs must have associated labels
5. Skip navigation links
6. ARIA landmarks on major page sections
7. Focus management on modal/overlay interactions

### TCPA & CAN-SPAM (Lead Capture)
1. **Consent language on all forms:** "I agree to be contacted by House Haven Realty via call, email, and text. To opt-out, you can reply 'stop' at any time or click the unsubscribe link in the emails. Message frequency may vary. Message and data rates may apply."
2. **Privacy policy link** on every form
3. **Unsubscribe mechanism** in all automated emails
4. **Physical address** in email footers

### Tennessee Property Disclosure
1. Site must not make guarantees about property conditions
2. Include appropriate disclaimers on any property analysis or valuation tools
3. Home valuation tool must include: "This is an automated estimate and should not be considered an appraisal. Contact us for a professional Comparative Market Analysis."

---

<a name="5-tech-stack--infrastructure"></a>
## 5. TECH STACK & INFRASTRUCTURE

### Core Stack
```
Framework: Next.js 14+ (App Router)
Language: TypeScript
Database: Supabase (PostgreSQL + PostGIS for geo queries)
Hosting: Vercel (Pro plan, $20/month)
Styling: Tailwind CSS v3+
Maps: MapLibre GL JS (open-source, same as Permighty)
```

### External APIs & Services
```
MLS/IDX Data: SimplyRETS API ($49/month) — OR — Realtracs RESO Web API via MLS Grid ($5/month feed fee)
  → Stephen already has MLS access through his broker license
  → SimplyRETS provides a clean REST API purpose-built for custom Next.js sites
  → Evaluate both; SimplyRETS is faster to integrate, RESO API is cheaper ongoing

Home Valuations: HouseCanary API ($79-199/month) — OR — RentCast API (free tier: 50 calls/month, then $39-99/month)
  → HouseCanary: 3.1% median error rate, 136M+ properties
  → RentCast: 140M+ properties, developer-friendly REST API, more affordable

Permit Data: Nashville Open Data Portal (data.nashville.gov) — FREE
  → Socrata/SODA API for building permits
  → Same approach used in Permighty for STR permits
  → Endpoint: https://data.nashville.gov/resource/96ap-mfmf.json (Building Permits Issued)

Google Reviews: Google Places API (embed reviews on site)
  → OR use a server-side fetch to pull reviews and cache in Supabase

Email: Resend ($0-20/month) — same as Permighty
Analytics: Google Analytics 4 + Google Search Console
Fonts: Google Fonts (free)
Images: Vercel Image Optimization (included in hosting)
```

### Estimated Monthly Cost
```
Vercel Pro:         $20/month
Supabase Pro:       $25/month
SimplyRETS:         $49/month (or MLS Grid at $5/month)
HouseCanary:        $79/month (or RentCast at $0-39/month)
Resend:             $0-20/month
Google APIs:        $0-20/month (Maps, Places)
Domain (renewal):   ~$1/month amortized
──────────────────────────────
TOTAL:              $174-214/month (vs $300+/month current)
```

### Repository Structure
```
househaven-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with compliance components
│   ├── page.tsx                  # Homepage
│   ├── about/
│   │   └── page.tsx
│   ├── team/
│   │   ├── page.tsx              # Meet the Team
│   │   └── [slug]/page.tsx       # Individual agent pages
│   ├── communities/
│   │   ├── page.tsx              # All communities index
│   │   └── [slug]/page.tsx       # Individual community pages (programmatic)
│   ├── homes-for-sale/
│   │   ├── page.tsx              # IDX search
│   │   └── [id]/page.tsx         # Individual listing detail
│   ├── buyers/
│   │   └── page.tsx
│   ├── sellers/
│   │   └── page.tsx
│   ├── home-valuation/
│   │   └── page.tsx              # "What's My Home Worth?" lead capture
│   ├── new-construction/
│   │   └── page.tsx              # Permit map (flagship differentiator)
│   ├── blog/
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Individual posts
│   ├── market-reports/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── property-management/
│   │   └── page.tsx              # Links to Door Collectors
│   └── api/
│       ├── listings/route.ts     # IDX API proxy
│       ├── valuation/route.ts    # Home valuation API proxy
│       ├── permits/route.ts      # Nashville permit data API proxy
│       ├── contact/route.ts      # Lead capture form handler
│       └── reviews/route.ts      # Google Reviews cache
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx            # Includes TREC compliance
│   │   ├── ComplianceBanner.tsx   # Firm name + phone on every page
│   │   └── Navigation.tsx
│   ├── listings/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertySearch.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── IDXDisclaimer.tsx      # NAR/Realtracs compliance
│   │   └── SearchFilters.tsx
│   ├── community/
│   │   ├── CommunityHero.tsx
│   │   ├── CommunityStats.tsx
│   │   ├── CommunityListings.tsx
│   │   └── CommunityMap.tsx
│   ├── permits/
│   │   ├── PermitMap.tsx          # MapLibre new construction map
│   │   ├── PermitCard.tsx
│   │   └── PermitFilters.tsx
│   ├── forms/
│   │   ├── ContactForm.tsx
│   │   ├── HomeValuationForm.tsx
│   │   ├── NewsletterSignup.tsx
│   │   └── TCPAConsent.tsx        # Reusable consent checkbox
│   ├── team/
│   │   ├── AgentCard.tsx
│   │   └── AgentProfile.tsx
│   ├── reviews/
│   │   ├── TestimonialCarousel.tsx
│   │   └── GoogleReviews.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       └── ...
├── lib/
│   ├── simplyrets.ts             # IDX API client
│   ├── housecanary.ts            # Valuation API client
│   ├── permits.ts                # Nashville permit data client
│   ├── supabase.ts               # Supabase client
│   ├── google-reviews.ts         # Google Places API client
│   └── communities.ts            # Community data & content
├── data/
│   ├── communities/              # JSON/MDX files for each community
│   │   ├── joelton.mdx
│   │   ├── hendersonville.mdx
│   │   ├── greenbrier.mdx
│   │   └── ...
│   ├── team.ts                   # Agent data array
│   └── testimonials.ts           # Testimonial data
├── public/
│   ├── images/
│   │   ├── logo-dark.svg
│   │   ├── logo-light.svg
│   │   ├── team/                 # Agent headshots
│   │   ├── communities/          # Community hero images
│   │   └── icons/
│   ├── equal-housing-opportunity.png
│   └── realtracs-logo.png
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

<a name="6-site-architecture--page-map"></a>
## 6. SITE ARCHITECTURE & PAGE MAP

### Primary Navigation
```
Home
Find Homes → Property Search | New Construction Map | Featured Listings | Market Reports
Communities → [All Communities Index] → [Individual Community Pages]
Buyers → The Buying Process | Mortgage Calculator
Sellers → Selling Your Home | What's My Home Worth?
About → Meet The Team | Our Story
Blog
Contact
```

### Every Page Must Include
1. `<Header>` with logo, navigation, firm phone number
2. `<ComplianceBanner>` (can be integrated into header/footer) showing "House Haven Realty | (615) 624-4766"
3. `<Footer>` with:
   - House Haven Realty firm name
   - Office address
   - Phone number
   - Email
   - Social links (Facebook, Instagram, LinkedIn)
   - Equal Housing Opportunity logo
   - REALTOR® logo (if NAR member)
   - Privacy Policy link
   - Terms of Service link
   - Sitemap link
   - Copyright notice: "© [YEAR] House Haven Realty. All rights reserved."
   - IDX disclaimer (on pages with listings): Realtracs copyright and data accuracy notice
   - TREC compliance text

### Lead Capture Touchpoints (by page type)
```
Homepage: Newsletter signup + "Find Your Home" CTA + "What's My Home Worth?" CTA
Property Search: Save search (requires account creation) + Contact agent on listing
Community Pages: "Want to learn more about [Community]? Let's chat." contact form
Home Valuation: Address input → instant estimate → full CMA requires contact info
New Construction Map: "Get alerts for new construction in [area]" → email capture
Blog: Newsletter signup + related listings sidebar
Contact: Full contact form
Every page: Floating "Schedule a Consultation" button or sticky CTA
```

---

<a name="7-community--neighborhood-target-list"></a>
## 7. COMMUNITY & NEIGHBORHOOD TARGET LIST (40-MILE RADIUS)

### Methodology
Starting from Nashville's center (36.1627° N, 86.7816° W), these are all communities, suburbs, and neighborhoods within approximately 40 miles that should receive dedicated pages. Organized by county and SEO competition level.

### TIER 1 — Low Competition, Build First (no agent owns original content)
These suburbs have virtually NO independent agent content ranking. Portals dominate. Original content here ranks fastest.

```
Davidson County (within Nashville):
- Joelton (37080) — rural feel, 20 min from downtown, Beaman Park, I-24 access
- Bordeaux / Brick Church Pike (37208, 37207) — heavy new construction, FTHB market
- Whites Creek (37189) — rural Davidson County, affordable
- Madison (37115) — revitalizing, commercial growth on Gallatin Pike
- Inglewood (37216) — affordable, up-and-coming

Cheatham County:
- Ashland City (37015) — county seat, growing, 25 min from Nashville
- Pegram (37143) — small town, rural charm
- Kingston Springs (37082) — Harpeth River, small community

Robertson County:
- Greenbrier (37073) — small town, growing, very affordable
- Springfield (37172) — county seat, 30 min from Nashville, major growth
- White House (37188) — straddles Robertson/Sumner, growing suburb
- Coopertown (37047) — small, rural

Dickson County:
- Dickson (37055) — 45 min from Nashville, affordable, growing
- Burns (37029) — small, rural, affordable land
- Charlotte (37036) — county seat, small town

Williamson County (affordable edges):
- Fairview (37062) — western Williamson, more affordable than Franklin
- Thompsons Station (37179) — rapid growth, new construction

Wilson County:
- Watertown (37184) — small, affordable
- Lebanon (37087) — growing, I-40 corridor
```

### TIER 2 — Medium Competition, Build Second (some agent content exists, still winnable)
```
Sumner County:
- Hendersonville (37075) — Old Hickory Lake, major suburb (Gary Ashton has pages but template-level)
- Gallatin (37066) — county seat, growing rapidly
- Goodlettsville (37072) — straddles Davidson/Sumner, I-65 corridor
- Portland (37148) — northern Sumner, affordable

Davidson County (Nashville neighborhoods):
- Donelson (37214) — near BNA airport, growing
- Hermitage (37076) — Percy Priest Lake, established suburb
- Antioch (37013) — diverse, affordable, massive new construction
- Bellevue (37221) — west Nashville, family-oriented
- Old Hickory (37138) — lakefront, established

Rutherford County:
- Murfreesboro (37127, 37128, 37129, 37130) — major city, MTSU, rapid growth
- Smyrna (37167) — Nissan HQ, growing
- La Vergne (37086) — affordable, I-24 corridor

Williamson County:
- Franklin (37064, 37067, 37069) — affluent, historic downtown
- Brentwood (37027) — affluent, top schools
- Nolensville (37135) — rapid new construction growth
- Spring Hill (37174) — one of fastest-growing cities in TN
```

### TIER 3 — Higher Competition, Build Later (strong agent content already exists)
```
Nashville Core Neighborhoods:
- East Nashville (37206, 37216) — NestingInNashville and others rank
- Germantown (37208) — multiple agents rank
- The Gulch (37203)
- 12 South (37204)
- Sylvan Park (37209)
- Green Hills (37215)
- Berry Hill (37204)
- Melrose (37204)
- Wedgewood-Houston (37204, 37210)
- Edgehill / Music Row (37203)
- Hillsboro Village (37212)
- West End / Midtown (37203)
- Salemtown / Germantown (37208)
- Nations / West Nashville (37209)
- Lockeland Springs (37206)
```

### Total Community Pages to Build: ~65-80 pages
- Phase 1 (Tier 1): ~20 pages — build in weeks 5-8
- Phase 2 (Tier 2): ~25 pages — build in weeks 9-14
- Phase 3 (Tier 3): ~20 pages — build in weeks 15-20

---

<a name="phase-1"></a>
## PHASE 1: FOUNDATION — Skeleton, Branding, Compliance Shell

### Timeline: Week 1-2

### Claude Code Prompt — Phase 1:

```
You are building a custom real estate website for House Haven Realty, a boutique Nashville brokerage.

STEP 1: Initialize the project
- Create a new Next.js 14 App Router project with TypeScript
- Install dependencies: tailwindcss, @supabase/supabase-js, maplibre-gl, lucide-react, next-mdx-remote, framer-motion
- Configure Tailwind with custom brand colors (extract from the logo SVG)
- Set up the repository structure as specified in Section 5 of the roadmap

STEP 2: Download all brand assets
- Download the logo SVG from: https://media.agentaprd.com/sites/213/house-haven-logo-dark.svg
  Save to: public/images/logo-dark.svg
- Download the Equal Housing Opportunity logo from: https://extassets.agentaprd.com/agenta/logos/realtor-equal-housing-opportunity.png
  Save to: public/images/equal-housing-opportunity.png
- Download ALL team headshots (11 images) from the URLs listed in Section 2, save to public/images/team/[name].webp

STEP 3: Extract brand colors from the logo SVG
- Parse the SVG file to find all color values (fill, stroke attributes)
- Configure tailwind.config.ts with these extracted colors as the brand palette
- Add supplementary colors: white (#FFFFFF), light gray (#F8F9FA), dark text (#1C1C1C), success green (#2E7D32)

STEP 4: Set up Google Fonts
- Choose two complementary fonts:
  - Heading font: A distinctive serif (suggestions: Playfair Display, Cormorant Garamond, or Libre Baskerville)
  - Body font: A clean sans-serif (suggestions: Source Sans 3, DM Sans, or Outfit)
- Configure in next/font/google with font-display: swap
- DO NOT USE: Inter, Roboto, Arial, or system fonts

STEP 5: Build the compliance-first layout components

Create app/layout.tsx (Root Layout):
- Include the HTML lang="en" attribute
- Include meta viewport for mobile
- Wrap all pages with <Header> and <Footer>
- Include skip-to-content link for ADA compliance

Create components/layout/Header.tsx:
- Logo (link to homepage)
- Desktop navigation matching the navigation structure in Section 6
- Mobile hamburger menu (accessible, keyboard-navigable)
- Phone number: (615) 624-4766 (visible on desktop, click-to-call on mobile)
- "Contact Us" CTA button

Create components/layout/Footer.tsx — THIS IS CRITICAL FOR COMPLIANCE:
- Must include ALL of the following (TREC 1260-02-.12 mandate):
  * "House Haven Realty" — firm name, prominently displayed
  * "(615) 624-4766" — firm phone number
  * Office address: "5016 Centennial Blvd Suite 200, Nashville, TN 37209"
  * Email: "Stephen@househavenrealty.com"
  * Social links: Facebook, Instagram, LinkedIn (use URLs from Section 2)
  * Equal Housing Opportunity logo + text "Equal Housing Opportunity"
  * Copyright: "© 2026 House Haven Realty. All rights reserved."
  * Links to: Privacy Policy, Terms of Service, Sitemap
  * This text (or similar, covering TREC requirement): 
    "House Haven Realty | 5016 Centennial Blvd Suite 200, Nashville, TN 37209 | (615) 624-4766 | Stephen@househavenrealty.com | Licensed by the Tennessee Real Estate Commission"

Create components/layout/IDXDisclaimer.tsx:
- Conditionally rendered on pages displaying MLS data
- Text: "Listings marked with the Realtracs logo are provided courtesy of the Realtracs MLS, a licensed trademark of Realtracs, Inc. Information is deemed reliable but not guaranteed. © [CURRENT_YEAR] Realtracs, Inc. All rights reserved. Last updated: [TIMESTAMP]."
- Include Realtracs logo image

Create components/forms/TCPAConsent.tsx:
- Reusable checkbox component for all lead capture forms
- Text: "I agree to be contacted by House Haven Realty via call, email, and text. To opt-out, you can reply 'stop' at any time or click the unsubscribe link in the emails. Message frequency may vary. Message and data rates may apply. Privacy Policy"
- Privacy Policy must be a working link
- Checkbox must be checked before form submission is allowed

STEP 6: Create placeholder pages
Create the following route files with placeholder content (just a heading and the layout):
- app/page.tsx (Homepage)
- app/about/page.tsx
- app/team/page.tsx
- app/communities/page.tsx
- app/homes-for-sale/page.tsx
- app/buyers/page.tsx
- app/sellers/page.tsx
- app/home-valuation/page.tsx
- app/new-construction/page.tsx
- app/blog/page.tsx
- app/market-reports/page.tsx
- app/contact/page.tsx
- app/property-management/page.tsx
- app/privacy-policy/page.tsx
- app/terms-of-service/page.tsx

STEP 7: Verify compliance
After building, verify:
- [ ] "House Haven Realty" appears on every page
- [ ] "(615) 624-4766" appears on every page
- [ ] Equal Housing Opportunity logo appears in footer
- [ ] TCPA consent language is in the forms component
- [ ] All navigation links work
- [ ] Mobile menu functions correctly
- [ ] Skip-to-content link exists
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
```

---

<a name="phase-2"></a>
## PHASE 2: CORE PAGES — Homepage, About, Team, Contact

### Timeline: Week 2-3

### Claude Code Prompt — Phase 2:

```
You are continuing the House Haven Realty website build. Phase 1 (skeleton, branding, compliance) is complete.

STEP 1: Build the Homepage (app/page.tsx)

The homepage must communicate THREE things immediately:
1. We're Nashville's boutique real estate team
2. We cover Nashville AND all surrounding communities
3. You can search homes, get your home's value, or explore communities

Hero Section:
- Full-width hero with a high-quality Nashville skyline or neighborhood image
  (Use a royalty-free Nashville image from Unsplash. Search "nashville skyline" or "nashville neighborhood")
  Download and save to public/images/hero/
- Overlay text:
  Headline: "Your Nashville Neighbor in Real Estate"
  Subheadline: "Helping families buy, sell, and invest across Nashville and Middle Tennessee since 2016."
- TWO CTA buttons: "Find Your Home" (links to /homes-for-sale) | "What's My Home Worth?" (links to /home-valuation)
- Below hero: A subtle "search bar" component where users can type an address or city name

Featured Listings Section:
- Display 6-8 featured/active listings
- For now, use placeholder cards with the structure: Image, Address, Price, Beds/Baths/SqFt, "Listed by [Agent] of House Haven Realty"
- Include Realtracs IDX disclaimer below the section
- When IDX is integrated (Phase 3), this will pull from SimplyRETS API

Communities Section:
- Heading: "Explore Our Communities"
- Subheading: "From urban Nashville neighborhoods to peaceful Middle Tennessee suburbs — we're your local experts within a 40-mile radius."
- Grid of 8-12 community cards with:
  - Community name
  - Brief tagline (e.g., "Joelton — Country Living, City Close")
  - Link to /communities/[slug]
- "View All Communities" button linking to /communities

Testimonials Section:
- Use the 7 testimonials from Section 2 verbatim
- Implement as a carousel/slider or a staggered grid
- Include the client first name and last initial (Kelly V., Grace G., etc.)
- Design should feel personal and warm

New Construction Map Teaser Section:
- Heading: "See What's Being Built Near You"
- Subheading: "Our exclusive new construction map shows every active building permit in the Nashville area — so you can find your next home before it hits the market."
- A preview image or simplified map graphic
- CTA: "Explore the Map" (links to /new-construction)
- This is the UNIQUE DIFFERENTIATOR — make it visually prominent

Meet the Team Teaser:
- Heading: "Meet House Haven"
- 3-4 agent headshots in a row with names and titles
- "Meet the Full Team" button linking to /team

Newsletter Signup:
- Heading: "Stay in the Know"
- Subheading: "Get Nashville market updates, new listings, and insider tips delivered to your inbox."
- Email input field + submit button
- TCPA consent checkbox (use the TCPAConsent component)

STEP 2: Build the About Page (app/about/page.tsx)

Content source: Extract from NashvilleVoyager interview and current site. Use this copy:

"House Haven Realty is a small boutique local Nashville real estate brokerage. We help our community find and sell their dream homes, but we are so much more than that. Our brokerage is small and local and has no plans to grow out of that. We are a family, centered upon helping each other as agents and growing together. We volunteer once a month in our communities and never lose focus on the city that we love and strive to make better every day."

Additional bio for Stephen (from NashvilleVoyager):
"My story is one of discovery. I started out pursuing a career in Physical Therapy because of my passion for health and wellness. But while attending the University of Tennessee at Chattanooga, I interned at Vanderbilt Bone and Joint Clinic and soon discovered it wasn't necessarily the science I was passionate about, but more so the people. This connection with people and the ability to add value in any way possible is what actually brought me to real estate."

Include stats section:
- 219+ Closed Sales
- $124.2M+ in Total Volume  
- $150K - $5.3M Price Range
- Since 2016

Include "Rent Less, Own More!" initiative description:
"In 2019, Stephen created an exciting initiative called Rent Less, Own More! with the goal of empowering first-time home buyers with the right tools and knowledge to make the home buying process smooth, simple and fun."

STEP 3: Build the Team Page (app/team/page.tsx and app/team/[slug]/page.tsx)

Scrape each agent's individual bio page from the current site to get their full bio text.
Display all 11 team members (or 10, excluding Olivia if she's marked hidden — add a TODO comment).

Team index page:
- Grid of agent cards with headshot, name, title
- Each card links to /team/[slug]

Individual agent pages:
- Large headshot
- Full bio text (scraped from current site)
- Contact info
- Active listings by this agent (placeholder until IDX Phase 3)

STEP 4: Build the Contact Page (app/contact/page.tsx)

- Office address with embedded Google Map
- Phone: (615) 624-4766
- Email: Stephen@househavenrealty.com
- Contact form with fields: Name, Email, Phone, Message, "I'm interested in..." dropdown (Buying, Selling, Investing, Property Management, Other)
- TCPA consent checkbox
- Social media links
```

---

<a name="phase-3"></a>
## PHASE 3: IDX PROPERTY SEARCH INTEGRATION

### Timeline: Week 3-4

### Prerequisites
- Stephen must provide SimplyRETS API credentials OR Realtracs RESO Web API access
- Stephen must confirm IDX compliance requirements specific to Realtracs MLS

### Claude Code Prompt — Phase 3:

```
You are integrating MLS/IDX property search into the House Haven Realty website.

API OPTION A — SimplyRETS (recommended for speed):
- Documentation: https://docs.simplyrets.com/
- Endpoints: GET /properties (search), GET /properties/{mlsId} (detail)
- Authentication: HTTP Basic Auth with API key
- Create lib/simplyrets.ts with typed API client
- Implement server-side data fetching with ISR (revalidate every 15 minutes for search, 5 minutes for individual listings)

API OPTION B — Realtracs RESO Web API via MLS Grid:
- Documentation: https://docs.mlsgrid.com/
- RESO Web API standard endpoints
- OAuth2 authentication
- Create lib/mlsgrid.ts with typed API client

SEARCH PAGE (app/homes-for-sale/page.tsx):
- Search filters:
  * Location (city, ZIP, address, neighborhood)
  * Price range (min/max)
  * Bedrooms (1+, 2+, 3+, 4+, 5+)
  * Bathrooms (1+, 2+, 3+)
  * Property type (Single Family, Condo, Townhouse, Multi-Family, Land)
  * Square footage range
  * Year built range
  * Sort by: Price (low/high), Newest, Beds, SqFt
- Results display as responsive grid of property cards
- Property cards show: Photo, Price, Address, Beds/Baths/SqFt, Days on Market, Listing Agent
- Map view toggle (MapLibre GL JS showing property pins)
- Pagination (20 results per page)
- "Save Search" button (requires account — store in Supabase)

LISTING DETAIL PAGE (app/homes-for-sale/[id]/page.tsx):
- Photo gallery (carousel with lightbox)
- Property details: Price, Address, Beds, Baths, SqFt, Year Built, Lot Size, Property Type
- Description (from MLS)
- Features list
- Map showing location
- "Schedule a Showing" form (name, email, phone, preferred date/time, TCPA consent)
- "Request More Info" form
- Listing attribution: "Listed by [Listing Agent] of [Listing Office]" — REQUIRED by NAR IDX policy
- IDX disclaimer (use IDXDisclaimer component)
- Nearby listings ("Similar Homes in [City/Neighborhood]")
- Mortgage calculator widget

IDX COMPLIANCE CHECKLIST:
- [ ] Every listing page displays listing agent/office name
- [ ] Realtracs copyright notice on all listing pages
- [ ] "Information deemed reliable but not guaranteed" disclaimer
- [ ] Last updated timestamp shown
- [ ] No display of buyer agent compensation
- [ ] "House Haven Realty" firm name visible on all listing pages
- [ ] Listings honor seller opt-out/delayed marketing preferences
- [ ] Property data refreshed at least every 12-24 hours per MLS rules

SERVER-SIDE CONSIDERATIONS:
- All API calls to SimplyRETS/RESO happen server-side (API route or Server Component)
- Never expose API keys to the client
- Cache responses in Supabase for performance (refresh via cron or ISR)
- Generate static paths for high-traffic listings using generateStaticParams()
```

---

<a name="phase-4"></a>
## PHASE 4: SELLER LEAD CAPTURE — Home Valuation Tool

### Timeline: Week 4-5

### Claude Code Prompt — Phase 4:

```
Build the "What's My Home Worth?" home valuation tool — this is the #1 seller lead capture mechanism.

PAGE: app/home-valuation/page.tsx

USER FLOW:
1. User lands on page → sees headline: "What's Your Nashville Home Worth?"
2. User enters their property address (autocomplete using Google Places API or Mapbox geocoding)
3. System queries HouseCanary or RentCast API for automated valuation
4. INSTANT RESULT DISPLAYED: Estimated value range (low / mid / high)
5. Below the instant estimate: "Want a more accurate, personalized analysis? Our team will prepare a free Comparative Market Analysis (CMA) based on recent sales in your specific neighborhood."
6. CMA request form: Name, Email, Phone, "When are you thinking of selling?" dropdown (ASAP, 1-3 months, 3-6 months, 6-12 months, Just curious), TCPA consent
7. Form submission saves lead to Supabase AND sends notification email via Resend to Stephen

VALUATION API INTEGRATION (lib/housecanary.ts or lib/rentcast.ts):

Option A — HouseCanary:
- Endpoint: POST /property/value
- Returns: price_mean, price_upr, price_lwr, fsd (forecast standard deviation)
- Also returns: property details, block-level stats, value history

Option B — RentCast:
- Endpoint: GET /avm/value
- Returns: price, priceRangeLow, priceRangeHigh
- More affordable, developer-friendly

IMPORTANT DISCLAIMERS (required by Tennessee law and best practice):
Display on the results page:
"This is an automated estimate based on public records and recent comparable sales. It is NOT an appraisal and should not be used as such. For an accurate assessment of your home's market value, contact us for a free, no-obligation Comparative Market Analysis (CMA) prepared by a licensed REALTOR®."

SEO:
- Page title: "What's My Home Worth? | Free Nashville Home Valuation | House Haven Realty"
- Meta description: "Get an instant estimate of your Nashville home's value. Free, no-obligation. House Haven Realty provides accurate home valuations across Nashville and Middle Tennessee."
- Target keywords: "what's my home worth Nashville", "Nashville home value", "free home valuation Nashville TN"

DESIGN:
- Clean, focused landing page — not cluttered
- Large address input field as the hero element
- Trust indicators: "219+ homes sold", "Licensed since 2016", testimonial quote
- Mobile-optimized (many users will hit this from a Google search on their phone)
```

---

<a name="phase-5"></a>
## PHASE 5: COMMUNITY PAGES — Programmatic SEO Engine

### Timeline: Week 5-10 (rolling, start with Tier 1)

### Claude Code Prompt — Phase 5:

```
Build the community pages system — this is the organic traffic engine.

ARCHITECTURE:
- Each community is an MDX file in data/communities/[slug].mdx
- Dynamic route: app/communities/[slug]/page.tsx
- Index page: app/communities/page.tsx
- Use next-mdx-remote for rendering MDX content
- generateStaticParams() generates all community routes at build time

COMMUNITY PAGE TEMPLATE (app/communities/[slug]/page.tsx):

Each community page includes these sections:

1. HERO
   - Community name as H1
   - Tagline/subheading
   - Hero image (stock photo of community or Nashville area — download royalty-free images for each)
   - Quick stats bar: Median Home Price | Avg SqFt | Population | Median Income | School Rating

2. ABOUT THIS COMMUNITY (1,500-2,500 words of ORIGINAL content)
   THIS IS CRITICAL — the content must be unique, genuinely useful, and NOT generic.
   For each community, the MDX file should cover:
   - What it's like to live there (vibe, character, pace of life)
   - Location/commute (distance to downtown Nashville, interstate access, drive times)
   - Housing stock (what types of homes are available, price ranges, new construction activity)
   - Schools (list specific schools with ratings from GreatSchools)
   - Parks, recreation, outdoor activities
   - Shopping, dining, local businesses
   - Who lives here (first-time buyers? families? retirees? — describe WITHOUT demographics that violate Fair Housing)
   - Recent development and growth trends
   - Why House Haven Realty knows this community (connect to team's experience)

   FAIR HOUSING WARNING: Do NOT reference racial, ethnic, religious, or national origin composition.
   DO reference: "family-friendly", "popular with first-time buyers", "active retiree community",
   "growing young professional population" — lifestyle descriptors, not protected classes.

3. CURRENT LISTINGS
   - Embedded IDX feed filtered to this community/ZIP code
   - Display 6-12 active listings
   - "View All [Community] Listings" button
   - IDX disclaimer

4. NEW CONSTRUCTION ACTIVITY
   - Pull recent building permits for this area from Nashville Open Data API
   - Display count: "X new residential building permits filed in [Community] in the last 90 days"
   - Link to the full New Construction Map: "See the full map →"

5. MARKET SNAPSHOT
   - Median sale price (last 12 months)
   - Average days on market
   - Number of homes sold
   - Price trend (up/down/flat)
   - Data source attribution
   (Pull from MLS data if available, or use general market data)

6. MAP
   - MapLibre map showing community boundaries with pins for active listings

7. LEAD CAPTURE
   - "Interested in [Community]? Let's find your perfect home."
   - Contact form: Name, Email, Phone, "I'm looking to..." (Buy, Sell, Invest), Message
   - TCPA consent
   - Or: "Want to receive new [Community] listings as they hit the market? Sign up for alerts."

8. NEARBY COMMUNITIES
   - Links to 3-5 adjacent community pages

SEO FOR EACH COMMUNITY PAGE:
- Title: "Homes for Sale in [Community] TN | Living in [Community] | House Haven Realty"
- Meta description: "Explore [Community], Tennessee — homes for sale, schools, lifestyle, and market data. Your local House Haven Realty team knows [Community] inside and out. Browse listings and learn more."
- H1: "[Community], Tennessee — Homes, Lifestyle & Market Guide"
- Include structured data: LocalBusiness, RealEstateAgent, Place
- Internal links to related community pages
- Breadcrumbs: Home > Communities > [Community]

CONTENT CREATION APPROACH:
For each Tier 1 community, create an MDX file with original content. 

IMPORTANT: Claude Code should research each community to write accurate, original content.
For each community, search for:
- "[Community] TN things to do"
- "[Community] TN schools"  
- "[Community] TN real estate market"
- "[Community] TN new construction"
And use the findings to write genuinely useful, locally-accurate content.

DO NOT use generic filler like "This charming community offers something for everyone."
DO write specific, factual content like "Joelton sits 20 minutes northwest of downtown Nashville 
via I-24, offering rural acreage and custom-built homes starting in the low $300s. 
Beaman Park's 1,700 acres of hiking trails are a five-minute drive from most Joelton homes."

COMMUNITY INDEX PAGE (app/communities/page.tsx):
- Interactive map showing all communities with clickable pins
- Grid/list of all communities with:
  - Community name
  - County
  - Distance from Nashville
  - Median home price
  - Quick description (1-2 sentences)
- Filter by: County, Price Range, Distance from Nashville
- Sort by: Name, Price, Distance
```

### Community Content Queue (Tier 1 — Build First)

For each of these, create the MDX file with researched, original content:

```
1. joelton.mdx — Joelton (37080) — Davidson County
2. bordeaux.mdx — Bordeaux / Brick Church Pike (37208, 37207) — Davidson County
3. whites-creek.mdx — Whites Creek (37189) — Davidson County
4. madison.mdx — Madison (37115) — Davidson County
5. ashland-city.mdx — Ashland City (37015) — Cheatham County
6. pegram.mdx — Pegram (37143) — Cheatham County
7. kingston-springs.mdx — Kingston Springs (37082) — Cheatham County
8. greenbrier.mdx — Greenbrier (37073) — Robertson County
9. springfield.mdx — Springfield (37172) — Robertson County
10. white-house.mdx — White House (37188) — Robertson/Sumner County
11. coopertown.mdx — Coopertown (37047) — Robertson County
12. dickson.mdx — Dickson (37055) — Dickson County
13. burns.mdx — Burns (37029) — Dickson County
14. charlotte.mdx — Charlotte (37036) — Dickson County
15. fairview.mdx — Fairview (37062) — Williamson County
16. thompsons-station.mdx — Thompsons Station (37179) — Williamson County
17. watertown.mdx — Watertown (37184) — Wilson County
18. lebanon.mdx — Lebanon (37087) — Wilson County
19. inglewood.mdx — Inglewood (37216) — Davidson County
20. donelson.mdx — Donelson (37214) — Davidson County
```

---

<a name="phase-6"></a>
## PHASE 6: NEW CONSTRUCTION PERMIT MAP

### Timeline: Week 6-8

### Claude Code Prompt — Phase 6:

```
Build the New Construction Permit Map — this is House Haven Realty's flagship differentiator.
NO other Nashville real estate agent website has this feature.

PAGE: app/new-construction/page.tsx

DATA SOURCE:
Nashville Open Data Portal — Building Permits Issued
API Endpoint: https://data.nashville.gov/resource/96ap-mfmf.json
Documentation: Socrata/SODA API
No API key required for basic access (but register an app token for higher rate limits)

RELEVANT FIELDS:
- permit_number
- permit_type_description (filter for: "NEW RESIDENTIAL", "NEW CONSTRUCTION", "BUILDING - NEW" etc.)
- date_issued
- mapped_location (lat/lng)
- address
- city
- zip
- description
- const_cost (construction cost — indicates home value)
- contact (contractor/builder name)
- status

DATA PIPELINE:
1. Create a Supabase table: building_permits
   - id (uuid, primary key)
   - permit_number (text, unique)
   - permit_type (text)
   - date_issued (timestamp)
   - address (text)
   - city (text)
   - zip (text)
   - latitude (float)
   - longitude (float)
   - description (text)
   - construction_cost (numeric)
   - contractor (text)
   - status (text)
   - created_at (timestamp)

2. Create a cron job (Vercel Cron or Supabase Edge Function) that:
   - Runs daily at 6 AM CT
   - Queries Nashville Open Data API for permits issued in the last 30 days
   - Filters for residential new construction permits only
   - Upserts into the building_permits table
   - For areas outside Davidson County (Sumner, Robertson, Dickson, Williamson, Wilson, Rutherford, Cheatham counties):
     - Research whether these counties have open data portals
     - If yes, add their endpoints
     - If no, note as future enhancement (may need to scrape or manually update)

3. API route: app/api/permits/route.ts
   - GET /api/permits?bounds=lat1,lng1,lat2,lng2&type=residential&days=90
   - Returns permit data within map viewport bounds
   - Supports filtering by date range, permit type, ZIP code

MAP INTERFACE:
- Full-page MapLibre GL JS map (same library as Permighty)
- Default view: Nashville metro area (centered on 36.1627, -86.7816, zoom 10)
- Each permit displayed as a colored pin:
  - Green: Recently issued (last 30 days)
  - Blue: Issued 30-90 days ago
  - Gray: Issued 90-180 days ago
- Pin click shows popup with:
  - Address
  - Permit type
  - Date issued
  - Description
  - Construction cost (if available)
  - Builder/Contractor name
  - "Want to learn more about new homes in this area? Contact us →"

SIDEBAR/CONTROLS:
- Filter by:
  - Date range (last 30/60/90/180 days)
  - ZIP code
  - Permit type (Single Family, Townhouse, Multi-Family, Subdivision)
  - Construction cost range
- Stats bar showing:
  - Total permits displayed
  - Average construction cost
  - Most active ZIP codes
  - Busiest builders

LEAD CAPTURE:
- "Get New Construction Alerts" — email signup to receive weekly digest of new permits in selected areas
- Form: Email, preferred ZIP codes/cities, TCPA consent
- Store in Supabase; connect to Resend for automated weekly email

SEO:
- Title: "New Construction Homes Nashville TN | Building Permit Map | House Haven Realty"
- Meta description: "See every new home being built across Nashville and Middle Tennessee. Our exclusive building permit map shows active construction permits before homes hit the market."
- Target keywords: "new construction Nashville TN", "new homes being built Nashville", "Nashville building permits", "new construction homes [suburb] TN"

CONTENT BELOW THE MAP:
- "How to Use This Map" — brief explanation (2-3 paragraphs)
- "Why New Construction?" — brief content about benefits of buying new construction
- FAQ: "How do I buy a new construction home?", "Can I use my own agent with a builder?", "What should I know about builder contracts?"
- Link to community pages for areas with high permit activity
```

---

<a name="phase-7"></a>
## PHASE 7: BLOG & MARKET REPORTS ENGINE

### Timeline: Week 8-10

### Claude Code Prompt — Phase 7:

```
Build the blog and market reports system.

BLOG (app/blog/):
- Blog posts stored as MDX files in data/blog/
- Each post has frontmatter: title, date, author, excerpt, coverImage, tags, slug
- Blog index page with paginated list of posts
- Category/tag filtering
- Individual post pages with:
  - Full article content
  - Author card (link to agent profile)
  - Related posts
  - Newsletter signup
  - Social share buttons
  - "Looking for homes in [mentioned area]? Search listings →" contextual CTA

INITIAL BLOG POSTS TO CREATE:
1. "The Ultimate Guide to Moving to Nashville in 2026"
2. "Nashville Housing Market Report — [Current Month] 2026"
3. "First-Time Home Buyer Programs in Tennessee: Everything You Need to Know"
4. "Renting vs Buying in Nashville: The 2026 Breakdown"
5. "What to Know Before Buying New Construction in Nashville"

Each post should be 1,500-2,500 words of genuinely useful, researched content.
Include internal links to relevant community pages and the property search.

MARKET REPORTS (app/market-reports/page.tsx):
- Monthly Nashville market data dashboard
- For now, create the page structure with placeholder data
- Plan for integration with Realtracs market stats or manual data entry
- Sections:
  - Nashville Metro Overview (median price, inventory, DOM, months of supply)
  - County-by-county breakdown (Davidson, Sumner, Robertson, Williamson, Wilson, Rutherford, Dickson, Cheatham)
  - Price trend chart (use Recharts or Chart.js)
  - "What does this mean for buyers/sellers?" commentary
- Lead capture: "Get this report delivered monthly" → email signup
```

---

<a name="phase-8"></a>
## PHASE 8: BUYER & SELLER JOURNEY PAGES

### Timeline: Week 9-10

### Claude Code Prompt — Phase 8:

```
Build comprehensive Buyer and Seller pages with the process content from the current site, enhanced.

BUYERS PAGE (app/buyers/page.tsx):
- Replicate the 8-step buying process from the current site (see Section 2 for full content)
- Steps: Get Pre-Approved → Home Search → Making An Offer → Going Under Contract → Home Inspection → Home Appraisal → Final Walk → Closing!
- Visual timeline/stepper design
- Each step is a section with icon, heading, and detailed description
- Include the "Tools for Buyers" section: Home Search, Email Alerts, Market Analysis, Featured Listings
- Include the "Moving Checklist" accordion (replicate from current site content)
- CTA: "Ready to start your home search?" → Property Search + Contact form
- Mortgage Calculator widget (build or embed)
- Important post-NAR settlement addition: 
  "Before touring homes, Tennessee law requires a written Buyer Representation Agreement. 
  This agreement outlines how your agent will be compensated and the services they will provide. 
  Contact us to discuss how we can help you — with no obligation."

SELLERS PAGE (app/sellers/page.tsx):
- Selling process overview (create content based on industry standard):
  1. Determine your home's value
  2. Prepare your home for sale (staging tips)
  3. List with House Haven Realty
  4. Marketing your property
  5. Showings and open houses
  6. Reviewing offers
  7. Negotiations and contract
  8. Closing
- "What's My Home Worth?" CTA prominently placed (links to /home-valuation)
- Staging checklist (replicate from current site)
- Why sell with House Haven: stats (219 sales, $124.2M volume), testimonials
- Marketing plan overview: professional photography, MLS exposure, social media, etc.
- CTA: "Ready to sell? Get your free home valuation" + Contact form

PROPERTY MANAGEMENT PAGE (app/property-management/page.tsx):
- Brief description of Door Collectors Property Management
- CTA linking to doorcollectors.com
- "Whether you're looking to invest in rental property or need management for your current rentals, our sister company Door Collectors handles it all."
```

---

<a name="phase-9"></a>
## PHASE 9: GOOGLE REVIEWS & SOCIAL PROOF INTEGRATION

### Timeline: Week 10-11

### Claude Code Prompt — Phase 9:

```
Integrate Google Reviews as a trust signal throughout the site.

APPROACH:
Option A — Google Places API:
- Use the Places API to fetch reviews for House Haven Realty's Google Business Profile
- Cache reviews in Supabase (refresh daily via cron)
- Display star rating + review count + individual reviews

Option B — Manual curation:
- If API access is complex, create a Supabase table for reviews
- Stephen or VA manually adds new reviews as they come in
- Display from database

IMPLEMENTATION:
1. Google Reviews widget on homepage (show 3-5 recent reviews with star ratings)
2. Dedicated reviews/testimonials section on the About page
3. Individual agent pages show reviews that mention that agent's name
4. Schema.org structured data for AggregateRating on homepage and team pages

DESIGN:
- Star rating prominently displayed (gold stars)
- Review count badge: "★ 4.9 from X reviews on Google"
- Individual review cards: Stars, reviewer name, date, excerpt, "Read on Google" link
- Mix Google reviews with the 7 existing testimonials from the current site
```

---

<a name="phase-10"></a>
## PHASE 10: SEO OPTIMIZATION, METADATA, & STRUCTURED DATA

### Timeline: Week 11-12

### Claude Code Prompt — Phase 10:

```
Implement comprehensive SEO across the entire site.

METADATA (every page):
- Unique <title> and <meta description> for every page
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter card tags
- Canonical URLs
- Viewport meta tag (already set in Phase 1)

STRUCTURED DATA (JSON-LD):
Implement on appropriate pages:

Homepage:
- Organization schema (name, logo, address, phone, social profiles)
- LocalBusiness schema (real estate agent)
- WebSite schema with SearchAction (sitelinks search box)

Team pages:
- RealEstateAgent schema for each agent
- Person schema with contactPoint

Listing pages:
- RealEstateListing schema (price, address, bedrooms, bathrooms, sqft)
- BreadcrumbList schema

Community pages:
- Place schema
- BreadcrumbList schema

Blog posts:
- Article schema (author, datePublished, dateModified)
- BreadcrumbList schema

TECHNICAL SEO:
- XML sitemap (auto-generated, include all community pages, blog posts, team pages)
- robots.txt
- Breadcrumb navigation on all interior pages
- Internal linking strategy:
  * Every community page links to 3-5 adjacent communities
  * Every community page links to relevant blog posts
  * Blog posts link to relevant community pages
  * All pages link to Home Valuation and Property Search
- Image optimization: WebP format, responsive sizes, lazy loading, descriptive alt text
- Page speed: Target < 2 second LCP (Largest Contentful Paint)
  * Use Next.js Image component for all images
  * Implement dynamic imports for heavy components (maps, charts)
  * Minimize JavaScript bundle size

GOOGLE BUSINESS PROFILE ALIGNMENT:
- Ensure NAP (Name, Address, Phone) on website matches GBP exactly:
  Name: House Haven Realty
  Address: 5016 Centennial Blvd Suite 200, Nashville, TN 37209
  Phone: (615) 624-4766
- Add Google Maps embed on Contact page using the exact GBP address
```

---

<a name="phase-11"></a>
## PHASE 11: LEAD CAPTURE FORMS, CRM INTEGRATION, & ANALYTICS

### Timeline: Week 12-13

### Claude Code Prompt — Phase 11:

```
Implement lead capture, CRM integration, and analytics.

SUPABASE LEAD TABLE:
Create table: leads
- id (uuid, primary key, default gen_random_uuid())
- name (text)
- email (text)
- phone (text)
- source (text — 'contact_form', 'home_valuation', 'newsletter', 'community_page', 'listing_inquiry', 'new_construction_alert', 'showing_request')
- message (text, nullable)
- community_interest (text, nullable)
- listing_id (text, nullable)
- buyer_seller (text — 'buyer', 'seller', 'investor', 'other')
- timeline (text, nullable — 'ASAP', '1-3 months', '3-6 months', '6-12 months', 'just_curious')
- created_at (timestamptz, default now())
- contacted (boolean, default false)
- notes (text, nullable)

FORM HANDLING:
All forms submit to API routes that:
1. Validate input (server-side)
2. Insert into Supabase leads table
3. Send notification email to Stephen via Resend
4. Send confirmation email to the lead via Resend
5. Return success/error response

HUBSPOT INTEGRATION:
Stephen uses HubSpot as his CRM. Integrate via HubSpot API:
- On lead submission, create/update HubSpot contact via HubSpot Contacts API
- Map fields: name → firstname/lastname, email, phone, source (custom property), message → notes
- Use HubSpot API key stored in environment variables
- If HubSpot API fails, the Supabase record is the fallback (never lose a lead)

ANALYTICS:
- Google Analytics 4 (GA4) via next/script
- Google Tag Manager for event tracking
- Track these events:
  * form_submission (with source parameter)
  * property_search
  * listing_view
  * home_valuation_request
  * community_page_view (with community parameter)
  * permit_map_interaction
  * phone_click (click-to-call tracking)
  * email_click
- Google Search Console verification (add meta tag or DNS record)
- Vercel Web Analytics (built-in, free with Vercel Pro)
```

---

<a name="phase-12"></a>
## PHASE 12: QA, PERFORMANCE, ACCESSIBILITY, & LAUNCH

### Timeline: Week 13-14

### Claude Code Prompt — Phase 12:

```
Final QA, performance optimization, and launch preparation.

COMPLIANCE FINAL CHECK:
Walk through EVERY page and verify:
- [ ] "House Haven Realty" firm name appears on every page (TREC)
- [ ] "(615) 624-4766" phone number appears on every page (TREC)
- [ ] Equal Housing Opportunity logo appears in footer (Fair Housing Act)
- [ ] IDX disclaimer appears on every page showing MLS data (NAR IDX Policy)
- [ ] Listing attribution (listing agent/office) on every listing (NAR IDX Policy)
- [ ] TCPA consent checkbox on every lead capture form
- [ ] Privacy Policy page exists and is linked from every form
- [ ] No Fair Housing violations in any community page content
- [ ] No buyer agent compensation amounts displayed
- [ ] Agent names appear exactly as licensed with TREC
- [ ] Agent names are never larger than firm name in displays

PERFORMANCE:
- Run Lighthouse audit on all page types; target scores:
  * Performance: 90+
  * Accessibility: 95+
  * Best Practices: 95+
  * SEO: 95+
- Core Web Vitals:
  * LCP: < 2.5 seconds
  * FID/INP: < 200ms
  * CLS: < 0.1
- Image optimization verification (all images served as WebP, responsive sizes)
- Bundle size analysis (next-bundle-analyzer)
- Reduce any dependencies over 100KB

ACCESSIBILITY:
- Run axe-core accessibility audit
- Keyboard navigation test (tab through entire site)
- Screen reader test (VoiceOver/NVDA on key pages)
- Color contrast verification
- Form label association verification
- Focus management on modals and dynamic content

CROSS-BROWSER TESTING:
- Chrome (desktop + mobile)
- Safari (desktop + iOS)
- Firefox (desktop)
- Edge (desktop)
- Test on iPhone (Safari), Android (Chrome)

LAUNCH CHECKLIST:
- [ ] Domain DNS pointed to Vercel
- [ ] SSL certificate active (automatic with Vercel)
- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase production database configured
- [ ] API keys for all services (SimplyRETS, HouseCanary, Google, HubSpot) set
- [ ] Google Analytics 4 tracking verified
- [ ] Google Search Console property verified
- [ ] XML sitemap submitted to Google Search Console
- [ ] robots.txt verified
- [ ] 301 redirects configured for any URLs changing from old site
- [ ] Old site backup taken before DNS switch
- [ ] Monitor for 48 hours post-launch for errors
```

---

<a name="va-ops"></a>
## VA OPERATIONS PLAYBOOK — Past Client Referral System

### This section is NOT for Claude Code — it's for Stephen's VA (Maria or other team member)

### Tools Required
```
HubSpot (existing) — CRM, workflows, contact management
Homebot ($25/month) — Monthly equity reports to past clients
Handwrytten ($2-3/card via Zapier) — Automated handwritten notes
Mailchimp (existing) — Newsletters and mass email
Zapier ($20/month) — Connects HubSpot → Handwrytten
Google Business Profile — Review management
```

### VA Weekly Workflow

**Monday — Planning & Prep:**
- Review HubSpot for birthdays, home anniversaries, and closing anniversaries this week
- Queue Handwrytten cards for all events ($2-3/card, triggered via Zapier from HubSpot date fields)
- Check Homebot dashboard for "likely to sell" intent signals → flag for Stephen's personal follow-up
- Draft weekly social media content (3-5 posts)

**Tuesday-Thursday — Execution:**
- Send Google review request to any client who closed 7-14 days ago (use HubSpot workflow or manual email with direct Google review link)
- Monitor and respond to existing Google reviews (draft response, Stephen approves)
- Post social media content (Facebook, Instagram)
- Process any new website leads from Supabase/HubSpot → assign to appropriate agent
- Update HubSpot contact records with any new information

**Friday — Reporting & Nurture:**
- Send personalized check-in texts to the 3-5 most recent closings (from Stephen's phone or number)
- Compile weekly lead report: new leads by source, status of active leads, review count update
- Queue next week's Handwrytten cards

**Monthly — Newsletter & Database:**
- Prepare and send Mailchimp newsletter with market update content (pull from blog/market reports page)
- Clean HubSpot database: remove bounced emails, update contact info, merge duplicates
- Generate monthly referral tracking report
- Order pop-by gifts for top 20 referral sources (quarterly)

### Post-Closing Nurture Sequence (VA Executes, HubSpot Tracks)
```
Day 0 (Closing):     Handwrytten card + small gift → triggered via Zapier
Day 3:               Personal "how's the move?" text from Stephen's number
Day 7:               Google review request email (include direct link)
Day 14:              Second review request if no review submitted
Day 30:              Check-in email: "How's the new home? Need any contractor referrals?"
Day 45:              Handwrytten "settling in" note
Day 60:              Seasonal home maintenance tips email
Day 90:              Market update + first referral ask: "Know anyone thinking of buying or selling?"
Month 6:             Pop-by gift or personalized card
Month 12:            Home anniversary card with current estimated value (Homebot data)
Quarterly ongoing:   Market update emails via Mailchimp
Annually:            Home anniversary Handwrytten card
Ongoing:             Homebot monthly equity digest (automated, $25/month for all contacts)
```

### Referral Tracking
```
In HubSpot, create custom properties:
- referral_source (who referred this lead)
- referral_reward_sent (boolean)
- referral_reward_type (text)

When a referral closes:
1. VA sends $250 gift card or restaurant voucher to referrer
2. VA sends Handwrytten thank-you note to referrer
3. VA updates HubSpot with referral tracking
4. VA adds new client to the post-closing nurture sequence
```

---

## APPENDIX A: Environment Variables Required

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# SimplyRETS (or MLS Grid)
SIMPLYRETS_API_KEY=
SIMPLYRETS_API_SECRET=

# HouseCanary (or RentCast)
HOUSECANARY_API_KEY=
HOUSECANARY_API_SECRET=

# Nashville Open Data
NASHVILLE_DATA_APP_TOKEN=

# Google
GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# HubSpot
HUBSPOT_API_KEY=

# Resend
RESEND_API_KEY=

# Homebot (integration if API exists)
HOMEBOT_API_KEY=
```

---

## APPENDIX B: DNS & Domain Configuration

```
When ready to launch:
1. In Vercel: Add househavenrealty.com as a custom domain
2. In domain registrar: Update nameservers to Vercel OR add CNAME/A records per Vercel instructions
3. Vercel automatically provisions SSL certificate
4. Set up www → non-www redirect (or vice versa — match current site pattern)
5. Configure 301 redirects for any changed URL paths:
   /homes-for-sale-search-advanced/ → /homes-for-sale
   /whats-my-home-worth/ → /home-valuation
   /meet-the-team/ → /team
   /featured-communities/ → /communities
   /calculate-my-payments/ → /buyers#mortgage-calculator
   /homes-for-sale-featured/ → /homes-for-sale
   /property-organizer-login/ → /login
   /meet-stephen-delahoussaye/ → /team/stephen-delahoussaye
   (map all current URLs to new URLs)
```

---

## APPENDIX C: Content Production Schedule (Post-Launch)

```
Week 1-2 post-launch: Publish 5 Tier 1 community pages
Week 3-4: Publish 5 more Tier 1 community pages
Week 5-6: Publish remaining Tier 1 pages + first blog post
Week 7-8: Begin Tier 2 community pages (5 per 2-week sprint)
Week 9-10: Continue Tier 2 + monthly market report
Week 11-12: Continue Tier 2 + second blog post
Months 4-6: Complete Tier 2, begin Tier 3
Months 6-12: Complete all community pages, establish monthly blog cadence

Target: 65-80 community pages within 6 months of launch
Blog: 2 posts per month minimum
Market Reports: Monthly
```

---

## END OF DOCUMENT

This document is the single source of truth for the House Haven Realty website rebuild. Claude Code should reference this document for ALL decisions regarding architecture, design, compliance, content, and implementation. When in doubt, follow the compliance requirements — legal compliance is non-negotiable and takes precedence over design preferences.
