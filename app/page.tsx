"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search, Eye, Sparkles, Languages, Bell } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { useTranslation } from "@/hooks/use-translation"

export default function WelcomePage() {
  const router = useRouter()
  const { resetLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20">
      <section className="relative h-[100px] md:h-[200px] lg:h-[240px] flex items-center justify-center overflow-hidden group">
        <div className="absolute inset-0">
          <Image 
            src="/hero-lake.png" 
            alt="Mountain Lake Landscape" 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </div>

        <div className="absolute top-2 md:top-6 lg:top-8 left-2 md:left-6 lg:left-8 z-20">
          <div className="bg-white/20 backdrop-blur-md rounded-lg md:rounded-2xl lg:rounded-3xl px-2 md:px-5 lg:px-6 py-1 md:py-3 lg:py-4 shadow-xl border border-white/30 flex items-center gap-1.5 md:gap-4 lg:gap-5 transition-all duration-300 hover:bg-white/30">
            <div className="flex-shrink-0 relative">
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-5 md:h-8 lg:h-10 mix-blend-screen" />
            </div>
            <div className="h-5 md:h-8 lg:h-10 w-px bg-white/30" />
            <h1 className="text-sm md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg whitespace-nowrap">job*radar</h1>
          </div>
        </div>

        <div className="absolute top-2 md:top-6 lg:top-8 right-2 md:right-6 lg:right-8 z-20 flex items-center gap-1.5 md:gap-4 lg:gap-5">
          <LanguageToggleButton />
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg transition-all duration-300"
            onClick={() => router.push("/jobs")}
          >
            {t("nav.jobs")}
          </Button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-2 py-2 md:py-8">
        <div className="bg-card rounded-2xl md:rounded-3xl p-3 md:p-8 shadow-md mb-4 md:mb-10 text-center transition-all duration-200 hover:shadow-lg">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl md:rounded-3xl mb-2 md:mb-5 shadow-md transition-transform duration-200 ease-out hover:scale-110">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-5 text-balance leading-tight tracking-tight">
            {t("welcome.title")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto tracking-normal">
            {t("welcome.description")}
          </p>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-md mb-4 md:mb-10 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3 md:mb-10 text-center tracking-tight">{t("welcome.howItWorks")}</h3>

          <div className="space-y-4 md:space-y-8 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-2.5 transition-all duration-200 hover:scale-[1.01]">
              <div className="flex-shrink-0 relative w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-teal-500/10 rounded-xl md:rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105">
                <Search className="w-7 h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 text-teal-600" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-xs md:text-[10px] lg:text-xs font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1 md:mb-2 tracking-tight">{t("welcome.step1Title")}</h4>
                <p className="text-sm md:text-sm text-muted-foreground leading-relaxed tracking-normal">
                  {t("welcome.step1Description")}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-2.5 transition-all duration-200 hover:scale-[1.01]">
              <div className="flex-shrink-0 relative w-14 h-14 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-cyan-500/10 rounded-xl md:rounded-xl flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-105">
                <Eye className="w-7 h-7 md:w-6 md:h-6 lg:w-7 lg:h-7 text-cyan-600" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  <span className="text-xs md:text-[10px] lg:text-xs font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-1 md:mb-2 tracking-tight">{t("welcome.step2Title")}</h4>
                <p className="text-sm md:text-sm text-muted-foreground leading-relaxed tracking-normal">
                  {t("welcome.step2Description")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 md:mt-10 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 hover:from-teal-600 hover:via-teal-500 hover:via-cyan-600 hover:via-cyan-500 hover:to-teal-700 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl hover:glow-teal transition-all duration-200 ease-out hover:scale-[1.02]"
              onClick={() => router.push("/jobs")}
            >
              <Sparkles className="mr-1.5 w-4 h-4 md:w-5 md:h-5" />
              {t("welcome.startNow")}
            </Button>
          </div>
        </div>

        {/* Job-Benachrichtigungen Bereich */}
        <div className="text-center mb-2 md:mb-3">
          <button
            onClick={() => router.push("/notifications")}
            className="text-xs md:text-xs text-muted-foreground hover:text-teal-600 transition-colors duration-200 inline-flex flex-col items-center gap-1.5 md:gap-1.5"
          >
            <div className="flex items-center gap-1.5 md:gap-1.5">
              <Bell className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span>{t("welcome.notificationPrompt")}</span>
            </div>
            <span className="text-primary font-medium">{t("welcome.notificationAction")}</span>
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-border py-3 md:py-5 px-2 md:px-4 mt-2 md:mt-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm md:text-base text-muted-foreground">{t("welcome.footer")}</p>
          <div className="mt-2 md:mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-1 text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 bg-transparent border-border/50 hover:border-primary/50">
              <Languages className="h-3 w-3 md:h-3.5 md:w-3.5" />
              {t("welcome.language")}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
