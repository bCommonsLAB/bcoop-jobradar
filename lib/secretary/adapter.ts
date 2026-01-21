/**
 * Secretary Service Adapter - Low-level API Call Functions
 * 
 * Low-level Adapter-Funktionen für Secretary Service API-Aufrufe.
 * Bietet Wrapper-Funktionen für Template-Extraktion mit Timeout-Handling,
 * Authentifizierung und Fehlerbehandlung.
 */

import { fetchWithTimeout, HttpError, NetworkError, TimeoutError } from '@/lib/utils/fetch-with-timeout'

/**
 * Parameter für URL-basierte Template-Extraktion
 */
export interface TemplateExtractFromUrlParams {
  /** URL des Template-Endpoints (z.B. `${baseUrl}/transformer/template`) */
  templateUrl: string
  /** URL der zu extrahierenden Webseite */
  url: string
  /** Template-Name (z.B. "ExtractJobDataFromWebsite") */
  template?: string
  /** Optional: komplettes Template als YAML/Markdown */
  templateContent?: string
  /** Quellsprache (Default: "en") */
  sourceLanguage?: string
  /** Zielsprache (Default: "en") */
  targetLanguage?: string
  /** Cache verwenden (Default: false) */
  useCache?: boolean
  /** Optional: Container-Selector (XPath oder CSS-Selector) */
  containerSelector?: string
  /** API-Key für Authentifizierung */
  apiKey?: string
  /** Timeout in Millisekunden */
  timeoutMs?: number
}

/**
 * Ruft den Template-Transform-Endpoint des Secretary Services auf, um Daten von einer URL zu extrahieren.
 * 
 * Verwendet FormData (URLSearchParams) für URL-basierte Extraktion.
 * 
 * @param p Template-Extract-Parameter
 * @returns Response vom Secretary Service
 * @throws HttpError bei HTTP-Fehlern (inkl. 400 für ungültige URLs)
 * @throws NetworkError bei Netzwerkproblemen
 * @throws TimeoutError bei Timeout
 */
export async function callTemplateExtractFromUrl(
  p: TemplateExtractFromUrlParams
): Promise<Response> {
  // URL-Validierung
  try {
    new URL(p.url)
  } catch {
    throw new HttpError(400, 'Bad Request', 'Ungültiges URL-Format')
  }

  // Form-Data für den Secretary Service erstellen
  const formData = new URLSearchParams()
  formData.append('url', p.url)
  formData.append('source_language', p.sourceLanguage || 'en')
  formData.append('target_language', p.targetLanguage || 'en')

  // Entweder template_content oder template verwenden
  if (p.templateContent && p.templateContent.trim()) {
    formData.append('template_content', p.templateContent.trim())
  } else {
    formData.append('template', p.template || 'ExtractJobDataFromWebsite')
  }

  formData.append('use_cache', String(p.useCache ?? false))

  // Container-Selector optional hinzufügen
  if (p.containerSelector && p.containerSelector.trim().length > 0) {
    formData.append('container_selector', p.containerSelector.trim())
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  if (p.apiKey) {
    headers['Authorization'] = `Bearer ${p.apiKey}`
    headers['X-Secretary-Api-Key'] = p.apiKey
  }

  try {
    const res = await fetchWithTimeout(p.templateUrl, {
      method: 'POST',
      body: formData.toString(),
      headers,
      timeoutMs: p.timeoutMs,
    })

    // HTTP-Fehler werden hier nicht geworfen, sondern als Response zurückgegeben
    // Der Caller kann dann res.ok prüfen und selbst entscheiden
    return res
  } catch (e) {
    // Spezifische Fehler weiterwerfen
    if (e instanceof HttpError || e instanceof TimeoutError || e instanceof NetworkError) {
      throw e
    }
    // Unbekannte Fehler als NetworkError wrappen
    throw new NetworkError(e instanceof Error ? e.message : String(e))
  }
}
