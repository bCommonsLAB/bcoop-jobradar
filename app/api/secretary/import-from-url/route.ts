/**
 * API Proxy für Secretary Service URL-Import
 * 
 * Proxy-Endpunkt: App → Secretary Service
 * 
 * Route: POST /api/secretary/import-from-url
 * 
 * Reicht Requests an den Secretary Service weiter und gibt die Antwort zurück.
 */

import { NextRequest, NextResponse } from 'next/server'
import { callTemplateExtractFromUrl } from '@/lib/secretary/adapter'
import { getSecretaryConfig } from '@/lib/env'
import { HttpError, NetworkError, TimeoutError } from '@/lib/utils/fetch-with-timeout'
import { loadJobDataTemplate, loadJobListTemplate } from '@/lib/templates/template-loader'

// Next.js Route Segment Config: Kein Caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * Request Body für URL-Import
 */
interface ImportFromUrlRequest {
  url: string
  source_language?: string
  target_language?: string
  template?: string
  template_content?: string
  use_cache?: boolean
  container_selector?: string
}

/**
 * POST /api/secretary/import-from-url
 * 
 * Proxy-Endpunkt für Secretary Service URL-Import
 */
export async function POST(request: NextRequest) {
  try {
    // Request Body parsen
    const body = (await request.json()) as ImportFromUrlRequest

    // Validierung
    if (!body.url || typeof body.url !== 'string' || body.url.trim().length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'URL ist erforderlich' },
        { status: 400 }
      )
    }

    // Secretary-Konfiguration holen
    const { baseUrl, apiKey } = getSecretaryConfig()

    // Template-URL zusammenbauen
    const templateUrl = `${baseUrl}/transformer/template`

    // Template-Inhalt laden (serverseitig aus templates/)
    // Falls template_content bereits gesetzt ist, verwenden wir das
    // Ansonsten versuchen wir, das Template lokal zu laden
    let templateContent: string | undefined = body.template_content
    const templateName = body.template || 'ExtractJobDataFromWebsite'

    if (!templateContent) {
      // Versuche lokales Template zu laden
      try {
        if (templateName === 'ExtractJobDataFromWebsite') {
          templateContent = loadJobDataTemplate()
        } else if (templateName === 'ExtractJobListFromWebsite') {
          templateContent = loadJobListTemplate()
        }
      } catch (error) {
        console.warn(
          `[API] Template "${templateName}" konnte nicht geladen werden, verwende Template-Name:`,
          error instanceof Error ? error.message : String(error)
        )
        // Falls Template nicht geladen werden kann, verwenden wir den Template-Namen
        // und lassen den Secretary Service das Template selbst laden
      }
    }

    // Adapter aufrufen
    const response = await callTemplateExtractFromUrl({
      templateUrl,
      url: body.url.trim(),
      template: templateContent ? undefined : templateName, // Nur wenn kein templateContent
      templateContent: templateContent, // Lokales Template verwenden, falls geladen
      sourceLanguage: body.source_language || 'en',
      targetLanguage: body.target_language || 'en',
      useCache: body.use_cache ?? false,
      containerSelector: body.container_selector,
      apiKey,
      timeoutMs: 60000, // 60 Sekunden Timeout
    })

    // Response weiterreichen
    if (!response.ok) {
      // Fehler-Response parsen und weiterreichen
      let errorData: unknown
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }

      return NextResponse.json(
        {
          status: 'error',
          error: errorData,
        },
        { status: response.status }
      )
    }

    // Erfolgreiche Response parsen und weiterreichen
    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('[API] Fehler beim Secretary-Import:', error)

    // Spezifische Fehler behandeln
    if (error instanceof HttpError) {
      return NextResponse.json(
        {
          status: 'error',
          message: error.message,
          error: {
            code: 'HTTP_ERROR',
            status: error.status,
            statusText: error.statusText,
            body: error.responseBody,
          },
        },
        { status: error.status }
      )
    }

    if (error instanceof TimeoutError) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Request timeout - Secretary Service antwortet nicht rechtzeitig',
          error: {
            code: 'TIMEOUT',
            message: error.message,
          },
        },
        { status: 504 }
      )
    }

    if (error instanceof NetworkError) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Netzwerkfehler - Secretary Service nicht erreichbar',
          error: {
            code: 'NETWORK_ERROR',
            message: error.message,
          },
        },
        { status: 503 }
      )
    }

    // Unbekannter Fehler
    return NextResponse.json(
      {
        status: 'error',
        message: 'Unbekannter Fehler beim Secretary-Import',
        error: {
          code: 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 }
    )
  }
}
