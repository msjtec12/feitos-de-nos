/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];

    return [
      ...['/personalizar/:path*','/api/personalizar/:path*','/api/partners/:path*','/feito/:path*','/parceiros/painel/:path*'].map(source=>({source,headers:[
        ...securityHeaders,
        {key:'Referrer-Policy',value:'no-referrer'},
        {key:'X-Robots-Tag',value:'noindex, nofollow, noarchive, nosnippet'},
        {key:'Cache-Control',value:'private, no-store'},
      ]})),
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/presente/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
      {
        source: '/p/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive, nosnippet',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
