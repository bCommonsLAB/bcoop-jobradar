/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript-Fehler werden jetzt nicht mehr ignoriert für bessere Code-Qualität
  images: {
    unoptimized: true,
  },
}

export default nextConfig
