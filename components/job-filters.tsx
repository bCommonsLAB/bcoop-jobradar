"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ChefHat,
  Sparkles,
  Bed,
  Users,
  Coffee,
  UtensilsCrossed,
  Mountain,
  MapPin,
  Search,
  Briefcase,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/hooks/use-translation"

interface JobFiltersProps {
  onSubmit: (filters: { jobTypes: string[]; timeframe: string; locations: string[] }) => void
  initialFilters?: { jobTypes: string[]; timeframe: string; locations: string[] }
  autoApply?: boolean
  showSubmitButton?: boolean
}

interface CustomJob {
  id: number
  title: string
  value: string
}

export default function JobFilters({ 
  onSubmit, 
  initialFilters, 
  autoApply = false,
  showSubmitButton = true 
}: JobFiltersProps) {
  const { t } = useTranslation()
  const [jobTypes, setJobTypes] = useState<string[]>(initialFilters?.jobTypes || [])
  const [timeframe, setTimeframe] = useState<string>(initialFilters?.timeframe || "all")
  const [locations, setLocations] = useState<string[]>(initialFilters?.locations || [])
  const [isJobSelectorOpen, setIsJobSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customJobs, setCustomJobs] = useState<CustomJob[]>([])

  // Update state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setJobTypes(initialFilters.jobTypes || [])
      setTimeframe(initialFilters.timeframe || "all")
      setLocations(initialFilters.locations || [])
    }
  }, [initialFilters])

  const predefinedJobs = [
    { id: 1, title: "Aiuto cuoco (m/f/d)", company: "Ristorante Alto Adige", location: "Bolzano", type: "Part-time" },
    { id: 2, title: "Cameriere/a (m/f/d)", company: "Hotel Dolomiti", location: "Merano", type: "Full-time" },
    { id: 3, title: "Receptionist (m/f/d)", company: "Hotel Cristallo", location: "Cortina", type: "Full-time" },
    { id: 4, title: "Barista (m/f/d)", company: "Caffè Centrale", location: "Bolzano", type: "Part-time" },
    { id: 5, title: "Addetto/a pulizie (m/f/d)", company: "Hotel Alpino", location: "Bressanone", type: "Full-time" },
    { id: 6, title: "Chef de rang (m/f/d)", company: "Ristorante Gourmet", location: "Merano", type: "Full-time" },
    { id: 7, title: "Lavapiatti (m/f/d)", company: "Trattoria La Montagna", location: "Bolzano", type: "Part-time" },
    { id: 8, title: "Commis di cucina (m/f/d)", company: "Hotel Luxury", location: "Brunico", type: "Full-time" },
  ]

  const filteredJobs = predefinedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleJobSelect = (job: (typeof predefinedJobs)[0]) => {
    const jobValue = `custom-${job.id}`
    const customJob: CustomJob = {
      id: job.id,
      title: job.title,
      value: jobValue,
    }

    // Add to customJobs if not already there
    if (!customJobs.find((j) => j.id === job.id)) {
      setCustomJobs([...customJobs, customJob])
    }

    // Toggle job selection
    const newJobTypes = jobTypes.includes(jobValue)
      ? jobTypes.filter((t) => t !== jobValue)
      : [...jobTypes.filter((t) => t !== "all"), jobValue]
    
    setJobTypes(newJobTypes)
    setIsJobSelectorOpen(false)
    setSearchQuery("")
    
    if (autoApply) {
      onSubmit({ jobTypes: newJobTypes, timeframe, locations })
    }
  }

  const removeCustomJob = (jobId: number) => {
    const jobValue = `custom-${jobId}`
    setCustomJobs(customJobs.filter((job) => job.id !== jobId))
    setJobTypes(jobTypes.filter((t) => t !== jobValue))
    
    if (autoApply) {
      onSubmit({ jobTypes: jobTypes.filter((t) => t !== jobValue), timeframe, locations })
    }
  }

  const handleSubmit = () => {
    onSubmit({ jobTypes, timeframe, locations })
  }

  const handleJobTypeToggle = (value: string) => {
    let newJobTypes: string[]
    
    if (value === "all") {
      // If "all" is clicked and already selected, deselect all. Otherwise, select only "all"
      newJobTypes = jobTypes.includes("all") ? [] : ["all"]
    } else {
      // Remove "all" if present, then toggle the selected value
      const withoutAll = jobTypes.filter((t) => t !== "all")
      newJobTypes = withoutAll.includes(value)
        ? withoutAll.filter((t) => t !== value)
        : [...withoutAll, value]
    }
    
    setJobTypes(newJobTypes)
    
    if (autoApply) {
      onSubmit({ jobTypes: newJobTypes, timeframe, locations })
    }
  }

  const handleLocationToggle = (value: string) => {
    let newLocations: string[]
    
    if (value === "all") {
      // If "all" is clicked and already selected, deselect all. Otherwise, select only "all"
      newLocations = locations.includes("all") ? [] : ["all"]
    } else {
      // Remove "all" if present, then toggle the selected value
      const withoutAll = locations.filter((l) => l !== "all")
      newLocations = withoutAll.includes(value)
        ? withoutAll.filter((l) => l !== value)
        : [...withoutAll, value]
    }
    
    setLocations(newLocations)
    
    if (autoApply) {
      onSubmit({ jobTypes, timeframe, locations: newLocations })
    }
  }

  const handleFilterChange = (filterType: "timeframe", value: string) => {
    if (filterType === "timeframe") {
      setTimeframe(value)
      if (autoApply) {
        onSubmit({ jobTypes, timeframe: value, locations })
      }
    }
  }

  const jobTypeOptions = [
    { value: "all", label: t("jobTypes.all"), icon: Sparkles },
    { value: "kitchen", label: t("jobTypes.kitchen"), icon: ChefHat },
    { value: "dishwasher", label: t("jobTypes.dishwasher"), icon: UtensilsCrossed },
    { value: "housekeeping", label: t("jobTypes.housekeeping"), icon: Bed },
    { value: "helper", label: t("jobTypes.helper"), icon: Users },
    { value: "service", label: t("jobTypes.service"), icon: Coffee },
  ]

  const locationOptions = [
    { value: "all", label: t("locations.all"), icon: MapPin },
    { value: "bolzano", label: t("locations.bolzano"), icon: Mountain },
    { value: "merano", label: t("locations.merano"), icon: Mountain },
    { value: "bressanone", label: t("locations.bressanone"), icon: Mountain },
    { value: "brunico", label: t("locations.brunico"), icon: Mountain },
    { value: "vipiteno", label: t("locations.vipiteno"), icon: Mountain },
    { value: "val-pusteria", label: t("locations.valPusteria"), icon: Mountain },
    { value: "val-venosta", label: t("locations.valVenosta"), icon: Mountain },
  ]

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md space-y-10">
      <Dialog open={isJobSelectorOpen} onOpenChange={setIsJobSelectorOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-border">
            <DialogTitle className="text-2xl font-bold text-foreground">{t("filters.otherJobs")}</DialogTitle>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t("filters.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base rounded-[1rem] border-2 focus:border-primary"
              />
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[50vh] p-6 space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className="w-full text-left p-5 rounded-[1.25rem] border-2 border-border/50 bg-white hover:border-primary hover:shadow-lg transition-all hover:scale-[1.02] space-y-2"
                >
                  <div className="font-bold text-lg text-foreground">{job.title}</div>
                  <div className="text-sm text-muted-foreground">{job.company}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{job.type}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nessun lavoro trovato. Prova con un'altra ricerca.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Type */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">{t("filters.jobType")}</label>
        <div className="grid grid-cols-2 gap-4">
          {jobTypeOptions.map((type) => {
            const Icon = type.icon
            const isSelected = jobTypes.includes(type.value)
            return (
              <button
                key={type.value}
                onClick={() => handleJobTypeToggle(type.value)}
                className={`py-4 px-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-lg scale-[1.02] ring-1 ring-primary/30"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
                }`}
              >
                <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-primary"}`} />
                {type.label}
              </button>
            )
          })}
          {customJobs.map((job) => {
            const isSelected = jobTypes.includes(job.value)
            return (
              <div
                key={job.value}
                onClick={() => handleJobTypeToggle(job.value)}
                className={`py-4 px-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 relative cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-lg scale-[1.02] ring-1 ring-primary/30"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
                }`}
              >
                <Briefcase className={`w-7 h-7 ${isSelected ? "text-white" : "text-primary"}`} />
                <span className="text-sm leading-tight">{job.title}</span>
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCustomJob(job.id)
                  }}
                  className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-white text-primary hover:bg-gray-100"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => setIsJobSelectorOpen(true)}
          className="w-full py-4 px-5 rounded-2xl text-base md:text-lg font-semibold transition-all duration-200 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50 text-primary hover:border-primary hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          <Search className="w-5 h-5" />
          Altri lavori
        </button>
      </div>

      {/* Timeframe */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">{t("filters.period")}</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "all", label: t("timeframes.all") },
            { value: "week", label: t("timeframes.week") },
            { value: "month", label: t("timeframes.month") },
          ].map((time) => (
            <button
              key={time.value}
              onClick={() => handleFilterChange("timeframe", time.value)}
              className={`py-4 px-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-200 border-2 ${
                timeframe === time.value
                  ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-lg scale-[1.02] ring-1 ring-primary/30"
                  : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">{t("filters.location")}</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {locationOptions.map((loc) => {
            const Icon = loc.icon
            const isSelected = locations.includes(loc.value)
            return (
              <button
                key={loc.value}
                onClick={() => handleLocationToggle(loc.value)}
                className={`py-4 px-4 rounded-2xl text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-lg scale-[1.02] ring-1 ring-primary/30"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-md hover:scale-[1.02]"
                }`}
              >
                <Icon className={`w-7 h-7 ${isSelected ? "text-white" : "text-primary"}`} />
                {loc.label}
              </button>
            )
          })}
        </div>
      </div>

      {showSubmitButton && (
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full py-6 text-xl font-bold shadow-lg gap-3 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-cyan-600 hover:from-primary/90 hover:via-primary/80 hover:to-cyan-600/90 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:glow-primary"
        >
          {t("filters.continueToOffers")}
          <ArrowRight className="w-6 h-6" />
        </Button>
      )}
    </div>
  )
}
