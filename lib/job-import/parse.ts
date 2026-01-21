/**
 * Parser für Batch-Job-Listen
 * 
 * Parsed verschiedene Formate von structured_data aus dem Secretary Service
 * und konvertiert sie in eine einheitliche Liste von Job-Links.
 */

/**
 * Job-Link aus Batch-Import
 */
export interface JobLink {
  name: string
  url: string
  /** Optional: Zusätzliche Metadaten aus der Liste */
  metadata?: Record<string, unknown>
}

/**
 * Type Guard: Prüft ob ein Wert ein Objekt ist
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Type Guard: Prüft ob ein Wert ein Job-Item ist
 */
function isJobItem(value: unknown): value is Record<string, unknown> {
  return isObject(value)
}

/**
 * Konvertiert ein Item in einen JobLink
 */
function mapItemToJobLink(item: unknown): JobLink {
  if (!isJobItem(item)) {
    return {
      name: 'Unbenannter Job',
      url: '',
      metadata: {},
    }
  }

  // Verschiedene Feldnamen für Name/Titel unterstützen
  const name =
    (typeof item.name === 'string' ? item.name :
     typeof item.title === 'string' ? item.title :
     typeof item.job === 'string' ? item.job :
     'Unbenannter Job')

  // Verschiedene Feldnamen für URL unterstützen
  const url =
    (typeof item.url === 'string' ? item.url :
     typeof item.link === 'string' ? item.link :
     typeof item.href === 'string' ? item.href :
     '')

  // Alle anderen Felder als Metadaten speichern
  const metadata: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(item)) {
    if (key !== 'name' && key !== 'title' && key !== 'job' && 
        key !== 'url' && key !== 'link' && key !== 'href') {
      metadata[key] = value
    }
  }

  return { name, url, metadata }
}

/**
 * Parsed structured_data aus dem Secretary Service in eine Liste von Job-Links
 * 
 * Unterstützte Formate:
 * - Direktes Array: `[{ name, url, ... }, ...]`
 * - Objekt mit items: `{ items: [...] }`
 * - Objekt mit jobs: `{ jobs: [...] }`
 * - Objekt mit sessions: `{ sessions: [...] }` (Rückwärtskompatibilität)
 * 
 * @param structuredData Die structured_data aus der Secretary-Response
 * @returns Liste von Job-Links
 * @throws Error wenn keine gültige Liste gefunden wird
 */
export function parseBatchJobList(structuredData: unknown): JobLink[] {
  if (Array.isArray(structuredData)) {
    // Direktes Array
    return structuredData.map(mapItemToJobLink)
  }

  if (isObject(structuredData)) {
    // Prüfe verschiedene Wrapper-Formate
    if (Array.isArray(structuredData.items)) {
      return structuredData.items.map(mapItemToJobLink)
    }

    if (Array.isArray(structuredData.jobs)) {
      return structuredData.jobs.map(mapItemToJobLink)
    }

    if (Array.isArray(structuredData.sessions)) {
      // Rückwärtskompatibilität: sessions → jobs
      return structuredData.sessions.map(mapItemToJobLink)
    }
  }

  // Kein gültiges Format gefunden
  throw new Error(
    'Keine gültige Job-Liste gefunden. Erwartet wird ein Array oder ein Objekt mit items/jobs/sessions.'
  )
}
