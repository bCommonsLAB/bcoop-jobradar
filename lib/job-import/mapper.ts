/**
 * Mapping von structured_data zu JobCreateInput
 * 
 * Mappt die strukturierten Daten aus dem Secretary Service in das Job-Format
 * der App. Validiert Pflichtfelder und setzt Defaults für optionale Felder.
 */

import type { JobCreateInput, JobType } from '@/lib/job'

/**
 * Strukturierte Job-Daten aus dem Secretary Service
 * 
 * Diese Struktur ist flexibel - nicht alle Felder müssen vorhanden sein.
 * Der Mapper validiert Pflichtfelder und setzt Defaults.
 */
export interface StructuredJobData {
  // Pflichtfelder (müssen vorhanden sein oder gemappt werden können)
  title?: string
  company?: string
  location?: string
  locationRegion?: string
  employmentType?: string
  startDate?: string
  jobType?: string
  phone?: string
  email?: string
  description?: string

  // Optionale Felder
  hasAccommodation?: boolean | string
  hasMeals?: boolean | string
  companyDescription?: string
  companyWebsite?: string
  companyAddress?: string
  fullDescription?: string
  requirements?: string[] | string
  benefits?: string[] | string
  contractType?: string
  experienceLevel?: string
  education?: string
  languages?: string[] | string
  certifications?: string[] | string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  workingHours?: string
  salaryMin?: number | string
  salaryMax?: number | string
  numberOfPositions?: number | string
  applicationDeadline?: string
  jobReference?: string
  salary?: string
  tasks?: string[] | string
  offers?: string[] | string

  // URL der Quelle
  url?: string
}

/**
 * Mapping von Stadtnamen zu locationRegion
 */
const LOCATION_TO_REGION_MAP: Record<string, string> = {
  'bolzano': 'bolzano',
  'bozen': 'bolzano',
  'merano': 'merano',
  'meran': 'merano',
  'bressanone': 'bressanone',
  'brixen': 'bressanone',
  'brunico': 'brunico',
  'bruneck': 'brunico',
  'vipiteno': 'vipiteno',
  'sterzing': 'vipiteno',
}

/**
 * Mapping von Job-Typ-Keywords zu JobType
 */
const JOB_TYPE_KEYWORDS: Record<JobType, string[]> = {
  dishwasher: ['dishwasher', 'lavapiatti', 'spül', 'spüler', 'spülerin'],
  kitchen: ['kitchen', 'cucina', 'koch', 'chef', 'cook', 'cuoco', 'aiuto cuoco', 'commis'],
  housekeeping: ['housekeeping', 'pulizie', 'reinigung', 'hauswirtschaft', 'cleaning'],
  helper: ['helper', 'aiuto', 'helfer', 'assistent', 'assistente'],
  service: ['service', 'servizio', 'kellner', 'waiter', 'cameriere', 'barista', 'reception'],
  all: [],
}

/**
 * Versucht jobType aus title oder description zu erkennen
 */
function inferJobType(title?: string, description?: string): JobType | null {
  const searchText = `${title || ''} ${description || ''}`.toLowerCase()

  for (const [jobType, keywords] of Object.entries(JOB_TYPE_KEYWORDS)) {
    if (jobType === 'all') continue

    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return jobType as JobType
      }
    }
  }

  return null
}

/**
 * Versucht locationRegion aus location zu mappen
 */
function inferLocationRegion(location?: string): string | null {
  if (!location) return null

  const normalized = location.toLowerCase().trim()

  // Direkter Match
  if (LOCATION_TO_REGION_MAP[normalized]) {
    return LOCATION_TO_REGION_MAP[normalized]
  }

  // Teilstring-Match
  for (const [city, region] of Object.entries(LOCATION_TO_REGION_MAP)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return region
    }
  }

  return null
}

/**
 * Konvertiert einen Wert zu einem String-Array
 */
function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(v => String(v))
      .filter(v => v.trim().length > 0)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    // Comma-separated string zu Array konvertieren
    return value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  return []
}

/**
 * Konvertiert einen Wert zu einem Boolean
 */
function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'si' || lower === 'ja'
  }
  if (typeof value === 'number') return value !== 0
  return false
}

/**
 * Konvertiert einen Wert zu einer Zahl
 */
function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.trim())
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}

/**
 * Validiert und mappt structured_data zu JobCreateInput
 * 
 * @param data Die strukturierten Daten aus dem Secretary Service
 * @returns JobCreateInput mit validierten Pflichtfeldern
 * @throws Error wenn Pflichtfelder fehlen oder nicht gemappt werden können
 */
