"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Languages, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobNotifications from "@/components/job-notifications"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useTranslation } from "@/hooks/use-translation"

function NotificationsPageContent() {
  const { resetLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20">
      <header className="relative bg-gradient-to-br from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 text-white py-1 md:py-4 lg:py-5 px-2 md:px-6 lg:px-8 shadow-xl overflow-hidden">
        {/* Hintergrundbild */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-lake.png" 
            alt="Mountain Lake Landscape" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        
        {/* Bestehende animierte Blur-Elemente */}
        <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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

      <div className="max-w-6xl mx-auto px-2 md:px-5 py-2 md:py-5">
        {/* Verbesserte Header-Section */}
        <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/20 flex items-center justify-center shadow-md">
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                {t("notifications.title")}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                {t("notifications.description")}
              </p>
            </div>
          </div>
        </div>

        <JobNotifications />
      </div>

      <footer className="bg-white border-t border-border py-2 md:py-5 px-2 md:px-4 mt-2 md:mt-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs md:text-base text-muted-foreground">{t("welcome.footer")}</p>
          <div className="mt-2 md:mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-1 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-transparent border-border/50 hover:border-primary/50">
              <Languages className="h-3 w-3 md:h-3.5 md:w-3.5" />
              {t("welcome.language")}
            </Button>
          </div>
        </div>
      </footer>
      
      <ScrollToTop />
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <LanguageProvider>
      <NotificationsPageContent />
    </LanguageProvider>
  )
}

