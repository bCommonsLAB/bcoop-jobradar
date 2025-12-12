"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Calendar, Home, Utensils, Briefcase } from "lucide-react"
import JobDetailModal from "./job-detail-modal"

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
      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2rem] overflow-hidden group">
        <div className="flex flex-col sm:flex-row">
          {/* Left: Company Image */}
          <div className="relative w-full sm:w-32 md:w-40 h-32 sm:h-auto flex-shrink-0 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <Image
                src={getJobImage(job.title) || "/placeholder.svg"}
                alt={job.company}
                width={120}
                height={120}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right: Job Information */}
          <div className="flex-1 p-6 md:p-8 space-y-5">
            {/* Header: Title and Company */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">{job.title}</h3>
              <p className="text-base md:text-lg font-semibold text-teal-600">{job.company}</p>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="bg-teal-100 p-2 rounded-xl">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <span className="font-semibold">{job.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="bg-cyan-100 p-2 rounded-xl">
                  <Calendar className="h-5 w-5 text-cyan-600" />
                </div>
                <span className="font-semibold">Da {job.startDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <Briefcase className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="font-semibold">{job.employmentType}</span>
              </div>
            </div>

            {/* Benefits Tags */}
            {(job.hasAccommodation || job.hasMeals) && (
              <div className="flex flex-wrap gap-3">
                {job.hasAccommodation && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 px-4 py-2 rounded-full text-xs md:text-sm font-bold border border-purple-200">
                    <Home className="h-4 w-4" />
                    <span>Alloggio</span>
                  </div>
                )}
                {job.hasMeals && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs md:text-sm font-bold border border-blue-200">
                    <Utensils className="h-4 w-4" />
                    <span>Vitto</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                size="lg"
                className="flex-1 min-w-[160px] bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-6 text-base md:text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                asChild
                onClick={handleContact}
              >
                <a href={`tel:${job.phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-2.5 h-5 w-5" />
                  Chiama
                </a>
              </Button>
              <Button
                size="lg"
                className="flex-1 min-w-[160px] bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white py-6 text-base md:text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                asChild
                onClick={handleContact}
              >
                <a href={`mailto:${job.email}?subject=Candidatura: ${job.title}`}>
                  <Mail className="mr-2.5 h-5 w-5" />
                  E-Mail
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 min-w-[160px] border-2 border-border bg-white hover:bg-accent py-6 text-base md:text-lg font-bold rounded-2xl transition-all hover:shadow-md"
                onClick={() => setIsModalOpen(true)}
              >
                Più informazioni
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <JobDetailModal job={job} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
