"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  X,
  DollarSign,
  Clock,
  Briefcase,
  Calendar,
  User,
  Mail,
  PhoneIcon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
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
  salary?: string
  tasks?: string[]
  offers?: string[]
  companyDescription?: string
  companyWebsite?: string
  companyAddress?: string
  fullDescription?: string
  requirements?: string[]
  benefits?: string[]
  contractType?: string
  experienceLevel?: string
  education?: string
  languages?: string[]
  certifications?: string[]
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  applicationDeadline?: string
  jobReference?: string
  workingHours?: string
  salaryMin?: number
  salaryMax?: number
  numberOfPositions?: number
}

interface JobDetailModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export default function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
  const { t } = useTranslation()
  // Get first letter of company name for avatar
  const companyInitial = job.company.charAt(0).toUpperCase()

  const tasks = job.tasks || [
    "Supporto nelle operazioni quotidiane",
    "Collaborazione con il team",
    "Mantenimento degli standard di qualità",
  ]

  const offers = job.offers ||
    job.benefits || ["Ambiente di lavoro dinamico", "Opportunità di crescita", "Team professionale e cordiale"]

  const requirements = job.requirements || []

  const handleApply = () => {
    const contactEmail = job.contactEmail || job.email
    window.location.href = `mailto:${contactEmail}?subject=Candidatura: ${job.title}${job.jobReference ? ` (Rif: ${job.jobReference})` : ""}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl">
        {/* Header */}
        <DialogHeader className="relative p-6 pb-4">
          <DialogTitle className="sr-only">{job.title}</DialogTitle>
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Company Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-primary">{companyInitial}</span>
            </div>
            <h2 className="text-2xl font-bold text-center mb-1">{job.title}</h2>
            <div className="flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-sm">
              <span className="font-semibold">{job.company}</span>
              <span>•</span>
              <span>{job.location}</span>
              <span>•</span>
              <span>{t("jobModal.from")} {job.startDate}</span>
            </div>
            {job.jobReference && (
              <div className="mt-2 text-xs text-muted-foreground">{t("jobModal.reference")}: {job.jobReference}</div>
            )}
          </div>

          {/* Info Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center p-3 bg-yellow-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center mb-2">
                <DollarSign className="h-5 w-5 text-yellow-700" />
              </div>
              <span className="text-xs font-semibold text-yellow-700">Stipendio</span>
              <span className="text-sm font-bold text-yellow-900 text-center">
                {job.salaryMin && job.salaryMax ? `€${job.salaryMin}-${job.salaryMax}` : job.salary || "Da concordare"}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-purple-700" />
              </div>
              <span className="text-xs font-semibold text-purple-700">Tipo di lavoro</span>
              <span className="text-sm font-bold text-purple-900 text-center leading-tight">{job.employmentType}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-100 rounded-2xl">
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center mb-2">
                <Briefcase className="h-5 w-5 text-blue-700" />
              </div>
              <span className="text-xs font-semibold text-blue-700">Posizione</span>
              <span className="text-sm font-bold text-blue-900 text-center leading-tight">
                {job.title.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* Descrizione del lavoro Section */}
          {job.fullDescription && (
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{t("jobModal.jobDescription")}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.fullDescription}</p>
            </div>
          )}

          {/* Mansioni Section */}
          {tasks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg">{t("jobModal.tasks")}</h3>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Requisiti</h3>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(job.experienceLevel || job.education) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.experienceLevel && (
                <div className="bg-accent/50 rounded-xl p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">{t("jobModal.experienceLevel")}</div>
                  <div className="font-bold text-sm">{job.experienceLevel}</div>
                </div>
              )}
              {job.education && (
                <div className="bg-accent/50 rounded-xl p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">{t("jobModal.education")}</div>
                  <div className="font-bold text-sm">{job.education}</div>
                </div>
              )}
            </div>
          )}

          {(job.languages && job.languages.length > 0) ||
            (job.certifications && job.certifications.length > 0 && (
              <div className="space-y-3">
                {job.languages && job.languages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Lingue richieste</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {job.certifications && job.certifications.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{t("jobModal.certifications")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {/* Cosa offriamo Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">{t("jobModal.whatWeOffer")}</h3>
            <ul className="space-y-2">
              {offers.map((offer, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{offer}</span>
                </li>
              ))}
              {job.hasAccommodation && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Alloggio incluso</span>
                </li>
              )}
              {job.hasMeals && (
                <li className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vitto incluso</span>
                </li>
              )}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {job.contractType && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("jobModal.contract")}:</span>
                <span className="font-semibold">{job.contractType}</span>
              </div>
            )}
            {job.workingHours && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("jobModal.workingHours")}:</span>
                <span className="font-semibold">{job.workingHours}</span>
              </div>
            )}
            {job.numberOfPositions && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("jobModal.positions")}:</span>
                <span className="font-semibold">{job.numberOfPositions}</span>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("jobModal.deadline")}:</span>
                <span className="font-semibold">{job.applicationDeadline}</span>
              </div>
            )}
          </div>

          {(job.contactPerson || job.contactPhone || job.contactEmail) && (
            <div className="bg-accent/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base">Persona di contatto</h3>
              </div>
              {job.contactPerson && <p className="text-sm font-semibold">{job.contactPerson}</p>}
              {job.contactPhone && (
                <div className="flex items-center gap-2 text-sm">
                  <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${job.contactPhone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                    {job.contactPhone}
                  </a>
                </div>
              )}
              {job.contactEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${job.contactEmail}`} className="text-primary hover:underline">
                    {job.contactEmail}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Apply Button */}
          <Button
            size="lg"
            className="w-full py-6 text-base font-bold rounded-2xl bg-foreground hover:bg-foreground/90"
            onClick={handleApply}
          >
            {t("jobModal.apply")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
