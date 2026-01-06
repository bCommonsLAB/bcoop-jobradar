"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Calendar, Home, Utensils, Briefcase } from "lucide-react"
import JobDetailModal from "./job-detail-modal"
import { useTranslation } from "@/hooks/use-translation"

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
      <Card className="bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden group hover:-translate-y-1 h-full flex flex-col">
        <div className="flex flex-col h-full">
          {/* Company Image */}
          <div className="relative w-full h-20 sm:h-24 md:h-28 lg:h-32 flex-shrink-0 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="absolute inset-0 flex items-center justify-center p-1.5 md:p-2 lg:p-3">
              <Image
                src={getJobImage(job.title) || "/placeholder.svg"}
                alt={job.company}
                width={120}
                height={120}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover rounded-md md:rounded-lg lg:rounded-xl shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          </div>

          {/* Job Information */}
          <div className="flex-1 p-2.5 md:p-3 lg:p-4 xl:p-6 space-y-2 md:space-y-2.5 lg:space-y-3 flex flex-col">
            {/* Header: Title and Company */}
            <div className="flex-shrink-0">
              <h3 className="text-xs md:text-sm lg:text-base xl:text-lg font-bold text-foreground leading-tight mb-0.5 md:mb-1 tracking-tight line-clamp-2">{job.title}</h3>
              <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-teal-600 tracking-normal line-clamp-1">{job.company}</p>
            </div>

            {/* Job Details */}
            <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2 text-[10px] md:text-xs lg:text-sm flex-shrink-0">
              <div className="flex items-center gap-1 md:gap-1.5 text-muted-foreground">
                <div className="bg-teal-100 p-0.5 md:p-1 lg:p-1.5 rounded md:rounded-md lg:rounded-lg flex-shrink-0">
                  <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-teal-600" />
                </div>
                <span className="font-semibold truncate text-[10px] md:text-xs">{job.location}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5 text-muted-foreground">
                <div className="bg-cyan-100 p-0.5 md:p-1 lg:p-1.5 rounded md:rounded-md lg:rounded-lg flex-shrink-0">
                  <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-cyan-600" />
                </div>
                <span className="font-semibold truncate text-[10px] md:text-xs">Da {job.startDate}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5 text-muted-foreground">
                <div className="bg-emerald-100 p-0.5 md:p-1 lg:p-1.5 rounded md:rounded-md lg:rounded-lg flex-shrink-0">
                  <Briefcase className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5 text-emerald-600" />
                </div>
                <span className="font-semibold truncate text-[10px] md:text-xs">{job.employmentType}</span>
              </div>
            </div>

            {/* Benefits Tags */}
            {(job.hasAccommodation || job.hasMeals) && (
              <div className="flex flex-wrap gap-1 md:gap-1.5 lg:gap-2 flex-shrink-0">
                {job.hasAccommodation && (
                  <div className="flex items-center gap-0.5 md:gap-1 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[9px] md:text-[10px] lg:text-xs font-bold border border-purple-200">
                    <Home className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />
                    <span>Alloggio</span>
                  </div>
                )}
                {job.hasMeals && (
                  <div className="flex items-center gap-0.5 md:gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-1.5 md:px-2 lg:px-3 py-0.5 md:py-1 lg:py-1.5 rounded-full text-[9px] md:text-[10px] lg:text-xs font-bold border border-blue-200">
                    <Utensils className="h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />
                    <span>Vitto</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2 pt-1 md:pt-1.5 lg:pt-2 mt-auto">
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-teal-500 via-teal-400 to-teal-600 hover:from-teal-600 hover:via-teal-500 hover:to-teal-700 text-white py-1.5 md:py-2 lg:py-2.5 xl:py-3 text-[10px] md:text-xs lg:text-sm xl:text-base font-bold rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl hover:glow-teal transition-all duration-300 hover:scale-[1.02] hover:ring-2 hover:ring-teal-300"
                asChild
                onClick={handleContact}
              >
                <a href={`tel:${job.phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />
                  {t("jobCard.call")}
                </a>
              </Button>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-700 text-white py-1.5 md:py-2 lg:py-2.5 xl:py-3 text-[10px] md:text-xs lg:text-sm xl:text-base font-bold rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl shadow-md md:shadow-lg hover:shadow-xl hover:glow-cyan transition-all duration-500 ease-out hover:scale-[1.02] hover:ring-2 hover:ring-cyan-300"
                asChild
                onClick={handleContact}
              >
                <a href={`mailto:${job.email}?subject=Candidatura: ${job.title}`}>
                  <Mail className="mr-1 h-2.5 w-2.5 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />
                  {t("jobCard.email")}
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-2 border-border bg-white hover:bg-accent py-1.5 md:py-2 lg:py-2.5 xl:py-3 text-[10px] md:text-xs lg:text-sm xl:text-base font-bold rounded-md md:rounded-lg lg:rounded-xl xl:rounded-2xl transition-all duration-500 ease-out hover:shadow-lg hover:scale-[1.02]"
                onClick={() => setIsModalOpen(true)}
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
