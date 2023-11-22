/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['wumhramcgsllwpkopgnq.supabase.co'],
  },
}

module.exports = nextConfig
