/**
 * Utility-Funktionen für die Verwaltung von gelikten Jobs
 * 
 * Speichert gelikte Job-IDs in localStorage unter dem Key "job-radar-liked-jobs"
 */

const STORAGE_KEY = "job-radar-liked-jobs"

/**
 * Lädt alle gelikten Job-IDs aus localStorage
 */
export function getLikedJobs(): string[] {
  if (typeof window === "undefined") {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Error loading liked jobs:", error)
    return []
  }
}

/**
 * Prüft, ob ein Job geliked ist
 */
export function isJobLiked(jobId: string): boolean {
  const likedJobs = getLikedJobs()
  return likedJobs.includes(jobId)
}

/**
 * Fügt einen Job zu den gelikten Jobs hinzu oder entfernt ihn
 */
export function toggleLike(jobId: string): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    const likedJobs = getLikedJobs()
    const isLiked = likedJobs.includes(jobId)
    
    let updated: string[]
    if (isLiked) {
      // Entferne Job aus Liste
      updated = likedJobs.filter((id) => id !== jobId)
    } else {
      // Füge Job zur Liste hinzu
      updated = [...likedJobs, jobId]
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return !isLiked // Gibt neuen Like-Status zurück
  } catch (error) {
    console.error("Error toggling like:", error)
    return false
  }
}

/**
 * Entfernt einen Job aus den gelikten Jobs
 */
export function removeLike(jobId: string): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    const likedJobs = getLikedJobs()
    const updated = likedJobs.filter((id) => id !== jobId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error removing like:", error)
  }
}

/**
 * Gibt die Anzahl der gelikten Jobs zurück
 */
export function getLikedJobsCount(): number {
  return getLikedJobs().length
}

