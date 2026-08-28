/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Images configuration
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com', // For Cloudinary images in production
      'yourdomain.com', // Replace with your domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Compress output
  compress: true,
  
  // Output configuration
  output: 'standalone', // For deployment on platforms like Render, Vercel
  
  // Environment variables that should be available at build time
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
  },
  
  // Experimental features
  experimental: {
    optimizeCss: true, // Optimize CSS loading
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
