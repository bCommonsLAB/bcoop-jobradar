"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Admin-Import-Seite - Umleitung zur konsolidierten Admin-Seite
 * 
 * Diese Route wurde konsolidiert mit /admin/jobs.
 * Alle Funktionen (Import + Verwaltung) sind jetzt auf einer Seite verfügbar.
 */
export default function AdminImportPage() {
  const router = useRouter()

  useEffect(() => {
    // Umleitung zur konsolidierten Admin-Seite
    router.replace("/admin/jobs")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Weiterleitung zur Admin-Seite...</p>
      </div>
    </div>
  )
}