export function mapStructuredDataToJob(data: StructuredJobData): JobCreateInput {
  const errors: string[] = []

  // Pflichtfelder validieren
  const title = data.title?.trim()
  if (!title || title.length === 0) {
    errors.push('title ist erforderlich')
  }

  const company = data.company?.trim()
  if (!company || company.length === 0) {
    errors.push('company ist erforderlich')
  }

  const location = data.location?.trim()
  if (!location || location.length === 0) {
    errors.push('location ist erforderlich')
  }

  const phone = data.phone?.trim()
  if (!phone || phone.length === 0) {
    errors.push('phone ist erforderlich')
  }

  const email = data.email?.trim()
  if (!email || email.length === 0) {
    errors.push('email ist erforderlich')
  }

  const description = data.description?.trim()
  if (!description || description.length === 0) {
    errors.push('description ist erforderlich')
  }

  // locationRegion mappen oder validieren
  let locationRegion = data.locationRegion?.trim()
  if (!locationRegion || locationRegion.length === 0) {
    const inferred = inferLocationRegion(location)
    if (inferred) {
      locationRegion = inferred
    } else {
      errors.push(`locationRegion konnte nicht aus location "${location}" abgeleitet werden`)
    }
  }

  // employmentType validieren
  const employmentType = data.employmentType?.trim()
  if (!employmentType || employmentType.length === 0) {
    errors.push('employmentType ist erforderlich')
  }

  // startDate validieren
  const startDate = data.startDate?.trim()
  if (!startDate || startDate.length === 0) {
    errors.push('startDate ist erforderlich')
  }

  // jobType mappen oder validieren
  let jobType: JobType | undefined = undefined
  if (data.jobType) {
    const normalized = data.jobType.trim().toLowerCase()
    if (['dishwasher', 'kitchen', 'housekeeping', 'helper', 'service'].includes(normalized)) {
      jobType = normalized as JobType
    }
  }

  if (!jobType) {
    const inferred = inferJobType(title, description)
    if (inferred) {
      jobType = inferred
    } else {
      errors.push(`jobType konnte nicht aus title/description abgeleitet werden`)
    }
  }

  // Fehler werfen wenn Pflichtfelder fehlen
  if (errors.length > 0) {
    throw new Error(`Fehlende oder ungültige Pflichtfelder:\n${errors.join('\n')}`)
  }

  // Job-Objekt zusammenbauen
  const job: JobCreateInput = {
    // Pflichtfelder (bereits validiert)
    title: title!,
    company: company!,
    location: location!,
    locationRegion: locationRegion!,
    employmentType: employmentType!,
    startDate: startDate!,
    jobType: jobType!,
    phone: phone!,
    email: email!,
    description: description!,

    // Optionale Felder mit Defaults
    hasAccommodation: toBoolean(data.hasAccommodation),
    hasMeals: toBoolean(data.hasMeals),

    // Optionale Felder ohne Defaults
    companyDescription: data.companyDescription?.trim(),
    companyWebsite: data.companyWebsite?.trim(),
    companyAddress: data.companyAddress?.trim(),
    fullDescription: data.fullDescription?.trim(),
    contractType: data.contractType?.trim(),
    experienceLevel: data.experienceLevel?.trim(),
    education: data.education?.trim(),
    contactPerson: data.contactPerson?.trim(),
    contactPhone: data.contactPhone?.trim(),
    contactEmail: data.contactEmail?.trim(),
    workingHours: data.workingHours?.trim(),
    applicationDeadline: data.applicationDeadline?.trim(),
    jobReference: data.jobReference?.trim(),
    salary: data.salary?.trim(),

    // Array-Felder
    requirements: toStringArray(data.requirements),
    benefits: toStringArray(data.benefits),
    languages: toStringArray(data.languages),
    certifications: toStringArray(data.certifications),
    tasks: toStringArray(data.tasks),
    offers: toStringArray(data.offers),

    // Numerische Felder
    salaryMin: toNumber(data.salaryMin),
    salaryMax: toNumber(data.salaryMax),
    numberOfPositions: toNumber(data.numberOfPositions),
  }

  // Leere Arrays entfernen (für sauberes JSON)
  if (job.requirements && job.requirements.length === 0) delete job.requirements
  if (job.benefits && job.benefits.length === 0) delete job.benefits
  if (job.languages && job.languages.length === 0) delete job.languages
  if (job.certifications && job.certifications.length === 0) delete job.certifications
  if (job.tasks && job.tasks.length === 0) delete job.tasks
  if (job.offers && job.offers.length === 0) delete job.offers

  return job
}
