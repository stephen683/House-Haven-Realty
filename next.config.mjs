/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'media.agentaprd.com' },
      { protocol: 'https', hostname: 'eefqcgetyxdrvchkwhrq.supabase.co' },
    ],
  },
}

export default nextConfig
