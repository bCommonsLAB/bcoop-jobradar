/**
 * Environment Configuration Helpers
 * 
 * Zentrale Stelle für ENV-Variablen-Zugriff.
 * Keine Defaults - fehlende Variablen führen zu Fehlern.
 */

/**
 * Secretary Service Konfiguration aus ENV-Variablen
 * 
 * @returns Konfiguration mit baseUrl und apiKey
 * @throws Error wenn SECRETARY_SERVICE_URL oder SECRETARY_SERVICE_API_KEY fehlen
 */
export function getSecretaryConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.SECRETARY_SERVICE_URL
  const apiKey = process.env.SECRETARY_SERVICE_API_KEY

  if (!baseUrl || baseUrl.trim().length === 0) {
    throw new Error('SECRETARY_SERVICE_URL ist nicht definiert oder leer.')
  }

  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('SECRETARY_SERVICE_API_KEY ist nicht definiert oder leer.')
  }

  return { baseUrl: baseUrl.trim(), apiKey: apiKey.trim() }
}

/**
 * Admin-Passwort aus ENV-Variablen
 * 
 * @returns Admin-Passwort
 * @throws Error wenn ADMIN_PASSWORD nicht definiert ist
 */
export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD

  if (!password || password.trim().length === 0) {
    throw new Error('ADMIN_PASSWORD ist nicht definiert oder leer.')
  }

  return password.trim()
}
