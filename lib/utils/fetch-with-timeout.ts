/**
 * Fetch mit Timeout-Unterstützung
 * 
 * Erweitert fetch() um Timeout-Funktionalität und spezifische Fehlerklassen
 * für bessere Fehlerbehandlung (Timeout, Netzwerk, HTTP).
 */

/**
 * Timeout-Fehler: Request hat das Timeout-Limit überschritten
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message)
    this.name = 'TimeoutError'
  }
}

/**
 * Netzwerk-Fehler: Verbindungsproblem (kein HTTP-Status)
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * HTTP-Fehler: Server hat einen Fehler-Status zurückgegeben
 */
export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message?: string,
    public responseBody?: unknown
  ) {
    super(message || `${status} ${statusText}`)
    this.name = 'HttpError'
  }
}

/**
 * Fetch mit Timeout-Unterstützung
 * 
 * @param url URL für den Request
 * @param options Fetch-Optionen + timeoutMs (Timeout in Millisekunden)
 * @returns Response vom Server
 * @throws TimeoutError wenn Timeout überschritten
 * @throws NetworkError bei Netzwerkproblemen
 * @throws HttpError bei HTTP-Fehlern (wird hier NICHT geworfen, nur Response zurückgegeben)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs, ...fetchOptions } = options

  // Wenn kein Timeout gesetzt, normalen fetch verwenden
  if (!timeoutMs) {
    try {
      return await fetch(url, fetchOptions)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError(`Netzwerkfehler: ${error.message}`)
      }
      throw error
    }
  }

  // Timeout mit AbortController implementieren
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)

    // AbortError bedeutet Timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout nach ${timeoutMs}ms`)
    }

    // Andere Netzwerkfehler
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError(`Netzwerkfehler: ${error.message}`)
    }

    // Unbekannte Fehler weiterwerfen
    throw error
  }
}
