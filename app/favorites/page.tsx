"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Languages, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobCard from "@/components/job-card"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useTranslation } from "@/hooks/use-translation"
import { getLikedJobs } from "@/lib/liked-jobs"
import type { Job } from "@/lib/job"
import { Skeleton } from "@/components/ui/skeleton"

function FavoritesPageContent() {
  const [likedJobIds, setLikedJobIds] = useState<string[]>([])
  const [likedJobs, setLikedJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const { resetLanguage } = useLanguage()
  const { t } = useTranslation()

  // Lade gelikte Job-IDs und dann die Jobs
  useEffect(() => {
    const loadLikedJobs = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        // Lade gelikte Job-IDs aus localStorage
        const likedIds = getLikedJobs()
        setLikedJobIds(likedIds)

        if (likedIds.length === 0) {
          setLikedJobs([])
          setIsLoading(false)
          return
        }

        // Lade alle Jobs von der API
        const res = await fetch("/api/jobs")
        if (!res.ok) {
          throw new Error(`Jobs konnten nicht geladen werden (HTTP ${res.status}).`)
        }

        const data = await res.json() as { jobs?: Job[] }
        const allJobs: Job[] = Array.isArray(data?.jobs) ? data.jobs : []

        // Filtere nur gelikte Jobs
        const filtered = allJobs.filter((job) => likedIds.includes(job.id))
        setLikedJobs(filtered)
      } catch (error) {
        console.error("Error loading liked jobs:", error)
        setLoadError(error instanceof Error ? error.message : "Fehler beim Laden der Jobs")
      } finally {
        setIsLoading(false)
      }
    }

    loadLikedJobs()

    // Listener für Änderungen in localStorage (wenn Jobs geliked/unliked werden)
    const handleStorageChange = () => {
      loadLikedJobs()
    }

    window.addEventListener("storage", handleStorageChange)
    // Custom Event für Like-Änderungen innerhalb derselben Seite
    window.addEventListener("job-liked-changed", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("job-liked-changed", handleStorageChange)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20">
      <header className="relative bg-gradient-to-br from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 text-white py-2 md:py-5 lg:py-6 px-3 md:px-6 lg:px-8 shadow-lg overflow-hidden">
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
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-4 md:h-8 lg:h-10 mix-blend-screen" />
            </div>
            <div className="h-4 md:h-8 lg:h-10 w-px bg-white/30" />
            <h1 className="text-xs md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg whitespace-nowrap">job*radar</h1>
          </div>
          <div className="flex items-center gap-1.5 md:gap-4 lg:gap-5">
            <LanguageToggleButton />
          </div>
        </div>
      </header>

      <div className="relative min-h-[calc(100vh-200px)]">
        {/* Hintergrundbild für Content-Bereich */}
        <div className="fixed inset-0 z-0">
          <Image 
            src="/hero-lake.png" 
            alt="Mountain Lake Landscape" 
            fill 
            className="object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-accent/20 to-accent/30" />
        </div>
        
        {/* Content mit Glassmorphism */}
        <div className="relative z-10 w-full px-3 md:px-6 lg:px-8 pt-5 md:pt-8 lg:pt-10">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <Link href="/jobs">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 md:gap-2 bg-white/80 backdrop-blur-md border border-white/40 rounded-lg md:rounded-xl shadow-lg hover:shadow-xl hover:bg-white/90 transition-all px-3 md:px-4 py-2 text-xs md:text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                {t("nav.backToJobs")}
              </Button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl border border-white/40 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-primary/10 rounded-lg md:rounded-xl">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-primary fill-primary" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                    {t("favorites.title")}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full px-2 md:px-5 pb-6 md:pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 backdrop-blur-md border border-white/40 shadow-lg rounded-lg md:rounded-xl overflow-hidden">
                  <Skeleton className="w-full h-32 md:h-40" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : loadError ? (
            <div className="bg-white/80 backdrop-blur-lg border border-destructive/30 rounded-lg md:rounded-xl p-4 md:p-6 text-center shadow-xl">
              <p className="text-sm md:text-base text-destructive font-semibold">{loadError}</p>
            </div>
          ) : likedJobs.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl md:rounded-2xl lg:rounded-3xl p-10 md:p-14 lg:p-16 text-center shadow-xl border border-white/40">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-center mb-6 md:mb-8">
                  <div className="p-4 md:p-5 bg-muted/50 rounded-full">
                    <Heart className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/40" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-3 md:mb-4">
                  {t("favorites.emptyTitle")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  {t("favorites.emptyDescription")}
                </p>
                <Link href="/jobs">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-medium rounded-lg md:rounded-xl"
                  >
                    {t("favorites.browseJobs")}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {likedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-white border-t border-border py-2 md:py-5 px-2 md:px-4 mt-auto relative z-10">
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

export default function FavoritesPage() {
  return (
    <LanguageProvider>
      <FavoritesPageContent />
    </LanguageProvider>
  )
}

