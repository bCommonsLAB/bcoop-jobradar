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
  DollarSign,
} from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { getStartDateDisplay } from "@/lib/format-job-date"
import type { Job } from "@/lib/job"

interface JobDetailModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

function getHoursDisplay(job: Job): string | null {
  if (job.workingHours) return job.workingHours
  const et = job.employmentType?.toLowerCase() ?? ""
  if (et.includes("vollzeit") || et.includes("full-time") || et.includes("tempo pieno")) return "40 ore/settimana"
  if (et.includes("teilzeit") || et.includes("part-time") || et.includes("part time")) return "20-30 ore/settimana"
  if (job.employmentType) return job.employmentType
  return null
}

function getSalaryDisplay(job: Job): string | null {
  if (job.salaryMin != null && job.salaryMax != null) return `€${job.salaryMin}–${job.salaryMax}`
  if (job.salary?.trim()) return job.salary.trim()
  return null
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const { t } = useTranslation()
  const companyInitial = job.company.charAt(0).toUpperCase()
  const tasks = job.tasks ?? []
  const requirements = job.requirements ?? []
  const descriptionText = job.fullDescription || job.description || ""
  const startDateLabel = getStartDateDisplay(job.startDate)
  const hoursDisplay = getHoursDisplay(job)
  const salaryDisplay = getSalaryDisplay(job)

  const handleCall = () => {
    const phoneNumber = job.contactPhone || job.phone
    if (phoneNumber) window.location.href = `tel:${phoneNumber.replace(/\s/g, "")}`
  }

  const handleEmail = () => {
    const contactEmail = job.contactEmail || job.email
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=Candidatura: ${job.title}${job.jobReference ? ` (Rif: ${job.jobReference})` : ""}`
    }
  }

  const cellClass = "flex items-center gap-2 px-3.5 py-3 bg-accent/60 rounded-xl min-w-0"
  const labelClass = "text-[10px] uppercase tracking-wider text-muted-foreground"
  const valueClass = "text-sm font-bold text-foreground truncate"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl" showCloseButton={false}>
        <DialogHeader className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <DialogTitle className="sr-only">{job.title}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Header: Avatar, Title, Company */}
          <div className="flex flex-col items-center -mt-2">
            <div className="w-16 h-16 rounded-2xl bg-card shadow-lg flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">{companyInitial}</span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">{job.title}</h2>
            <p className="text-sm text-primary font-semibold">{job.company}</p>
          </div>

          {/* Key-Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* DOVE */}
            <div className={cellClass}>
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className={labelClass}>{t("jobModal.where")}</span>
                <span className={valueClass}>{job.location}</span>
              </div>
            </div>

            {/* ORARIO */}
            <div className={cellClass}>
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className={labelClass}>{t("jobModal.hours")}</span>
                <span className={valueClass}>{job.employmentType || job.workingHours || ""}</span>
              </div>
            </div>

            {/* INIZIO - only if startDate */}
            {job.startDate && startDateLabel !== null && (
              <div className={cellClass}>
                <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className={labelClass}>{t("jobModal.start")}</span>
                  <span className={valueClass}>{startDateLabel}</span>
                </div>
              </div>
            )}

            {/* ESPERIENZA - only if from scraper */}
            {job.experienceLevel && (
              <div className={cellClass}>
                <User className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className={labelClass}>{t("jobModal.experience")}</span>
                  <span className={valueClass}>{job.experienceLevel}</span>
                </div>
              </div>
            )}

            {/* ORE - only if present, col-span-2 */}
            {hoursDisplay && (
              <div className={`${cellClass} col-span-2`}>
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className={labelClass}>{t("jobModal.hoursPerWeek")}</span>
                  <span className={valueClass}>{hoursDisplay}</span>
                </div>
              </div>
            )}

            {/* STIPENDIO - only if value present, col-span-2 */}
            {salaryDisplay && (
              <div className={`${cellClass} col-span-2`}>
                <DollarSign className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className={labelClass}>{t("jobModal.salary")}</span>
                  <span className={valueClass}>{salaryDisplay}</span>
                </div>
              </div>
            )}
          </div>

          {/* Alloggio/Vitto - only when at least one true */}
          {(job.hasAccommodation || job.hasMeals) && (
            <div className="flex flex-wrap gap-2">
              {job.hasAccommodation && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/80 rounded-xl text-emerald-700">
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-bold">{t("jobModal.accommodationIncluded")}</span>
                </div>
              )}
              {job.hasMeals && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100/80 border border-emerald-200/80 rounded-xl text-emerald-700">
                  <Utensils className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-bold">{t("jobModal.mealsIncluded")}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {descriptionText && (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{descriptionText}</p>
          )}

          {/* Cosa farai */}
          {tasks.length > 0 && (
            <div className="bg-primary/[0.03] rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full flex-shrink-0" />
                {t("jobModal.whatYouWillDo")}
              </h3>
              <ul className="space-y-2">
                {tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cosa serve */}
          {requirements.length > 0 && (
            <div className="bg-orange-500/[0.03] rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-400 rounded-full flex-shrink-0" />
                {t("jobModal.whatIsNeeded")}
              </h3>
              <ul className="space-y-2">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="space-y-3">
            {(job.contactPhone || job.phone) && (
              <Button
                size="lg"
                className="w-full py-5 text-base font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                onClick={handleCall}
              >
                <PhoneIcon className="mr-2 h-5 w-5" />
                {t("jobCard.call")}: {job.contactPhone || job.phone}
              </Button>
            )}
            {(job.contactEmail || job.email) && (
              <Button
                size="lg"
                variant="outline"
                className="w-full py-5 text-base font-bold rounded-2xl border-2"
                onClick={handleEmail}
              >
                <Mail className="mr-2 h-5 w-5" />
                {t("jobModal.writeEmail")}
              </Button>
            )}
            {job.sourceUrl && (
              <>
                <Button variant="ghost" className="w-full py-4 text-sm text-muted-foreground hover:text-foreground" asChild>
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t("jobModal.seeFullAd")}
                  </a>
                </Button>
                <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-semibold text-muted-foreground">{t("jobModal.source")}</span>
                  </div>
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {job.sourceUrl}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
