# House Haven Realty — Claude Code Configuration

## Project Overview
Custom Next.js 14 website for House Haven Realty (househavenrealty.com) replacing a $300+/month Blok template with a high-performance lead-generating platform.

**Full build specification:** See `docs/ROADMAP.md`

## Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Database:** Supabase (PostgreSQL + PostGIS)
- **Hosting:** Vercel (auto-deploy on push to main)
- **Styling:** Tailwind CSS v3+
- **Maps:** MapLibre GL JS

## Supabase
- **Project:** House Haven Realty
- **URL:** https://eefqcgetyxdrvchkwhrq.supabase.co
- **Region:** us-east-1
- **Env vars:** NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (set in Vercel)

## Dev Commands
```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
npm run type-check  # TypeScript check
```

## Repository Structure
```
app/                    # Next.js App Router pages
├── layout.tsx          # Root layout (compliance components injected here)
├── page.tsx            # Homepage
├── about/page.tsx
├── team/
│   ├── page.tsx        # Team index
│   └── [slug]/page.tsx # Individual agent pages
├── communities/
│   ├── page.tsx
│   └── [slug]/page.tsx # Programmatic SEO community pages
├── homes-for-sale/
│   ├── page.tsx        # IDX search
│   └── [id]/page.tsx
├── buyers/page.tsx
├── sellers/page.tsx
├── home-valuation/page.tsx
├── new-construction/page.tsx  # Permit map (flagship feature)
├── blog/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── contact/page.tsx
├── privacy/page.tsx
└── api/               # API routes
components/
├── compliance/        # LEGALLY REQUIRED — do not remove
│   ├── SiteFooter.tsx
│   ├── ComplianceBanner.tsx
│   ├── IDXDisclaimer.tsx
│   └── FairHousingBadge.tsx
├── layout/
├── ui/
└── sections/
lib/
├── supabase/
│   ├── client.ts      # Browser client
│   └── server.ts      # Server client
├── utils.ts
└── types.ts
public/
supabase/
└── migrations/
```

## Compliance — LEGALLY MANDATORY (TREC Rule 1260-02-.12)
- "House Haven Realty" firm name on EVERY page (server-side rendered)
- Firm phone number (615) 624-4766 on EVERY page
- IDX disclaimer on every page with MLS listings
- Equal Housing Opportunity logo in footer
- Agent names must not appear larger than firm name
- All compliance components are in `components/compliance/` — never delete or bypass them

## Business Info
- **Brokerage:** House Haven Realty
- **Broker/Owner:** Stephen Delahoussaye
- **Phone:** (615) 624-4766
- **Email:** Stephen@househavenrealty.com
- **Address:** 5016 Centennial Blvd Suite 200, Nashville, TN 37209
- **Instagram:** https://www.instagram.com/househavenrealty/

## Brand Colors (extract from SVG — use these as defaults until confirmed)
- Primary Dark: `#1a1a2e` (navy)
- Accent: TBD — extract from logo SVG at https://media.agentaprd.com/sites/213/house-haven-logo-dark.svg
- Background: `#FFFFFF`
- Surface: `#F8F9FA`
- Text: `#1a1a1a`

## Key Conventions
- TypeScript strict mode — no `any` types
- Server Components by default, Client Components only when needed
- All compliance components render server-side
- Tailwind only — no CSS modules or styled-components
- Images via next/image with descriptive alt text (ADA required)
- Every form must include TCPA consent language
- Community pages: describe amenities/schools/lifestyle ONLY — never demographics
