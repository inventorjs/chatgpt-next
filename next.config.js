/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/v1/:page*',
        destination: '/api/v1/:page*',
      }
    ]
  }
}

module.exports = nextConfig
