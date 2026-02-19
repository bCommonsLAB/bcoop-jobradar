"use client"

import { useState, useEffect } from "react"
import JobCard from "@/components/job-card"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchX } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import type { Job } from "@/lib/job"

interface JobListProps {
  filters: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
    noQualificationRequired: boolean
  }
  onJobSelect: () => void
}

// Skeleton Component für Job Cards mit Shimmer-Effekt
function JobCardSkeleton() {
  return (
    <div className="bg-card border border-border/50 shadow-md rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Image Skeleton mit Shimmer */}
        <div className="relative w-full h-32 md:h-40 flex-shrink-0 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="absolute inset-0 flex items-center justify-center p-2 md:p-3 lg:p-4">
            <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-lg md:rounded-xl lg:rounded-2xl" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-4 md:p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Skeleton className="h-10 w-full rounded-lg md:rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg md:rounded-xl" />
            <Skeleton className="h-10 w-full rounded-lg md:rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobList({ filters, onJobSelect }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isFetchingJobs, setIsFetchingJobs] = useState(true)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const isLoading = isFetchingJobs || isFilterLoading
  const { t } = useTranslation()

  // Initial: Jobs aus der DB laden (serverseitig via API-Route).
  useEffect(() => {
    let isCancelled = false
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    async function loadJobs() {
      setIsFetchingJobs(true)
      setLoadError(null)
      let timeoutTriggered = false

      try {
        console.log('[JobList] Starte Job-Laden von /api/jobs')
        
        // Timeout hinzufügen
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            timeoutTriggered = true
            console.warn('[JobList] Timeout erreicht, breche Anfrage ab')
            controller.abort('Timeout: Anfrage hat zu lange gedauert')
          }
        }, 10000) // 10 Sekunden Timeout

        const res = await fetch("/api/jobs", { signal: controller.signal })
        
        // Timeout-Cleanup nur wenn die Anfrage erfolgreich war
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        console.log('[JobList] API Response Status:', res.status, res.ok)

        if (!res.ok) {
          // Versuche JSON-Antwort zu parsen für detaillierte Fehlermeldung
          let errorMessage = `Jobs konnten nicht geladen werden (HTTP ${res.status}).`
          try {
            const errorData = await res.json()
            if (errorData.error) {
              errorMessage = errorData.error
              if (errorData.details && process.env.NODE_ENV === 'development') {
                errorMessage += `\nDetails: ${errorData.details}`
              }
            }
          } catch {
            // Wenn JSON-Parsing fehlschlägt, verwende Standard-Nachricht
          }
          throw new Error(errorMessage)
        }

        const data = (await res.json()) as { jobs?: Job[] }
        console.log('[JobList] Jobs geladen:', data.jobs?.length || 0, 'Jobs')
        if (!isCancelled) {
          setJobs(data.jobs ?? [])
        }
      } catch (error) {
        // Timeout-Cleanup auch bei Fehler
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        // AbortError ist erwartbar beim Unmount oder Timeout
        const isAbortError = error instanceof DOMException && error.name === "AbortError"
        
        // Nur Fehler anzeigen, wenn die Komponente noch gemountet ist und es kein erwarteter Abort ist
        if (!isCancelled && (!isAbortError || timeoutTriggered)) {
          let message = error instanceof Error ? error.message : "Unbekannter Fehler"
          
          // Spezielle Behandlung für Timeout
          if (timeoutTriggered) {
            message = "Zeitüberschreitung: Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut."
          }
          // Spezielle Behandlung für Network-Fehler
          else if (error instanceof TypeError && error.message.includes('fetch')) {
            message = "Netzwerkfehler: Die Verbindung zum Server konnte nicht hergestellt werden. Stellen Sie sicher, dass der Server läuft."
          }
          
          console.error('[JobList] Zeige Fehler:', message)
          setLoadError(message)
          setJobs([])
          setIsFetchingJobs(false)
        } else if (isAbortError && !timeoutTriggered) {
          // Erwarteter Abort beim Unmount - kein Fehler anzeigen
          console.log('[JobList] Anfrage wurde abgebrochen (Komponente unmounted)')
        }
      } finally {
        // Timeout-Cleanup sicherstellen
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        if (!isCancelled) {
          setIsFetchingJobs(false)
        }
      }
    }

    loadJobs()

    return () => {
      isCancelled = true
      // Timeout-Cleanup vor dem Abort
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      // Abort mit Grund, um "signal is aborted without reason" zu vermeiden
      if (!controller.signal.aborted) {
        controller.abort('Komponente wurde unmounted')
      }
    }
  }, [])

  useEffect(() => {
    setIsFilterLoading(true)
    const timer = setTimeout(() => {
      setIsFilterLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters.jobTypes, filters.timeframe, filters.locations])

  const filteredJobs = jobs.filter((job) => {
    // Filter by job types (array)
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes("all")) {
      // Check if job matches any of the selected types
      const matchesJobType = filters.jobTypes.some((selectedType) => {
        // Check if it's a custom job
        if (selectedType.startsWith("custom-")) {
          // For custom jobs, we need to match by title or id
          // For now, we'll skip this filter for custom jobs since we don't have a mapping
          // In a real app, this would be handled properly
          return false
        } else {
          // Standard job type filter
          return job.jobType === selectedType
        }
      })
      
      if (!matchesJobType) {
        return false
      }
    }

    // Filter by timeframe
    if (filters.timeframe !== "all") {
      const today = new Date()
      const jobDate = parseJobDate(job.startDate)

      if (filters.timeframe === "week") {
        const oneWeekFromNow = new Date(today)
        oneWeekFromNow.setDate(today.getDate() + 7)
        if (jobDate > oneWeekFromNow) {
          return false
        }
      } else if (filters.timeframe === "month") {
        const oneMonthFromNow = new Date(today)
        oneMonthFromNow.setMonth(today.getMonth() + 1)
        if (jobDate > oneMonthFromNow) {
          return false
        }
      }
    }

    // Filter by locations (array)
    if (filters.locations.length > 0 && !filters.locations.includes("all")) {
      // Check if job matches any of the selected locations
      const matchesLocation = filters.locations.includes(job.locationRegion)
      if (!matchesLocation) {
        return false
      }
    }

    // Filter by qualification requirement
    if (filters.noQualificationRequired) {
      // A job has no qualification requirements if:
      // - experienceLevel === "Principiante" OR
      // - (experienceLevel is undefined/missing AND education is undefined/missing)
      const hasNoQualification = 
        job.experienceLevel === "Principiante" ||
        (!job.experienceLevel && !job.education)
      
      if (!hasNoQualification) {
        return false
      }
    }

    return true
  })

  // Helper function to parse job start dates
  function parseJobDate(dateStr: string): Date {
    if (dateStr.toLowerCase() === "subito") {
      return new Date() // "Subito" means immediate start
    }
    // Parse DD.MM.YYYY format
    const parts = dateStr.split(".")
    if (parts.length === 3) {
      return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
    }
    return new Date()
  }

  // Mapping zwischen locationRegion und Ortsnamen
  const getCityNameForRegion = (region: string): string => {
    const regionToCity: Record<string, string> = {
      "bolzano": "Bolzano",
      "merano": "Merano",
      "bressanone": "Bressanone",
      "brunico": "Brunico",
      "vipiteno": "Vipiteno",
      // Für Regionen wie val-pusteria und val-venosta gibt es keinen einzelnen Ort
    }
    return regionToCity[region] || ""
  }

  // Sortiere Jobs: zuerst nach Filter-Reihenfolge, dann nach Ort
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    // 1. Sortierung nach Filter-Reihenfolge (jobTypes Array-Reihenfolge)
    if (filters.jobTypes.length > 0 && !filters.jobTypes.includes("all")) {
      // Finde die Position jedes Jobs im jobTypes Array
      const aIndex = filters.jobTypes.findIndex((type) => {
        // Custom Jobs werden ignoriert für die Standard-Sortierung
        if (type.startsWith("custom-")) return false
        return a.jobType === type
      })
      
      const bIndex = filters.jobTypes.findIndex((type) => {
        if (type.startsWith("custom-")) return false
        return b.jobType === type
      })

      // Wenn beide Jobs in der Filter-Liste sind, sortiere nach Position
      if (aIndex !== -1 && bIndex !== -1) {
        // Jobs sind in unterschiedlichen Filter-Kategorien, sortiere nach Reihenfolge
        if (aIndex !== bIndex) {
          return aIndex - bIndex
        }
        // Jobs sind in derselben Filter-Kategorie, weiter mit Ort-Sortierung
      } else if (aIndex !== -1 && bIndex === -1) {
        // a ist in der Liste, b nicht → a kommt zuerst
        return -1
      } else if (aIndex === -1 && bIndex !== -1) {
        // b ist in der Liste, a nicht → b kommt zuerst
        return 1
      }
      // Beide nicht in der Liste, weiter mit Ort-Sortierung
    }

    // 2. Sortierung nach Ort (innerhalb derselben Filter-Kategorie)
    const activeLocations = filters.locations.filter((l) => l !== "all")
    if (activeLocations.length === 1) {
      const cityName = getCityNameForRegion(activeLocations[0])
      
      if (cityName) {
        const aIsDirectCity = a.location === cityName
        const bIsDirectCity = b.location === cityName

        // Direkte Stadt-Jobs zuerst
        if (aIsDirectCity && !bIsDirectCity) return -1
        if (!aIsDirectCity && bIsDirectCity) return 1
      }
    }

    // Beide sind gleich priorisiert, keine Änderung der Reihenfolge
    return 0
  })

  return (
    <div>
      <h2 className="text-sm md:text-lg font-bold text-foreground mb-2 md:mb-4">
        {isLoading ? (
          <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
        ) : (
          `${sortedJobs.length} ${t("jobList.jobsFound")}`
        )}
      </h2>
      {loadError && (
        <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs md:text-sm text-red-700 whitespace-pre-line">
          {loadError}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-1.5 md:gap-2.5 lg:gap-3">
        {isLoading ? (
          <>
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </>
        ) : sortedJobs.length > 0 ? (
          sortedJobs.map((job) => <JobCard key={job.id} job={job} onSelect={onJobSelect} />)
        ) : (
          <div className="col-span-full">
            <div className="bg-card rounded-xl md:rounded-2xl p-8 md:p-12 shadow-xl text-center border-2 border-border">
              <div className="flex flex-col items-center gap-3 md:gap-4">
                <SearchX className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground opacity-50" />
                <div className="space-y-1.5 md:space-y-2">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{t("jobList.noJobsFound")}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {t("jobList.tryModifySelection")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
