"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Filter, Edit, ChevronDown, ChevronUp } from "lucide-react"
import { ChefHat, UtensilsCrossed, Bed, Users, Coffee, MapPin, Calendar, Sparkles, GraduationCap } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface ActiveFiltersProps {
  filters: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
    noQualificationRequired: boolean
  }
  onRemoveFilter?: (filterType: "jobTypes" | "timeframe" | "locations" | "noQualificationRequired", value?: string) => void
  onEditFilters?: () => void
}

interface FilterChip {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FilterChipGroupProps {
  chips: FilterChip[]
  max?: number
  onRemove?: (value: string) => void
  filterType: "jobTypes" | "timeframe" | "locations" | "noQualificationRequired"
}

/**
 * Komponente für eine Gruppe von Filter-Chips mit Limitierung
 * Zeigt maximal max Chips an, danach "+X altri"
 */
function FilterChipGroup({ chips, max = 3, onRemove, filterType }: FilterChipGroupProps) {
  const { t } = useTranslation()
  
  if (chips.length === 0) return null

  const visibleChips = chips.slice(0, max)
  const remainingCount = chips.length - max
  const hasMore = remainingCount > 0

  return (
    <div className="flex flex-wrap gap-2">
      {visibleChips.map((chip) => {
        const Icon = chip.icon || Sparkles
        return (
          <Badge
            key={chip.value}
            variant="secondary"
            className="px-2 md:px-3 py-0.5 md:py-1.5 text-[10px] md:text-sm font-semibold rounded-md md:rounded-lg bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-1.5 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Icon className="w-3 h-3 md:w-4 md:h-4" />
            <span>{chip.label}</span>
            {onRemove && (
              <button
                onClick={() => onRemove(chip.value)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-all duration-300 hover:scale-110"
                aria-label={t(`activeFilters.remove${filterType === "jobTypes" ? "JobType" : filterType === "timeframe" ? "Timeframe" : filterType === "locations" ? "Location" : "QualificationFilter"}`)}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        )
      })}
      {hasMore && (
        <Badge
          variant="secondary"
          className="px-2 md:px-3 py-0.5 md:py-1.5 text-[10px] md:text-sm font-semibold rounded-md md:rounded-lg bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20"
        >
          +{remainingCount} {t("activeFilters.others")}
        </Badge>
      )}
    </div>
  )
}

/**
 * Komponente zur Anzeige der aktiven Filter
 * Zeigt eine kompakte Zusammenfassung mit Toggle für Details
 */
export default function ActiveFilters({ filters, onRemoveFilter, onEditFilters }: ActiveFiltersProps) {
  const { t } = useTranslation()
  const [showDetails, setShowDetails] = useState(false)
  
  // Mapping für Job-Typen
  const jobTypeLabels: Record<string, { label: string; icon: typeof ChefHat }> = {
    all: { label: t("jobTypes.all"), icon: Sparkles },
    kitchen: { label: t("jobTypes.kitchen"), icon: ChefHat },
    dishwasher: { label: t("jobTypes.dishwasher"), icon: UtensilsCrossed },
    housekeeping: { label: t("jobTypes.housekeeping"), icon: Bed },
    helper: { label: t("jobTypes.helper"), icon: Users },
    service: { label: t("jobTypes.service"), icon: Coffee },
  }

  // Mapping für Zeiträume
  const timeframeLabels: Record<string, string> = {
    all: t("timeframes.all"),
    week: t("timeframes.week"),
    month: t("timeframes.month"),
  }

  // Mapping für Orte
  const locationLabels: Record<string, string> = {
    all: t("locations.all"),
    bolzano: t("locations.bolzano"),
    merano: t("locations.merano"),
    bressanone: t("locations.bressanone"),
    brunico: t("locations.brunico"),
    vipiteno: t("locations.vipiteno"),
    "val-pusteria": t("locations.valPusteria"),
    "val-venosta": t("locations.valVenosta"),
  }

  // Filter aktiv
  const activeJobTypes = filters.jobTypes.filter((t) => t !== "all")
  const activeLocations = filters.locations.filter((l) => l !== "all")
  const hasActiveFilters =
    activeJobTypes.length > 0 || filters.timeframe !== "all" || activeLocations.length > 0 || filters.noQualificationRequired

  if (!hasActiveFilters) {
    return null
  }

  // Filter-Zählung
  const totalActiveFilters = 
    activeJobTypes.length + 
    (filters.timeframe !== "all" ? 1 : 0) + 
    activeLocations.length + 
    (filters.noQualificationRequired ? 1 : 0)

  // Chips für Gruppen vorbereiten
  const jobTypeChips: FilterChip[] = activeJobTypes.map((jobType) => {
    const jobTypeInfo = jobTypeLabels[jobType] || { label: jobType, icon: Sparkles }
    return {
      label: jobTypeInfo.label,
      value: jobType,
      icon: jobTypeInfo.icon,
    }
  })

  const timeframeChips: FilterChip[] = filters.timeframe !== "all" ? [{
    label: timeframeLabels[filters.timeframe] || filters.timeframe,
    value: filters.timeframe,
    icon: Calendar,
  }] : []

  const locationChips: FilterChip[] = activeLocations.map((location) => ({
    label: locationLabels[location] || location,
    value: location,
    icon: MapPin,
  }))

  const qualificationChips: FilterChip[] = filters.noQualificationRequired ? [{
    label: t("filters.noQualificationRequired"),
    value: "noQualificationRequired",
    icon: GraduationCap,
  }] : []

  return (
    <div className="bg-card rounded-lg md:rounded-xl p-2 md:p-5 shadow-sm mb-3 md:mb-5 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 md:mb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3 h-3 md:w-4 md:h-4 text-primary" />
          <h3 className="text-sm md:text-lg font-bold text-foreground">
            {t("activeFilters.title")}
          </h3>
        </div>
        {onEditFilters && (
          <Button
            onClick={onEditFilters}
            size="sm"
            className="bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 text-white font-semibold rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 px-2 md:px-4 py-1 md:py-2 text-[10px] md:text-sm"
          >
            <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1.5" />
            {t("activeFilters.editFilters")}
          </Button>
        )}
      </div>

      {/* Toggle Button */}
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-200"
        >
          {showDetails ? (
            <>
              {t("activeFilters.hideDetails")}
              <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              {t("activeFilters.showDetails")}
              <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Details View (animiert) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showDetails ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 md:space-y-4 pt-2">
          {/* Jobtypen Gruppe */}
          {jobTypeChips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t("filters.jobType")}
              </h4>
              <FilterChipGroup
                chips={jobTypeChips}
                max={3}
                onRemove={onRemoveFilter ? (value) => onRemoveFilter("jobTypes", value) : undefined}
                filterType="jobTypes"
              />
            </div>
          )}

          {/* Zeitraum Gruppe */}
          {timeframeChips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t("filters.timeframe")}
              </h4>
              <FilterChipGroup
                chips={timeframeChips}
                max={3}
                onRemove={onRemoveFilter ? () => onRemoveFilter("timeframe") : undefined}
                filterType="timeframe"
              />
            </div>
          )}

          {/* Orte Gruppe */}
          {locationChips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t("filters.location")}
              </h4>
              <FilterChipGroup
                chips={locationChips}
                max={3}
                onRemove={onRemoveFilter ? (value) => onRemoveFilter("locations", value) : undefined}
                filterType="locations"
              />
            </div>
          )}

          {/* Qualifikation Gruppe */}
          {qualificationChips.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                {t("filters.qualification")}
              </h4>
              <FilterChipGroup
                chips={qualificationChips}
                max={3}
                onRemove={onRemoveFilter ? () => onRemoveFilter("noQualificationRequired") : undefined}
                filterType="noQualificationRequired"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
