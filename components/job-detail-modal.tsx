"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  X,
  Clock,
  Calendar,
  User,
  Mail,
  PhoneIcon,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MapPin,
  Home,
  Utensils,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import type { Job } from "@/lib/job"

interface JobDetailModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const { t } = useTranslation()
  // Get first letter of company name for avatar
  const companyInitial = job.company.charAt(0).toUpperCase()

  // Extract tasks from description or use provided tasks
  const tasks = job.tasks || []
  
  // Extract requirements from description or use provided requirements
  const requirements = job.requirements || []

  // Get description text
  const descriptionText = job.fullDescription || job.description || ""

  // Calculate hours per week from employmentType or use workingHours
  const getHoursPerWeek = (): string => {
    if (job.workingHours) return job.workingHours
    if (job.employmentType?.toLowerCase().includes("vollzeit") || job.employmentType?.toLowerCase().includes("full-time") || job.employmentType?.toLowerCase().includes("tempo pieno")) {
      return "40 ore/settimana"
    }
    if (job.employmentType?.toLowerCase().includes("teilzeit") || job.employmentType?.toLowerCase().includes("part-time") || job.employmentType?.toLowerCase().includes("part time")) {
      return "20-30 ore/settimana"
    }
    return job.employmentType || ""
  }

  // Get experience level or default to "Principiante"
  const getExperienceLevel = (): string => {
    return job.experienceLevel || "Principiante"
  }

  const handleCall = () => {
    const phoneNumber = job.contactPhone || job.phone
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`
    }
  }

  const handleEmail = () => {
    const contactEmail = job.contactEmail || job.email
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=Candidatura: ${job.title}${job.jobReference ? ` (Rif: ${job.jobReference})` : ""}`
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
        {/* Header */}
        <DialogHeader className="relative p-6 pb-4">
          <DialogTitle className="sr-only">{job.title}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Company Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">{companyInitial}</span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">{job.title}</h2>
            <div className="text-sm text-primary font-semibold">
              {job.company}
            </div>
          </div>

          {/* Key Details Pills - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* DOVE */}
            <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <MapPin className="h-5 w-5 text-cyan-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-cyan-600/70 font-medium">{t("jobModal.where")}</span>
                <span className="text-sm font-bold text-foreground truncate">{job.location}</span>
              </div>
            </div>

            {/* ORARIO */}
            <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <Clock className="h-5 w-5 text-cyan-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-cyan-600/70 font-medium">{t("jobModal.hours")}</span>
                <span className="text-sm font-bold text-foreground truncate">{job.employmentType || job.workingHours || ""}</span>
              </div>
            </div>

            {/* INIZIO */}
            <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <Calendar className="h-5 w-5 text-cyan-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-cyan-600/70 font-medium">{t("jobModal.start")}</span>
                <span className="text-sm font-bold text-foreground truncate">{job.startDate}</span>
              </div>
            </div>

            {/* ESPERIENZA */}
            <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-200">
              <User className="h-5 w-5 text-cyan-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-cyan-600/70 font-medium">{t("jobModal.experience")}</span>
                <span className="text-sm font-bold text-foreground truncate">{getExperienceLevel()}</span>
              </div>
            </div>

            {/* ORE */}
            {getHoursPerWeek() && (
              <div className="flex items-center gap-2 px-4 py-3 bg-cyan-50 rounded-xl border border-cyan-200 col-span-2">
                <Clock className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs text-cyan-600/70 font-medium">{t("jobModal.hoursPerWeek")}</span>
                  <span className="text-sm font-bold text-foreground truncate">{getHoursPerWeek()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Benefits Pills */}
          {(job.hasAccommodation || job.hasMeals) && (
            <div className="flex flex-wrap gap-2">
              {job.hasAccommodation && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
                  <Home className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-bold text-green-900">{t("jobModal.accommodationIncluded")}</span>
                </div>
              )}
              {job.hasMeals && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-300">
                  <Utensils className="h-4 w-4 text-green-700" />
                  <span className="text-sm font-bold text-green-900">{t("jobModal.mealsIncluded")}</span>
                </div>
              )}
            </div>
          )}

          {/* Descrizione del lavoro - ohne Header */}
          {descriptionText && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{descriptionText}</p>
            </div>
          )}

          {/* Cosa farai Section */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-cyan-600 rounded-full"></div>
                {t("jobModal.whatYouWillDo")}
              </h3>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cosa serve Section */}
          {requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                {t("jobModal.whatIsNeeded")}
              </h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="h-3 w-3 text-orange-600" />
                    </div>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="space-y-3">
            {/* Chiama Button */}
            {(job.contactPhone || job.phone) && (
              <Button
                size="lg"
                className="w-full py-6 text-base font-bold rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={handleCall}
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                {t("jobCard.call")}: {job.contactPhone || job.phone}
              </Button>
            )}

            {/* Scrivi e-mail Button */}
            {(job.contactEmail || job.email) && (
              <Button
                size="lg"
                variant="outline"
                className="w-full py-6 text-base font-bold rounded-2xl border-2 border-border bg-gray-100 hover:bg-gray-200 text-foreground"
                onClick={handleEmail}
              >
                <Mail className="mr-2 h-5 w-5" />
                {t("jobModal.writeEmail")}
              </Button>
            )}

            {/* Vedi annuncio completo Link */}
            {job.sourceUrl && (
              <Button
                variant="ghost"
                className="w-full py-4 text-sm text-muted-foreground hover:text-foreground"
                asChild
              >
                <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t("jobModal.seeFullAd")}
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
