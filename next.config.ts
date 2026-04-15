import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.agentaprd.com' },
      { protocol: 'https', hostname: 'eefqcgetyxdrvchkwhrq.supabase.co' },
    ],
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
