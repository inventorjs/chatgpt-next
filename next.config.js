/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/:page*',
        destination: '/api/:page*',
      }
    ]
  }
}

module.exports = nextConfig
