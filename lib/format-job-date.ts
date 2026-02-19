/**
 * Smarte Anzeige des Job-Startdatums.
 * - Kein Datum → null (Zeile ausblenden)
 * - "subito" (case-insensitive) → "Subito"
 * - Datum in Vergangenheit oder heute → "Subito"
 * - Zukünftiges Datum (DD.MM.YYYY) → "Da DD.MM.YYYY"
 */
export function getStartDateDisplay(startDate: string | undefined): string | null {
  if (!startDate || !startDate.trim()) return null
  const trimmed = startDate.trim()
  if (trimmed.toLowerCase() === "subito") return "Subito"
  const parts = trimmed.split(".")
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
      const jobDate = new Date(year, month, day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      jobDate.setHours(0, 0, 0, 0)
      if (jobDate <= today) return "Subito"
      return `Da ${trimmed}`
    }
  }
  return `Da ${trimmed}`
}
