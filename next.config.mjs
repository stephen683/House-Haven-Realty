/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.agentaprd.com' },
      { protocol: 'https', hostname: 'extassets.agentaprd.com' },
      { protocol: 'https', hostname: 'cdn.chime.me' },
      { protocol: 'https', hostname: 'eefqcgetyxdrvchkwhrq.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ]
  },
  async redirects() {
    // 301 redirects from the legacy Blok/AgentA site to the new routes.
    // Source: ROADMAP.md Appendix B + observed Chime/AgentA URL patterns.
    return [
      // Property search
      { source: '/homes-for-sale-search-advanced', destination: '/homes-for-sale', permanent: true },
      { source: '/homes-for-sale-search-advanced/:slug*', destination: '/homes-for-sale', permanent: true },
      { source: '/homes-for-sale-featured', destination: '/homes-for-sale', permanent: true },
      { source: '/homes-for-sale-featured/:slug*', destination: '/homes-for-sale', permanent: true },
      { source: '/featured-listings', destination: '/homes-for-sale', permanent: true },

      // Seller tools
      { source: '/whats-my-home-worth', destination: '/home-valuation', permanent: true },
      { source: '/calculate-my-payments', destination: '/buyers', permanent: true },

      // Team
      { source: '/meet-the-team', destination: '/team', permanent: true },
      { source: '/meet-stephen-delahoussaye', destination: '/team/stephen-delahoussaye', permanent: true },
      { source: '/meet-camil-medina', destination: '/team/camil-medina', permanent: true },
      { source: '/meet-sarah-harris', destination: '/team/sarah-harris', permanent: true },
      { source: '/meet-olivia-mortensen', destination: '/team', permanent: true },
      { source: '/meet-james-belote', destination: '/team/james-belote', permanent: true },
      { source: '/meet-josh-zehring', destination: '/team/josh-zehring', permanent: true },
      { source: '/meet-matthew-valluzzi', destination: '/team/matthew-valluzzi', permanent: true },
      { source: '/meet-amber-bouldin', destination: '/team/amber-bouldin', permanent: true },
      { source: '/meet-chuck-starks', destination: '/team/chuck-starks', permanent: true },
      { source: '/meet-philip-elliott', destination: '/team/philip-elliott', permanent: true },
      { source: '/meet-maria-morales', destination: '/team/maria-morales', permanent: true },

      // Communities
      { source: '/featured-communities', destination: '/communities', permanent: true },
      { source: '/featured-communities/:slug*', destination: '/communities', permanent: true },

      // Buyer / seller content
      { source: '/buying-process', destination: '/buyers', permanent: true },
      { source: '/tools-for-buyers', destination: '/buyers', permanent: true },
      { source: '/selling-your-home', destination: '/sellers', permanent: true },
      { source: '/staging-checklist', destination: '/sellers', permanent: true },

      // Market reports / blog
      { source: '/market-reports-index', destination: '/market-reports', permanent: true },
      { source: '/blog-posts', destination: '/blog', permanent: true },

      // Account / auth on the legacy site
      { source: '/property-organizer-login', destination: '/contact', permanent: true },

      // Internal rebrand: NashBuilds → Nashville Pipeline
      { source: '/new-builds', destination: '/pipeline', permanent: true },
      { source: '/new-builds/:path*', destination: '/pipeline/:path*', permanent: true },
      { source: '/api/nashbuilds', destination: '/api/pipeline', permanent: true },
      { source: '/api/nashbuilds/:path*', destination: '/api/pipeline/:path*', permanent: true },

      // Consolidate older duplicate route into Pipeline
      { source: '/new-construction', destination: '/pipeline', permanent: true },
    ]
  },
}

export default nextConfig
