/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/index',
        destination: '/rankings',
      },
      {
        source: '/index/:path*',
        destination: '/rankings/:path*',
      },
    ];
  },
};

export default nextConfig;
