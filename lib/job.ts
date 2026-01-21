/**
 * Gemeinsames Job-Datenmodell (Domain-Shape)
 *
 * Hinweis:
 * - Dieses Interface wird sowohl im UI als auch beim Server-Import aus MongoDB genutzt.
 * - Die MongoDB-Dokumente können zusätzlich ein `_id` Feld haben; das wird bei der
 *   Normalisierung entfernt bzw. in `id` umgewandelt.
 */
export type JobType = "dishwasher" | "kitchen" | "housekeeping" | "helper" | "service" | "all"

export interface Job {
  // Basis-Felder
  id: string
  title: string
  company: string
  location: string
  locationRegion: string
  employmentType: string
  startDate: string
  jobType: JobType

  // Kontakt
  phone: string
  email: string

  // Benefits
  hasAccommodation: boolean
  hasMeals: boolean

  // Beschreibungen
  description: string
  companyDescription?: string
  companyWebsite?: string
  companyAddress?: string
  fullDescription?: string

  // Erweiterte Felder
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
  workingHours?: string
  salaryMin?: number
  salaryMax?: number
  numberOfPositions?: number
  applicationDeadline?: string
  jobReference?: string

  // Legacy/optional (wird im Modal genutzt)
  salary?: string
  tasks?: string[]
  offers?: string[]
}

/**
 * Normalisiert ein MongoDB-Dokument in unser `Job` Interface.
 *
 * - Falls `id` fehlt, wird `_id` (falls vorhanden) in eine String-ID umgewandelt.
 * - `_id` wird aus dem zurückgegebenen Objekt entfernt.
 *
 * Wichtig: Das ist keine "Fallback-Konfiguration" (ENV), sondern reine Daten-
 * Normalisierung für MongoDB-Objekte.
 */
export function normalizeJobDocument(doc: unknown): Job {
  const anyDoc = doc as Record<string, unknown>
  const { _id, ...rest } = anyDoc

  const existingId = rest.id
  const id =
    typeof existingId === "string" && existingId.trim().length > 0
      ? existingId
      : _id && typeof (_id as { toString?: () => string }).toString === "function"
        ? (_id as { toString: () => string }).toString()
        : String(_id ?? "")

  return { ...(rest as Omit<Job, "id">), id }
}

/**
 * Job-Input für die Erstellung (ohne id, created_at, updated_at)
 * 
 * Wird für API-Requests verwendet (POST /api/jobs)
 */
export type JobCreateInput = Omit<Job, "id">

/**
 * Request-Body für POST /api/jobs
 */
export interface JobCreateRequest {
  jobs: JobCreateInput[]
}

