"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Globe } from "lucide-react"
import JobImportModal from "@/components/job-import/job-import-modal"

/**
 * Admin-Import-Seite für Jobs
 * 
 * Bietet einen Button zum Öffnen des Import-Modals.
 */
export default function AdminImportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg md:rounded-3xl p-6 md:p-8 shadow-lg border border-border/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Globe className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Job-Import aus Website
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Importiere Jobs einzeln oder als Batch von einer externen Website
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verwende den Secretary Service, um Job-Daten von einer Website zu extrahieren
              und in die Datenbank zu importieren.
            </p>

            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-primary via-primary/90 to-cyan-600 hover:from-primary/90 hover:via-primary/80 hover:to-cyan-600/90 text-white font-bold shadow-lg gap-2"
            >
              <Download className="w-5 h-5" />
              Jobs importieren
            </Button>
          </div>
        </div>
      </div>

      <JobImportModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onJobsImported={() => {
          // Nach erfolgreichem Import: Seite neu laden oder Jobs-Liste aktualisieren
          window.location.reload()
        }}
      />
    </div>
  )
}
