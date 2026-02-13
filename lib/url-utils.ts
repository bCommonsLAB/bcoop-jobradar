/**
 * Extrahiert die Domain aus einer URL (ohne www, ohne Pfad, ohne Query-Parameter).
 * Beispiel: https://www.styljobs.it/job/123?foo=bar → styljobs.it
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    let host = urlObj.hostname
    if (host.startsWith("www.")) {
      host = host.slice(4)
    }
    return host
  } catch {
    return ""
  }
}
