import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/language-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

// Using Inter for better readability at all sizes
const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "Job*Radar - Arbeit finden in Südtirol",
  description: "Finde schnell und einfach Jobs in Südtirol - Hotels, Gastronomie und mehr",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
  params,
  searchParams,
}: Readonly<{
  children: React.ReactNode
  params?: Promise<Record<string, string | string[]>>
  searchParams?: Promise<Record<string, string | string[]>>
}>) {
  // params und searchParams werden nicht verwendet, aber explizit deklariert,
  // um den Next.js 16 Promise-Fehler zu vermeiden
  // eslint/no-unused-vars wäre sonst ein False-Positive → wir markieren sie bewusst als "genutzt".
  void params
  void searchParams
  return (
    <html lang="de">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
