"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageProvider } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useTranslation } from "@/hooks/use-translation"

function ProfilePageContent() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-accent/20 to-primary/10">
      <header className="relative bg-gradient-to-br from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 text-white py-1 md:py-4 lg:py-5 px-2 md:px-6 lg:px-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-lake.png"
            alt="Mountain Lake Landscape"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div className="bg-white/20 backdrop-blur-md rounded-lg md:rounded-2xl lg:rounded-3xl px-2 md:px-5 lg:px-6 py-1 md:py-3 lg:py-4 shadow-xl border border-white/30 flex items-center gap-1.5 md:gap-4 lg:gap-5 transition-all duration-300 hover:bg-white/30">
            <div className="flex-shrink-0 relative">
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-5 md:h-8 lg:h-10 mix-blend-screen" />
            </div>
            <div className="h-5 md:h-8 lg:h-10 w-px bg-white/30" />
            <h1 className="text-sm md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg whitespace-nowrap">job*radar</h1>
          </div>
          <div className="flex items-center gap-1.5 md:gap-4 lg:gap-5">
            <LanguageToggleButton />
            <Link href="/">
              <Button variant="ghost" size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg transition-all duration-300">
                {t("nav.jobs")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-2 md:px-5 pt-2 md:pt-4">
        <Link href="/">
          <Button
            variant="outline"
            size="lg"
            className="gap-1.5 md:gap-3 bg-white border-2 border-border rounded-lg md:rounded-2xl shadow-md hover:shadow-lg transition-all px-2 md:px-5 py-1.5 md:py-3 text-xs md:text-base font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
            {t("nav.backToStart")}
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-2 md:px-5 pt-2 md:pt-3 space-y-2 md:space-y-3">
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="flex-1 min-w-0 py-2.5 md:py-3 px-3 md:px-4 rounded-xl bg-white/90 border border-border text-center text-sm md:text-base font-medium text-foreground">
            {t("notifications.email")}
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <LanguageProvider>
      <ProfilePageContent />
    </LanguageProvider>
  )
}
