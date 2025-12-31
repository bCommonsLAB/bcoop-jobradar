"use client"

import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { ChefHat, UtensilsCrossed, Bed, Users, Coffee, MapPin, Calendar, Sparkles } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface ActiveFiltersProps {
  filters: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
  }
  onRemoveFilter?: (filterType: "jobTypes" | "timeframe" | "locations", value?: string) => void
}

/**
 * Komponente zur Anzeige der aktiven Filter
 * Zeigt die gesetzten Filter als Badges an, damit der Anwender sieht, was gefiltert wurde
 */
export default function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  const { t } = useTranslation()
  
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

  // Prüfe, ob überhaupt Filter gesetzt sind
  const activeJobTypes = filters.jobTypes.filter((t) => t !== "all")
  const activeLocations = filters.locations.filter((l) => l !== "all")
  const hasActiveFilters =
    activeJobTypes.length > 0 || filters.timeframe !== "all" || activeLocations.length > 0

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl mb-6 border-2 border-border">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-xl md:text-2xl font-bold text-foreground">{t("activeFilters.title")}</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Job-Typ Filter - mehrere Badges */}
        {activeJobTypes.map((jobType) => {
          const jobTypeInfo = jobTypeLabels[jobType] || { label: jobType, icon: Sparkles }
          const JobTypeIcon = jobTypeInfo.icon
          return (
            <Badge
              key={jobType}
              variant="secondary"
              className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <JobTypeIcon className="w-4 h-4" />
              <span>{jobTypeInfo.label}</span>
              {onRemoveFilter && (
                <button
                  onClick={() => onRemoveFilter("jobTypes", jobType)}
                  className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-all duration-300 hover:scale-110"
                  aria-label={t("activeFilters.removeJobType")}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          )
        })}

        {/* Zeitraum Filter */}
        {filters.timeframe !== "all" && (
          <Badge
            variant="secondary"
            className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>{timeframeLabels[filters.timeframe] || filters.timeframe}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter("timeframe")}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-all duration-300 hover:scale-110"
                aria-label={t("activeFilters.removeTimeframe")}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        )}

        {/* Ort Filter - mehrere Badges */}
        {activeLocations.map((location) => (
          <Badge
            key={location}
            variant="secondary"
            className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <MapPin className="w-4 h-4" />
            <span>{locationLabels[location] || location}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter("locations", location)}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-all duration-300 hover:scale-110"
                aria-label={t("activeFilters.removeLocation")}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
    </div>
  )
}

