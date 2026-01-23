"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { importJobFromUrl, SecretaryServiceError } from "@/lib/secretary/client"
import { parseBatchJobList, type JobLink } from "@/lib/job-import/parse"
import { mapStructuredDataToJob, type StructuredJobData } from "@/lib/job-import/mapper"

interface BatchImportTabProps {
  onJobsCreated?: (jobData: unknown) => void
}

/**
 * Batch Import Tab - Importiert mehrere Jobs von einer Liste
 */
export default function BatchImportTab({ onJobsCreated }: BatchImportTabProps) {
  const [batchUrl, setBatchUrl] = useState("")
  const [containerSelector, setContainerSelector] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [batchImporting, setBatchImporting] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)
  const [jobLinks, setJobLinks] = useState<JobLink[]>([])
  const [importProgress, setImportProgress] = useState(0)
  const [isImportingBatch, setIsImportingBatch] = useState(false)
  const [shouldCancelBatch, setShouldCancelBatch] = useState(false)

  // URL validieren
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  // Job-Liste extrahieren
  const handleExtractJobList = async () => {
    if (!batchUrl.trim()) {
      setBatchError("Bitte geben Sie eine URL ein.")
      return
    }

    if (!isValidUrl(batchUrl)) {
      setBatchError("Bitte geben Sie eine gültige URL ein.")
      return
    }

    try {
      setBatchImporting(true)
      setBatchError(null)
      setJobLinks([])

      console.log("[JobImportModal] Extrahiere Job-Liste von URL:", batchUrl)

      const response = await importJobFromUrl(batchUrl, {
        sourceLanguage,
        targetLanguage,
        template: "ExtractJobListFromWebsite",
        useCache: false,
        containerSelector: containerSelector || undefined,
      })

      console.log("[JobImportModal] Job-Liste extrahiert:", response)

      if (response.status === "success" && response.data?.structured_data) {
        const structuredData = response.data.structured_data
        const links = parseBatchJobList(structuredData)

        if (links.length > 0) {
          setJobLinks(links)
        } else {
          throw new Error("Keine Job-Links gefunden")
        }
      } else {
        throw new Error("Keine Job-Liste erhalten")
      }
    } catch (error) {
      console.error("[JobImportModal] Fehler beim Extrahieren der Job-Liste:", error)

      if (error instanceof SecretaryServiceError) {
        setBatchError(error.message)
      } else {
        setBatchError(
          error instanceof Error
            ? error.message
            : "Fehler beim Extrahieren der Job-Liste. Stellen Sie sicher, dass die URL eine Liste von Jobs enthält."
        )
      }
    } finally {
      setBatchImporting(false)
    }
  }

  // Alle Jobs importieren
  const handleBatchImport = async () => {
    if (jobLinks.length === 0) return

    setIsImportingBatch(true)
    setImportProgress(0)
    setShouldCancelBatch(false)

    let successCount = 0
    let errorCount = 0
    let processedCount = 0

    for (let i = 0; i < jobLinks.length; i++) {
      // Prüfen ob abgebrochen werden soll
      if (shouldCancelBatch) {
        console.log("[JobImportModal] Batch-Import wurde abgebrochen")
        break
      }

      processedCount = i

      const jobLink = jobLinks[i]!
      if (!jobLink.url) {
        errorCount++
        continue
      }

      // Status auf 'importing' setzen (vereinfacht, da JobLink kein status-Feld hat)
      try {
        // Job-Daten extrahieren
        const response = await importJobFromUrl(jobLink.url, {
          sourceLanguage,
          targetLanguage,
          useCache: false,
        })

        if (response.status === "success" && response.data?.structured_data) {
          const structuredData = response.data.structured_data as StructuredJobData
          // URL zur structured_data hinzufügen (für Deduplizierung und Quellenangabe)
          structuredData.url = jobLink.url
          const jobData = mapStructuredDataToJob(structuredData)

          const createResponse = await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobs: [jobData],
            }),
          })

          const createData = await createResponse.json()

          if (createData.status === "success") {
            successCount++
          } else {
            throw new Error(createData.message || "Fehler beim Erstellen des Jobs")
          }
        } else {
          throw new Error("Keine Job-Daten erhalten")
        }
      } catch (error) {
        errorCount++
        console.error(`[JobImportModal] Fehler beim Import von ${jobLink.name}:`, error)
      }

      // Progress aktualisieren
      setImportProgress(((i + 1) / jobLinks.length) * 100)
      processedCount = i + 1

      // Kleine Pause zwischen Requests
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    setIsImportingBatch(false)

    // Zusammenfassung anzeigen
    if (shouldCancelBatch) {
      const remaining = jobLinks.length - processedCount
      setBatchError(
        `Import abgebrochen: ${successCount} erfolgreich, ${errorCount} fehlgeschlagen, ${remaining} übersprungen`
      )
    } else if (successCount > 0 && errorCount === 0) {
      setBatchError(null)
      if (onJobsCreated) {
        onJobsCreated({ successCount })
      }
      // Nach kurzer Verzögerung Modal schließen und Seite neu laden
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else if (errorCount > 0) {
      setBatchError(`Import abgeschlossen: ${successCount} erfolgreich, ${errorCount} fehlgeschlagen`)
    }
  }

  return (
    <div className="space-y-4 flex flex-col">
      {/* Scrollbarer Bereich für Formular und Liste */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {/* URL-Eingabe für Job-Liste */}
        <div className="space-y-2">
          <Label htmlFor="batchUrl">URL der Job-Liste *</Label>
          <Input
            id="batchUrl"
            type="url"
            placeholder="https://example.com/jobs-overview"
            value={batchUrl}
            onChange={(e) => setBatchUrl(e.target.value)}
            disabled={batchImporting || isImportingBatch}
            className="w-full"
          />
          <p className="text-sm text-gray-600">
            URL einer Seite, die Links zu mehreren Jobs enthält
          </p>
        </div>

        {/* Container-Selector Eingabe */}
        <div className="space-y-2">
          <Label htmlFor="containerSelector">Container-Selector (XPath)</Label>
          <Input
            id="containerSelector"
            type="text"
            placeholder="z.B. li.job-item"
            value={containerSelector}
            onChange={(e) => setContainerSelector(e.target.value)}
            disabled={batchImporting || isImportingBatch}
            className="w-full font-mono text-sm"
          />
          <p className="text-sm text-gray-600">
            Optional: XPath-Ausdruck zur gezielten Selektion des Containers mit den Job-Links
          </p>
        </div>

        {/* Batch Fehler-Anzeige */}
        {batchError && (
          <Alert variant={batchError.includes("abgeschlossen") ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{batchError}</AlertDescription>
          </Alert>
        )}

        {/* Job-Liste - Wenn keine Jobs, Button anzeigen */}
        {jobLinks.length === 0 ? (
          <div className="flex justify-end">
            <Button
              onClick={handleExtractJobList}
              disabled={batchImporting || !batchUrl.trim() || !isValidUrl(batchUrl)}
            >
              {batchImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Lade Job-Liste...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Job-Liste laden
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Job-Liste mit Überschrift und Progress */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">
                  Gefundene Jobs ({jobLinks.length})
                </h4>
              </div>
              {isImportingBatch && (
                <span className="text-sm text-gray-600">
                  {Math.round(importProgress)}% abgeschlossen
                </span>
              )}
            </div>

            {isImportingBatch && <Progress value={importProgress} />}

            {/* Job-Liste: Feste Höhe mit eigenem Scroll */}
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="px-4 pb-4 space-y-2">
                {jobLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between px-3 pb-3 rounded hover:bg-gray-50 border-b last:border-b-0"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="font-medium text-sm leading-tight">{link.name}</p>
                      <p className="text-xs text-gray-500 truncate">{link.url}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex gap-2">
          {/* Batch Import Actions - Immer sichtbar im Footer wenn Jobs gefunden */}
          {jobLinks.length > 0 && (
            <>
              {isImportingBatch ? (
                <Button variant="destructive" onClick={() => setShouldCancelBatch(true)}>
                  Import abbrechen
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setJobLinks([])
                    }}
                  >
                    Zurücksetzen
                  </Button>
                  <Button onClick={handleBatchImport}>
                    {`${jobLinks.length} Jobs importieren`}
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
