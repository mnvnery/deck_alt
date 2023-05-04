/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Set the gzip content encoding header for .js.gz files
        source: '/unity/Build/TheDeckModelViewer_GzipTest.framework.js.gz',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
      {
        // Set the gzip content encoding header for .data.gz files
        source: '/unity/Build/TheDeckModelViewer_GzipTest.data.gz',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
          {
            key: 'Content-Type',
            value: 'application/octet-stream',
          },
        ],
      },
      {
        // Set the gzip content encoding header for .wasm.gz files
        source: '/unity/Build/TheDeckModelViewer_GzipTest.wasm.gz',
        headers: [
          {
            key: 'Content-Encoding',
            value: 'gzip',
          },
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
        ],
      },
    ]
  },
  images: {
    domains: ['cdn.shopify.com'],
  },
}

module.exports = nextConfig
