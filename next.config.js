/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'development' ? '' : '/literature-analyzer',
  assetPrefix: process.env.NODE_ENV === 'development' ? '' : '/literature-analyzer/'
}
