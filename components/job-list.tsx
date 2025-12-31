"use client"

import { useState, useEffect } from "react"
import JobCard from "@/components/job-card"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchX } from "lucide-react"
import { dummyJobs } from "@/lib/data/dummy-jobs"
import { useTranslation } from "@/hooks/use-translation"

interface JobListProps {
  filters: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
  }
  onJobSelect: () => void
}

// Verwende die Dummy-Daten aus lib/data/dummy-jobs.ts
const sampleJobs = dummyJobs

// Skeleton Component für Job Cards
function JobCardSkeleton() {
  return (
    <div className="bg-white border-0 shadow-xl rounded-[2rem] overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Left: Image Skeleton */}
        <div className="relative w-full sm:w-32 md:w-40 h-32 sm:h-auto flex-shrink-0 bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl" />
          </div>
        </div>

        {/* Right: Content Skeleton */}
        <div className="flex-1 p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-3 pt-3">
            <Skeleton className="h-12 flex-1 min-w-[160px] rounded-2xl" />
            <Skeleton className="h-12 flex-1 min-w-[160px] rounded-2xl" />
            <Skeleton className="h-12 flex-1 min-w-[160px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function JobList({ filters, onJobSelect }: JobListProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [filters.jobTypes, filters.timeframe, filters.locations])

  const filteredJobs = sampleJobs.filter((job) => {
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

  // Sortiere Jobs: zuerst direkte Stadt-Jobs, dann Region-Jobs
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    // Wenn kein spezifischer Ort ausgewählt ist oder mehrere, keine Sortierung
    const activeLocations = filters.locations.filter((l) => l !== "all")
    if (activeLocations.length !== 1) {
      return 0
    }

    const cityName = getCityNameForRegion(activeLocations[0])
    
    // Wenn kein Mapping existiert (z.B. val-pusteria), keine Sortierung
    if (!cityName) {
      return 0
    }

    const aIsDirectCity = a.location === cityName
    const bIsDirectCity = b.location === cityName

    // Direkte Stadt-Jobs zuerst
    if (aIsDirectCity && !bIsDirectCity) return -1
    if (!aIsDirectCity && bIsDirectCity) return 1

    // Beide sind gleich priorisiert, keine Änderung der Reihenfolge
    return 0
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {isLoading ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          `${sortedJobs.length} ${t("jobList.jobsFound")}`
        )}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="bg-white rounded-[2rem] p-12 md:p-16 shadow-xl text-center border-2 border-border">
              <div className="flex flex-col items-center gap-4">
                <SearchX className="w-16 h-16 md:w-20 md:h-20 text-muted-foreground opacity-50" />
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t("jobList.noJobsFound")}</h3>
                  <p className="text-lg md:text-xl text-muted-foreground">
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
