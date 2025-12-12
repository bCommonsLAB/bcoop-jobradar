"use client"

import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { ChefHat, UtensilsCrossed, Bed, Users, Coffee, MapPin, Calendar, Sparkles } from "lucide-react"

interface ActiveFiltersProps {
  filters: {
    jobType: string
    timeframe: string
    location: string
  }
  onRemoveFilter?: (filterType: "jobType" | "timeframe" | "location") => void
}

/**
 * Komponente zur Anzeige der aktiven Filter
 * Zeigt die gesetzten Filter als Badges an, damit der Anwender sieht, was gefiltert wurde
 */
export default function ActiveFilters({ filters, onRemoveFilter }: ActiveFiltersProps) {
  // Mapping für Job-Typen
  const jobTypeLabels: Record<string, { label: string; icon: typeof ChefHat }> = {
    all: { label: "Tutto", icon: Sparkles },
    kitchen: { label: "Cucina", icon: ChefHat },
    dishwasher: { label: "Lavapiatti", icon: UtensilsCrossed },
    housekeeping: { label: "Pulizie", icon: Bed },
    helper: { label: "Aiutante", icon: Users },
    service: { label: "Servizio", icon: Coffee },
  }

  // Mapping für Zeiträume
  const timeframeLabels: Record<string, string> = {
    all: "Tutti",
    week: "Questa settimana",
    month: "Questo mese",
  }

  // Mapping für Orte
  const locationLabels: Record<string, string> = {
    all: "Tutte le regioni",
    bolzano: "Bolzano",
    merano: "Merano",
    bressanone: "Bressanone",
    brunico: "Brunico",
    vipiteno: "Vipiteno",
    "val-pusteria": "Val Pusteria",
    "val-venosta": "Val Venosta",
  }

  // Prüfe, ob überhaupt Filter gesetzt sind (nicht "all")
  const hasActiveFilters =
    filters.jobType !== "all" || filters.timeframe !== "all" || filters.location !== "all"

  if (!hasActiveFilters) {
    return null
  }

  const jobTypeInfo = jobTypeLabels[filters.jobType] || { label: filters.jobType, icon: Sparkles }
  const JobTypeIcon = jobTypeInfo.icon

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl mb-6 border-2 border-border">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="text-xl md:text-2xl font-bold text-foreground">Filtri attivi</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Job-Typ Filter */}
        {filters.jobType !== "all" && (
          <Badge
            variant="secondary"
            className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2"
          >
            <JobTypeIcon className="w-4 h-4" />
            <span>{jobTypeInfo.label}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter("jobType")}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Rimuovi filtro tipo di lavoro"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        )}

        {/* Zeitraum Filter */}
        {filters.timeframe !== "all" && (
          <Badge
            variant="secondary"
            className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{timeframeLabels[filters.timeframe] || filters.timeframe}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter("timeframe")}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Rimuovi filtro periodo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        )}

        {/* Ort Filter */}
        {filters.location !== "all" && (
          <Badge
            variant="secondary"
            className="px-4 py-2 text-base font-semibold rounded-xl bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{locationLabels[filters.location] || filters.location}</span>
            {onRemoveFilter && (
              <button
                onClick={() => onRemoveFilter("location")}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label="Rimuovi filtro luogo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        )}
      </div>
    </div>
  )
}

