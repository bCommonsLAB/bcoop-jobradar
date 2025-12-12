"use client"

import JobCard from "@/components/job-card"
import { dummyJobs } from "@/lib/data/dummy-jobs"

interface JobListProps {
  filters: {
    jobType: string
    timeframe: string
    location: string
  }
  onJobSelect: () => void
}

// Verwende die Dummy-Daten aus lib/data/dummy-jobs.ts
const sampleJobs = dummyJobs

export default function JobList({ filters, onJobSelect }: JobListProps) {
  const filteredJobs = sampleJobs.filter((job) => {
    // Filter by job type
    if (filters.jobType !== "all") {
      // Check if it's a custom job (from "Altri lavori")
      if (filters.jobType.startsWith("custom-")) {
        const customJobId = filters.jobType.replace("custom-", "")
        // For custom jobs, we need to match by title or id
        // For now, we'll skip this filter for custom jobs since we don't have a mapping
        // In a real app, this would be handled properly
      } else {
        // Standard job type filter
        if (job.jobType !== filters.jobType) {
          return false
        }
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

    // Filter by location
    if (filters.location !== "all") {
      if (job.locationRegion !== filters.location) {
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">{filteredJobs.length} lavori trovati</h2>
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} onSelect={onJobSelect} />)
      ) : (
        <div className="bg-white rounded-[2rem] p-10 md:p-12 shadow-xl text-center border-2 border-border">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Nessun lavoro trovato con questi filtri. Prova a modificare la tua selezione.
          </p>
        </div>
      )}
    </div>
  )
}
