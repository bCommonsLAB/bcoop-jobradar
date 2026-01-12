"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Calendar, Home, Utensils, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import JobDetailModal from "./job-detail-modal"
import { useTranslation } from "@/hooks/use-translation"
import { iconSizes } from "@/lib/icon-sizes"

interface Job {
  id: string
  title: string
  company: string
  location: string
  employmentType: string
  startDate: string
  hasAccommodation: boolean
  hasMeals: boolean
  phone: string
  email: string
  description: string
}

interface JobCardProps {
  job: Job
  onSelect?: () => void
}

export default function JobCard({ job, onSelect }: JobCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { t } = useTranslation()

  const handleContact = () => {
    if (onSelect) {
      onSelect()
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
      <Card className="relative bg-card border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden group hover:-translate-y-1 h-full flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
        {/* Status Badge - Optional für neue Jobs */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-primary text-white shadow-lg text-[8px] md:text-[10px]">
            Neu
          </Badge>
        </div>
        
        <div className="flex flex-col h-full">
          {/* Company Image - Kompakter */}
          <div className="relative w-full h-24 md:h-28 flex-shrink-0 bg-gradient-to-br from-primary/10 to-accent/10">
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
          <div className="flex-1 p-2 md:p-4 space-y-1.5 md:space-y-3 flex flex-col">
            {/* Header: Title and Company - Kompakter */}
            <div className="flex-shrink-0">
              <h3 className="text-xs md:text-base lg:text-lg font-bold text-foreground leading-tight mb-0.5 tracking-tight line-clamp-2">{job.title}</h3>
              <p className="text-[10px] md:text-sm font-semibold text-primary tracking-normal line-clamp-1">{job.company}</p>
            </div>

            {/* Job Details - Kompakter */}
            <div className="space-y-1.5 md:space-y-2 flex-shrink-0">
              <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-muted/50">
                <div className="p-1 md:p-1.5 rounded-md bg-primary/10 flex-shrink-0">
                  <MapPin className={`${iconSizes.sm} text-primary`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] md:text-xs text-muted-foreground block">Ort</span>
                  <span className="text-xs md:text-sm font-semibold truncate block">{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-muted/50">
                <div className="p-1 md:p-1.5 rounded-md bg-accent/20 flex-shrink-0">
                  <Calendar className={`${iconSizes.sm} text-accent-foreground`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] md:text-xs text-muted-foreground block">Startdatum</span>
                  <span className="text-xs md:text-sm font-semibold truncate block">Da {job.startDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-muted/50">
                <div className="p-1 md:p-1.5 rounded-md bg-secondary/20 flex-shrink-0">
                  <Briefcase className={`${iconSizes.sm} text-secondary-foreground`} />
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
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200">
                    <Home className={iconSizes.sm} />
                    <span className="text-[10px] md:text-xs font-semibold">Alloggio</span>
                  </Badge>
                )}
                {job.hasMeals && (
                  <Badge variant="secondary" className="flex items-center gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200">
                    <Utensils className={iconSizes.sm} />
                    <span className="text-[10px] md:text-xs font-semibold">Vitto</span>
                  </Badge>
                )}
              </div>
            )}

            {/* Action Buttons - Kompakter */}
            <div className="flex flex-col gap-1.5 pt-1.5 mt-auto">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 text-white font-bold rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 py-1 md:py-2 text-[10px] md:text-sm"
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
                className="w-full bg-gradient-to-r from-secondary via-secondary/90 to-accent hover:from-secondary/90 hover:via-secondary/80 hover:to-accent/90 text-white font-bold rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 py-1 md:py-2 text-[10px] md:text-sm"
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
                className="w-full border-2 border-border bg-card hover:bg-accent rounded-lg md:rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 py-1 md:py-2 text-[10px] md:text-sm"
                onClick={() => setIsModalOpen(true)}
                aria-label={`${t("jobCard.details")} für ${job.title}`}
              >
                {t("jobCard.details")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <JobDetailModal job={job} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
