"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search, Eye, Sparkles, Languages } from "lucide-react"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"

function WelcomePageContent() {
  const router = useRouter()
  const { resetLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <section className="relative h-[240px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-mountains.jpg" alt="Alto Adige Mountains" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </div>

        <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
          <div className="bg-white rounded-2xl p-3 shadow-xl">
            <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">job*radar</h1>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <LanguageToggleButton />
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/90 hover:bg-white text-foreground rounded-xl shadow-lg"
            onClick={() => router.push("/jobs")}
          >
            Jobs
          </Button>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="bg-white rounded-[2.5rem] p-12 md:p-20 shadow-2xl mb-12 text-center border-2 border-border">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-balance leading-tight">
            Benvenuto al b*coop Job*radar
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Trova velocemente offerte di lavoro attuali in hotel e aziende in Alto Adige. Senza registrazione, subito
            pronto.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-2xl mb-12 border-2 border-border">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-14 text-center">Come funziona</h3>

          <div className="space-y-10 md:space-y-12 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-3xl flex items-center justify-center font-bold text-3xl shadow-xl">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Imposta filtri</h4>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Scegli cosa è importante per te. Puoi cambiare i filtri in qualsiasi momento.
                </p>
              </div>
              <div className="hidden lg:block flex-shrink-0 bg-teal-100 p-5 rounded-3xl shadow-md">
                <Search className="w-12 h-12 text-teal-600" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-3xl flex items-center justify-center font-bold text-3xl shadow-xl">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Sfoglia e contatta</h4>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Visualizza le offerte di lavoro filtrate e contatta direttamente le aziende.
                </p>
              </div>
              <div className="hidden lg:block flex-shrink-0 bg-cyan-100 p-5 rounded-3xl shadow-md">
                <Eye className="w-12 h-12 text-cyan-600" />
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white px-16 py-8 text-xl md:text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push("/jobs")}
            >
              <Sparkles className="mr-3 w-6 h-6" />
              Inizia ora
            </Button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-border py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Job*Radar Alto Adige – Aiuto nella ricerca di lavoro</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-2 text-sm bg-transparent">
              <Languages className="h-4 w-4" />
              Cambia lingua
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function WelcomePage() {
  return (
    <LanguageProvider>
      <WelcomePageContent />
    </LanguageProvider>
  )
}
