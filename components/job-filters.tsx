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
  Calendar,
  Search,
  Briefcase,
  X,
  GraduationCap,
  AlertCircle,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import { iconSizes } from "@/lib/icon-sizes"
import { cn } from "@/lib/utils"
import { getJobTypeTone } from "@/lib/job-type-colors"
import { useLanguage } from "@/components/language-provider"
import { jobTitles, getJobTitle, getJobDescription } from "@/lib/job-titles"

interface JobFiltersProps {
  onSubmit: (filters: { jobTypes: string[]; timeframe: string; locations: string[]; noQualificationRequired: boolean }) => void
  initialFilters?: { jobTypes: string[]; timeframe: string; locations: string[]; noQualificationRequired?: boolean }
  autoApply?: boolean
  showSubmitButton?: boolean
  title?: string
}

interface CustomJob {
  id: number | string
  title: string
  value: string
}


export default function JobFilters({ 
  onSubmit, 
  initialFilters, 
  autoApply = false,
  showSubmitButton = true,
  title
}: JobFiltersProps) {
  const { t } = useTranslation()
  const { toast } = useToast()
  const { language } = useLanguage()
  const [jobTypes, setJobTypes] = useState<string[]>(() => {
    if (initialFilters?.jobTypes && initialFilters.jobTypes.length > 0) {
      return initialFilters.jobTypes
    }
    return ["all"]
  })
  const [timeframe, setTimeframe] = useState<string>(initialFilters?.timeframe || "all")
  const [locations, setLocations] = useState<string[]>(() => {
    if (initialFilters?.locations && initialFilters.locations.length > 0) {
      return initialFilters.locations
    }
    return ["all"]
  })
  const [noQualificationRequired, setNoQualificationRequired] = useState<boolean>(initialFilters?.noQualificationRequired || false)
  const [isJobSelectorOpen, setIsJobSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customJobs, setCustomJobs] = useState<CustomJob[]>([])
  const [showJobTypeError, setShowJobTypeError] = useState(false)
  const [showLocationError, setShowLocationError] = useState(false)

  // Update state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setJobTypes(initialFilters.jobTypes && initialFilters.jobTypes.length > 0 ? initialFilters.jobTypes : ["all"])
      setTimeframe(initialFilters.timeframe || "all")
      setLocations(initialFilters.locations && initialFilters.locations.length > 0 ? initialFilters.locations : ["all"])
      setNoQualificationRequired(initialFilters.noQualificationRequired || false)
    }
  }, [initialFilters])

  // Update customJobs titles when language changes
  useEffect(() => {
    setCustomJobs(prevCustomJobs => 
      prevCustomJobs.map(customJob => {
        // Extract job ID from value (format: "custom-{id}")
        const jobId = typeof customJob.id === 'string' ? parseInt(customJob.id) : customJob.id
        const title = getJobTitle(jobId, language)
        if (title) {
          return {
            ...customJob,
            title: title
          }
        }
        return customJob
      })
    )
  }, [language])

  // Get all jobs from predefined list with translations for current language
  const allJobsForModal = jobTitles.map((job) => {
    const title = getJobTitle(job.id, language)
    const description = getJobDescription(job.id, language)
    return {
      id: job.id,
      title: title || job.titleIt,         // Für Anzeige (sprachabhängig)
      description: description || job.it,   // Für Anzeige (sprachabhängig)
      titleIt: job.titleIt,                // Für Suche
      titleDe: job.titleDe,                // Für Suche
      titleEn: job.titleEn,                // Für Suche
      it: job.it,                          // Für Suche
      de: job.de,                          // Für Suche
      en: job.en,                          // Für Suche
      aliases: job.aliases || [],
    }
  })

  const filteredJobs = allJobsForModal.filter((job) => {
    const q = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(q) ||
      job.titleIt.toLowerCase().includes(q) ||
      job.titleDe.toLowerCase().includes(q) ||
      job.titleEn.toLowerCase().includes(q) ||
      job.it.toLowerCase().includes(q) ||
      job.de.toLowerCase().includes(q) ||
      job.en.toLowerCase().includes(q) ||
      job.aliases.some((alias) => alias.toLowerCase().includes(q))
    )
  })

  // Filter out jobs that are already selected (appear as custom job chips)
  const jobsAvailableInModal = filteredJobs.filter(
    (job) => !jobTypes.includes(`custom-${job.id}`)
  )

  const handleJobSelect = (job: { id: number; title: string; description: string }) => {
    const jobValue = `custom-${job.id}`
    const customJob: CustomJob = {
      id: job.id,
      title: job.title,
      value: jobValue,
    }

    // Add to customJobs if not already there
    if (!customJobs.find((j) => j.id === job.id && j.value === jobValue)) {
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
      onSubmit({ jobTypes: newJobTypes, timeframe, locations, noQualificationRequired })
    }
  }

  const removeCustomJob = (jobId: number | string) => {
    const jobValue = `custom-${jobId}`
    setCustomJobs(customJobs.filter((job) => job.id !== jobId))
    setJobTypes(jobTypes.filter((t) => t !== jobValue))
    
    if (autoApply) {
      onSubmit({ jobTypes: jobTypes.filter((t) => t !== jobValue), timeframe, locations, noQualificationRequired })
    }
  }

  const handleSubmit = () => {
    // Prüfen, welche Kategorien fehlen
    const hasJobTypes = jobTypes.length > 0
    const hasLocations = locations.length > 0
    
    // Fehlermeldungen setzen
    setShowJobTypeError(!hasJobTypes)
    setShowLocationError(!hasLocations)
    
    // Nur submitten, wenn alle Kategorien ausgefüllt sind
    if (hasJobTypes && hasLocations) {
      onSubmit({ jobTypes, timeframe, locations, noQualificationRequired })
    }
  }

  const handleQualificationToggle = (checked: boolean) => {
    setNoQualificationRequired(checked)
    
    // Toast-Benachrichtigung
    if (checked) {
      toast({
        title: t("filters.qualificationFilterActive") || "Filter aktiviert",
        description: t("filters.qualificationFilterDescription") || "Es werden nur Jobs ohne Qualifikationsanforderungen angezeigt.",
      })
    }
    
    // Filter submitten ohne Job-Typen zu ändern
    if (autoApply) {
      onSubmit({ jobTypes, timeframe, locations, noQualificationRequired: checked })
    }
  }
  
  const handleShowAllJobs = () => {
    setJobTypes(["all"])
    toast({
      title: t("filters.allJobsShown") || "Alle Jobs angezeigt",
      description: t("filters.allJobsShownDescription") || "Alle verfügbaren Jobs werden jetzt angezeigt.",
    })
    if (autoApply) {
      onSubmit({ jobTypes: ["all"], timeframe, locations, noQualificationRequired })
    }
  }

  const handleJobTypeToggle = (value: string) => {
    // Fehlermeldung zurücksetzen, wenn eine Auswahl getroffen wird
    setShowJobTypeError(false)
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
      onSubmit({ jobTypes: newJobTypes, timeframe, locations, noQualificationRequired })
    }
  }

  const handleLocationToggle = (value: string) => {
    // Fehlermeldung zurücksetzen, wenn eine Auswahl getroffen wird
    setShowLocationError(false)
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
      onSubmit({ jobTypes, timeframe, locations: newLocations, noQualificationRequired })
    }
  }

  const handleFilterChange = (filterType: "timeframe", value: string) => {
    if (filterType === "timeframe") {
      setTimeframe(value)
      if (autoApply) {
        onSubmit({ jobTypes, timeframe: value, locations, noQualificationRequired })
      }
    }
  }

  // Validierungsfunktion: Prüft ob alle Kategorien mindestens eine Auswahl haben
  const isFormValid = () => {
    const hasJobTypes = jobTypes.length > 0
    const hasLocations = locations.length > 0
    const hasTimeframe = timeframe !== "" && timeframe !== undefined
    
    return hasJobTypes && hasLocations && hasTimeframe
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
    { value: "bressanone", label: t("locations.bressanone"), icon: Mountain },
    { value: "bolzano", label: t("locations.bolzano"), icon: Mountain },
    { value: "merano", label: t("locations.merano"), icon: Mountain },
    { value: "brunico", label: t("locations.brunico"), icon: Mountain },
    { value: "vipiteno", label: t("locations.vipiteno"), icon: Mountain },
    { value: "val-pusteria", label: t("locations.valPusteria"), icon: Mountain },
    { value: "val-venosta", label: t("locations.valVenosta"), icon: Mountain },
  ]

  return (
    <div className="bg-card rounded-lg md:rounded-3xl p-2 md:p-6 shadow-lg space-y-1.5 md:space-y-4">
      <div className={`${title ? "pb-2 md:pb-3 border-b border-border/50" : "pb-2"} flex items-center ${title ? "justify-between" : "justify-end"}`}>
        {title && (
          <h2 className="text-base md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {title}
          </h2>
        )}
        {/* Qualification Toggle - oben rechts */}
        <div 
          className={cn(
            "flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl border-2 transition-all duration-200",
            noQualificationRequired
              ? "bg-gradient-to-br from-primary/20 to-cyan-50 border-primary shadow-md scale-105"
              : "bg-card border-border/50 hover:border-primary/50"
          )}
          role="group"
          aria-label="Qualifikationsfilter"
        >
          <GraduationCap className={cn(iconSizes.sm, noQualificationRequired ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
          <Label 
            htmlFor="qualification-toggle" 
            className={cn(
              "text-[10px] md:text-xs font-medium cursor-pointer whitespace-nowrap",
              noQualificationRequired ? "text-primary font-semibold" : "text-muted-foreground"
            )}
          >
            {t("filters.noQualificationRequired")}
          </Label>
          <Switch
            id="qualification-toggle"
            checked={noQualificationRequired}
            onCheckedChange={handleQualificationToggle}
            className="scale-75 md:scale-100"
            aria-label={t("filters.noQualificationRequired")}
            aria-describedby="qualification-toggle-description"
          />
          {noQualificationRequired && (
            <span className="sr-only" id="qualification-toggle-description">
              Filtert Jobs ohne Qualifikationsanforderungen. Relevante Jobs werden automatisch ausgewählt.
            </span>
          )}
        </div>
      </div>
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

          <div className="overflow-y-auto max-h-[50vh] p-6">
            {jobsAvailableInModal.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {jobsAvailableInModal.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    className="text-left p-4 rounded-[1.25rem] border-2 border-border/50 bg-card hover:border-primary hover:shadow-lg transition-all hover:scale-[1.02] flex items-start gap-3"
                  >
                    <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base md:text-lg text-foreground mb-1">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nessun lavoro trovato. Prova con un'altra ricerca.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Type - Verbesserte Gruppierung */}
      <div className="space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg md:rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ChefHat className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <div>
              <h3 className="text-base md:text-lg font-bold text-foreground">{t("filters.jobType")}</h3>
              <p className="text-xs text-muted-foreground hidden md:block">Wähle deinen Arbeitsbereich</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
          {jobTypeOptions.map((type) => {
            const Icon = type.icon
            const isSelected = jobTypes.includes(type.value)
            const tone = getJobTypeTone(type.value)
            return (
              <button
                key={type.value}
                onClick={() => handleJobTypeToggle(type.value)}
                className={cn(
                  "py-1 md:py-2 px-1 md:px-2 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold transition-all duration-200 border-2 flex flex-col items-center gap-0.5 md:gap-1 touch-manipulation min-h-[44px]",
                  isSelected
                    ? tone.buttonSelected
                    : tone.buttonUnselected
                )}
                aria-label={`${type.label} ${isSelected ? "ausgewählt" : "auswählen"}`}
                aria-pressed={isSelected}
              >
                <Icon
                  className={cn("w-3 h-3 md:w-4 md:h-4", isSelected ? "text-white" : tone.iconUnselected)}
                  aria-hidden="true"
                />
                <span className="text-center leading-tight">{type.label}</span>
              </button>
            )
          })}
          {customJobs.map((job) => {
            const isSelected = jobTypes.includes(job.value)
            return (
              <div
                key={job.value}
                onClick={() => handleJobTypeToggle(job.value)}
                className={`py-1.5 md:py-2 px-1 md:px-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 border-2 flex flex-col items-center gap-0.5 md:gap-1 relative cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-md scale-[1.02] ring-1 ring-primary/30"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-sm hover:scale-[1.02]"
                }`}
              >
                <Briefcase className={cn(iconSizes.sm, isSelected ? "text-white" : "text-primary")} />
                <span className="text-center leading-tight line-clamp-2">{job.title}</span>
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCustomJob(job.id)
                  }}
                  className={`absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-card text-primary hover:bg-accent"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            )
          })}
        </div>
        <button
          onClick={() => setIsJobSelectorOpen(true)}
          className="w-full py-1.5 md:py-2 px-2 md:px-3 rounded-md md:rounded-lg text-[10px] md:text-xs font-semibold transition-all duration-200 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50 text-primary hover:border-primary hover:shadow-sm hover:scale-[1.02] flex items-center justify-center gap-1"
        >
          <Search className="w-3 h-3 md:w-3.5 md:h-3.5" />
          Altri lavori
        </button>
        {showJobTypeError && (
          <div className="mt-2 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>{t("filters.pleaseSelectFilter")}</span>
          </div>
        )}
      </div>

      {/* Timeframe - Verbesserte Gruppierung */}
      <div className="space-y-3 md:space-y-4 p-4 md:p-6 rounded-lg md:rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">{t("filters.period")}</h3>
            <p className="text-xs text-muted-foreground hidden md:block">Wann wurde der Job veröffentlicht?</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {[
            { value: "all", label: t("timeframes.all") },
            { value: "week", label: t("timeframes.week") },
            { value: "month", label: t("timeframes.month") },
          ].map((time) => (
            <button
              key={time.value}
              onClick={() => handleFilterChange("timeframe", time.value)}
              className={cn(
                "py-1.5 md:py-2 px-1 md:px-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 border-2 touch-manipulation min-h-[44px]",
                timeframe === time.value
                  ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-md scale-[1.02] ring-1 ring-primary/30"
                  : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-sm hover:scale-[1.02] active:scale-95"
              )}
              aria-label={`${time.label} ${timeframe === time.value ? "ausgewählt" : "auswählen"}`}
              aria-pressed={timeframe === time.value}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location - Verbesserte Gruppierung */}
      <div className="space-y-3 md:space-y-4 p-4 md:p-6 rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className={`${iconSizes.md} text-primary`} />
          <div>
            <h3 className="text-base md:text-lg font-bold text-foreground">{t("filters.location")}</h3>
            <p className="text-xs text-muted-foreground hidden md:block">Wo möchtest du arbeiten?</p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-1 md:gap-2">
          {locationOptions.map((loc) => {
            const Icon = loc.icon
            const isSelected = locations.includes(loc.value)
            return (
              <button
                key={loc.value}
                onClick={() => handleLocationToggle(loc.value)}
              className={cn(
                "py-1 md:py-2 px-1 md:px-2 rounded-md md:rounded-lg text-[9px] md:text-xs font-bold transition-all duration-200 border-2 flex flex-col items-center gap-0.5 md:gap-1 touch-manipulation min-h-[44px]",
                isSelected
                  ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-md scale-[1.02] ring-1 ring-primary/30"
                  : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-sm hover:scale-[1.02] active:scale-95"
              )}
                aria-label={`${loc.label} ${isSelected ? "ausgewählt" : "auswählen"}`}
                aria-pressed={isSelected}
              >
                <Icon className={cn("w-3 h-3 md:w-4 md:h-4", isSelected ? "text-white" : "text-primary")} aria-hidden="true" />
                <span className="text-center leading-tight">{loc.label}</span>
              </button>
            )
          })}
        </div>
        {showLocationError && (
          <div className="mt-2 text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>{t("filters.pleaseSelectFilter")}</span>
          </div>
        )}
      </div>

      {showSubmitButton && (
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          size="lg"
          className={cn(
            "w-full py-2 md:py-4 text-xs md:text-lg font-bold shadow-lg gap-1.5 rounded-lg md:rounded-xl transition-all duration-200",
            isFormValid()
              ? "bg-gradient-to-r from-primary via-primary/90 to-cyan-600 hover:from-primary/90 hover:via-primary/80 hover:to-cyan-600/90 hover:scale-[1.02] hover:shadow-xl hover:glow-primary"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
          )}
        >
          {t("filters.continueToOffers")}
          <ArrowRight className="w-3 h-3 md:w-5 md:h-5" />
        </Button>
      )}
    </div>
  )
}
