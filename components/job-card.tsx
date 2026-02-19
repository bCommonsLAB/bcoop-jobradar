"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Calendar, Home, Utensils, Briefcase, ExternalLink, Heart, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import JobDetailModal from "./job-detail-modal"
import { useTranslation } from "@/hooks/use-translation"
import { iconSizes } from "@/lib/icon-sizes"
import { isJobLiked, toggleLike } from "@/lib/liked-jobs"
import { getDomainFromUrl } from "@/lib/url-utils"
import { cn } from "@/lib/utils"
import { getStartDateDisplay } from "@/lib/format-job-date"
import type { Job } from "@/lib/job"

interface JobCardProps {
  job: Job
  onSelect?: () => void
}

export default function JobCard({ job, onSelect }: JobCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  // Prüfe Like-Status beim Mount
  useEffect(() => {
    setIsLiked(isJobLiked(job.id))
  }, [job.id])

  const handleContact = () => {
    if (onSelect) {
      onSelect()
    }
  }

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newLikeStatus = toggleLike(job.id)
    setIsLiked(newLikeStatus)
    // Dispatch Custom Event, damit andere Komponenten (z.B. Favorites-Seite) aktualisiert werden
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("job-liked-changed"))
    }
  }

  const getJobImage = (title: string) => {
    if (title.toLowerCase().includes("cucin") || title.toLowerCase().includes("koch"))
      return "/professional-kitchen-chef.jpg"
    if (title.toLowerCase().includes("servizio") || title.toLowerCase().includes("kellner"))
      return "/restaurant-service-waiter.jpg"
    if (title.toLowerCase().includes("pulizie") || title.toLowerCase().includes("housekeeping"))
      return "/hotel-housekeeping-cleaning.jpg"
    if (title.toLowerCase().includes("reception")) return "/hotel-reception.png"
    if (title.toLowerCase().includes("bar")) return "/bartender-cocktails.jpg"
    return "/hotel-hospitality-work.jpg"
  }

  return (
    <>
    <Card className={cn(
        "relative bg-card border border-border/35 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden group hover:-translate-y-0.5 h-full flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        isLiked && "border-t-4 border-t-primary"
      )}>
        {/* Like Button und Status Badge */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5">
          <button
            onClick={handleLikeToggle}
            type="button"
            className={cn(
              "p-1.5 md:p-2 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 active:scale-95",
              isLiked
                ? "bg-primary text-white hover:bg-primary/90 border-2 border-primary"
                : "bg-white/90 text-muted-foreground/60 hover:bg-white hover:text-primary border-2 border-border/50"
            )}
            aria-label={isLiked ? t("jobCard.unlike") || "Job entliken" : t("jobCard.like") || "Job liken"}
          >
            <Heart className={cn("w-3 h-3 md:w-4 md:h-4", isLiked && "fill-current")} />
          </button>
          <Badge variant="default" className="bg-primary text-white shadow-lg text-[8px] md:text-[10px]">
            Neu
          </Badge>
        </div>
        
        <div className="flex flex-col h-full">
          {/* Company Image - Kompakter */}
          <div className="relative w-full h-24 md:h-28 flex-shrink-0 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="absolute inset-0 flex items-center justify-center p-2 md:p-2.5">
              <Image
                src={getJobImage(job.title) || "/placeholder.svg"}
                alt={job.company}
                width={120}
                height={120}
                className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-lg md:rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 40px, (max-width: 1024px) 64px, 72px"
                loading="lazy"
              />
            </div>
          </div>

          {/* Job Information */}
          <div className="flex-1 p-3 md:p-5 lg:p-6 space-y-2 md:space-y-3 lg:space-y-4 flex flex-col">
            {/* Header: Title and Company - Kompakter */}
            <div className="flex-shrink-0">
              <h3 className="text-xs md:text-base lg:text-lg font-bold text-foreground leading-tight mb-0.5 tracking-tight line-clamp-2">{job.title}</h3>
              <p className="text-[10px] md:text-sm font-semibold text-primary tracking-normal line-clamp-1">{job.company}</p>
            </div>

            {/* Job Details - Kompakter */}
            <div className="space-y-2 md:space-y-2.5 lg:space-y-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 md:gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl bg-muted/40">
                <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0">
                  <MapPin className={`${iconSizes.sm} text-primary`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] md:text-xs text-muted-foreground block">Ort</span>
                  <span className="text-xs md:text-sm font-semibold truncate block">{job.location}</span>
                </div>
              </div>
              {getStartDateDisplay(job.startDate) !== null && (
                <div className="flex items-center gap-2.5 md:gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl bg-muted/40">
                  <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0">
                    <Calendar className={`${iconSizes.sm} text-primary`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] md:text-xs text-muted-foreground block">Startdatum</span>
                    <span className="text-xs md:text-sm font-semibold truncate block">{getStartDateDisplay(job.startDate)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5 md:gap-3 px-3 py-2 md:px-4 md:py-2.5 rounded-xl md:rounded-2xl bg-muted/40">
                <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-primary/10 flex-shrink-0">
                  <Briefcase className={`${iconSizes.sm} text-primary`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] md:text-xs text-muted-foreground block">Arbeitszeit</span>
                  <span className="text-xs md:text-sm font-semibold truncate block">{job.employmentType}</span>
                </div>
              </div>
            </div>

            {/* Benefits Tags - Kompakter */}
            {(job.hasAccommodation || job.hasMeals) && (
              <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                {job.hasAccommodation && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Home className={`${iconSizes.sm} text-emerald-700`} />
                    <span className="text-[10px] md:text-xs font-semibold">Alloggio</span>
                  </Badge>
                )}
                {job.hasMeals && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Utensils className={`${iconSizes.sm} text-emerald-700`} />
                    <span className="text-[10px] md:text-xs font-semibold">Vitto</span>
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons - Kompakter */}
            <div className="flex flex-col gap-1.5 pt-1.5 mt-auto">
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg md:rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 py-5 text-[10px] md:text-sm"
                asChild
                onClick={handleContact}
                aria-label={`${t("jobCard.call")} ${job.company}`}
              >
                <a href={`tel:${job.phone.replace(/\s/g, "")}`}>
                  <Phone className={iconSizes.sm} />
                  {t("jobCard.call")}
                </a>
              </Button>
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg md:rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 py-5 text-[10px] md:text-sm"
                asChild
                onClick={handleContact}
                aria-label={`${t("jobCard.email")} ${job.company}`}
              >
                <a href={`mailto:${job.email}?subject=Candidatura: ${job.title}`}>
                  <Mail className={iconSizes.sm} />
                  {t("jobCard.email")}
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-2 border-border bg-card hover:bg-accent rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 py-5 text-[10px] md:text-sm"
                onClick={() => setIsModalOpen(true)}
                aria-label={`${t("jobCard.moreInfo")} für ${job.title}`}
              >
                <FileText className={iconSizes.sm} />
                {t("jobCard.moreInfo")}
              </Button>
              {job.sourceUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-2 border-border bg-card hover:bg-accent rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 py-5 text-[10px] md:text-sm"
                  asChild
                  aria-label={`${t("jobCard.moreInfoOn")} ${getDomainFromUrl(job.sourceUrl)} für ${job.title}`}
                >
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className={iconSizes.sm} />
                    {t("jobCard.moreInfoOn")} {getDomainFromUrl(job.sourceUrl)}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
    </Card>
    <JobDetailModal job={job} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
