/**
 * Secretary Service Client - HTTP Client for Secretary Service API
 * 
 * HTTP-Client für die Kommunikation mit dem Secretary Service.
 * Bietet Methoden für URL-basierte Job-Extraktion mit Authentifizierung,
 * Request-Formatierung, Response-Parsing und Fehlerbehandlung.
 */

import { callTemplateExtractFromUrl } from './adapter'
import { getSecretaryConfig } from '@/lib/env'

/**
 * Fehlerklasse für Secretary Service Fehler
 */
export class SecretaryServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SecretaryServiceError'
  }
}

/**
 * Response-Typ für Template-Extraktion
 */
export interface TemplateExtractionResponse {
  status: 'success' | 'error'
  request?: {
    processor: string
    timestamp: string
    parameters: {
      url: string
      template: string
      source_language: string
      target_language: string
      use_cache: boolean
    }
  }
  process?: {
    id: string
    main_processor: string
    started: string
    completed: string | null
    duration: number | null
    is_from_cache: boolean
  }
  error?: {
    code?: string
    message?: string
  }
  data?: {
    text: string
    language: string
    format: string
    structured_data: unknown // Struktur hängt vom Template ab
  }
}

/**
 * Optionen für Job-Import von URL
 */
export interface ImportJobFromUrlOptions {
  /** Quellsprache (Default: "en") */
  sourceLanguage?: string
  /** Zielsprache (Default: "en") */
  targetLanguage?: string
  /** Template-Name (Default: "ExtractJobDataFromWebsite") */
  template?: string
  /** Cache verwenden (Default: false) */
  useCache?: boolean
  /** Optional: Container-Selector (XPath oder CSS-Selector) */
  containerSelector?: string
}

/**
 * Importiert Job-Daten aus einer Website-URL mithilfe des Secretary Services
 * 
 * @param url Die zu analysierende Website-URL
 * @param options Optionen für die Job-Extraktion
 * @returns Die extrahierten Job-Daten als TemplateExtractionResponse
 * @throws SecretaryServiceError bei Fehlern
 */
export async function importJobFromUrl(
  url: string,
  options: ImportJobFromUrlOptions = {}
): Promise<TemplateExtractionResponse> {
  try {
    console.log('[secretary/client] importJobFromUrl aufgerufen mit URL:', url)

    // Template-Name bestimmen (Default: ExtractJobDataFromWebsite)
    const templateName = options.template || 'ExtractJobDataFromWebsite'

    // Request an unsere API-Route senden (die lädt dann serverseitig das Template)
    const response = await fetch('/api/secretary/import-from-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        source_language: options.sourceLanguage || 'en',
        target_language: options.targetLanguage || 'en',
        template: templateName, // API-Route lädt das Template serverseitig
        use_cache: options.useCache ?? false,
        container_selector: options.containerSelector,
      }),
    })

    // HTTP-Fehler behandeln
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await response.json()
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message
        } else if (errorData?.message) {
          errorMessage = errorData.message
        }
      } catch {
        // Fehler beim Parsen der Fehlerantwort - verwende Standard-Message
      }
      throw new SecretaryServiceError(errorMessage)
    }

    // Response parsen
    const data: TemplateExtractionResponse = await response.json()

    // Status prüfen
    if (data.status === 'error') {
      const errorMsg = data.error?.message || 'Unbekannter Fehler beim Job-Import'
      throw new SecretaryServiceError(errorMsg)
    }

    console.log('[secretary/client] Job-Import erfolgreich')
    return data
  } catch (error) {
    console.error('[secretary/client] Fehler beim Job-Import:', error)

    // SecretaryServiceError weiterwerfen
    if (error instanceof SecretaryServiceError) {
      throw error
    }

    // Andere Fehler wrappen
    throw new SecretaryServiceError(
      error instanceof Error ? error.message : 'Unbekannter Fehler beim Job-Import'
    )
  }
}
