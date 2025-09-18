/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ["www.butterflyassets.online", "proprimemart.com"],
  },
  i18n: {
    locales: ["en", "fr"],
    defaultLocale: "en",
  },
};

export default nextConfig;
