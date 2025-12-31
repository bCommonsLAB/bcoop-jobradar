"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search, Eye, Sparkles, Languages } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { useTranslation } from "@/hooks/use-translation"

export default function WelcomePage() {
  const router = useRouter()
  const { resetLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20">
      <section className="relative h-[240px] flex items-center justify-center overflow-hidden group">
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

        <div className="absolute top-6 left-6 z-20">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/30 flex items-center gap-3 transition-all duration-300 hover:bg-white/30">
            <div className="flex-shrink-0 relative">
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-8 mix-blend-screen" />
            </div>
            <div className="h-8 w-px bg-white/30" />
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">job*radar</h1>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
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

      <main className="max-w-6xl mx-auto px-4 py-14 md:py-20">
        <div className="bg-white rounded-3xl p-10 md:p-16 shadow-md mb-16 text-center transition-all duration-200 hover:shadow-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl mb-8 shadow-md transition-transform duration-200 ease-out hover:scale-110">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8 text-balance leading-tight tracking-tight">
            {t("welcome.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto tracking-normal">
            {t("welcome.description")}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-md mb-16 transition-all duration-200 hover:shadow-lg">
          <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-20 text-center tracking-tight">{t("welcome.howItWorks")}</h3>

          <div className="space-y-12 md:space-y-16 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-200 hover:scale-[1.02]">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-3xl flex items-center justify-center font-bold text-2xl shadow-md transition-transform duration-200 hover:scale-110">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">{t("welcome.step1Title")}</h4>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed tracking-normal">
                  {t("welcome.step1Description")}
                </p>
              </div>
              <div className="hidden lg:block flex-shrink-0 bg-teal-50/50 p-4 rounded-3xl shadow-md transition-transform duration-200 ease-out hover:scale-110">
                <Search className="w-10 h-10 text-teal-600" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 transition-all duration-200 hover:scale-[1.02]">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-3xl flex items-center justify-center font-bold text-2xl shadow-md transition-transform duration-200 hover:scale-110">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">{t("welcome.step2Title")}</h4>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed tracking-normal">
                  {t("welcome.step2Description")}
                </p>
              </div>
              <div className="hidden lg:block flex-shrink-0 bg-cyan-50/50 p-4 rounded-3xl shadow-md transition-transform duration-200 ease-out hover:scale-110">
                <Eye className="w-10 h-10 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 hover:from-teal-600 hover:via-teal-500 hover:via-cyan-600 hover:via-cyan-500 hover:to-teal-700 text-white px-12 py-6 text-xl md:text-2xl font-bold rounded-3xl shadow-lg hover:shadow-xl hover:glow-teal transition-all duration-200 ease-out hover:scale-[1.02]"
              onClick={() => router.push("/jobs")}
            >
              <Sparkles className="mr-3 w-6 h-6" />
              {t("welcome.startNow")}
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-border py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{t("welcome.footer")}</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-1.5 text-xs px-3 py-1.5 bg-transparent border-border/50 hover:border-primary/50">
              <Languages className="h-3.5 w-3.5" />
              {t("welcome.language")}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
