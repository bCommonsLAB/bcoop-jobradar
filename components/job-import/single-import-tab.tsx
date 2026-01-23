"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { importJobFromUrl, SecretaryServiceError } from "@/lib/secretary/client"
import type { StructuredJobData } from "@/lib/job-import/mapper"
import { mapStructuredDataToJob } from "@/lib/job-import/mapper"
import JobPreview from "./job-preview"

interface SingleImportTabProps {
  onJobCreated?: (jobData: unknown) => void
}

/**
 * Single Import Tab - Importiert einen einzelnen Job von einer URL
 */
export default function SingleImportTab({ onJobCreated }: SingleImportTabProps) {
  const [url, setUrl] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [importedData, setImportedData] = useState<StructuredJobData | null>(null)

  // URL validieren
  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  // Job-Import durchführen
  const handleImport = async () => {
    if (!url.trim()) {
      setError("Bitte geben Sie eine URL ein.")
      return
    }

    if (!isValidUrl(url)) {
      setError("Bitte geben Sie eine gültige URL ein.")
      return
    }

    try {
      setImporting(true)
      setError(null)
      setSuccess(null)

      console.log("[JobImportModal] Starte Import für URL:", url)

      const response = await importJobFromUrl(url, {
        sourceLanguage,
        targetLanguage,
        useCache: false,
      })

      console.log("[JobImportModal] Import erfolgreich:", response)

      if (response.status === "success" && response.data?.structured_data) {
        const structuredData = response.data.structured_data as StructuredJobData
        // URL zur structured_data hinzufügen (für Deduplizierung und Quellenangabe)
        structuredData.url = url
        setImportedData(structuredData)
        setSuccess(
          "Job-Daten erfolgreich extrahiert! Überprüfen Sie die Vorschau und bestätigen Sie die Erstellung."
        )
      } else {
        throw new Error("Keine Job-Daten erhalten")
      }
    } catch (error) {
      console.error("[JobImportModal] Import-Fehler:", error)

      if (error instanceof SecretaryServiceError) {
        setError(error.message)
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
      }
    } finally {
      setImporting(false)
    }
  }

  // Job erstellen
  const handleCreateJob = async () => {
    if (!importedData) return

    try {
      setImporting(true)
      setError(null)

      // Mapping von structured_data zu JobCreateInput
      const jobData = mapStructuredDataToJob(importedData)

      console.log("[JobImportModal] handleCreateJob - Sende Job-Daten an API:", JSON.stringify(jobData, null, 2))

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobs: [jobData],
        }),
      })

      console.log("[JobImportModal] handleCreateJob - API Response Status:", response.status)

      const data = await response.json()
      console.log("[JobImportModal] handleCreateJob - API Response Data:", data)

      if (data.status === "success") {
        setSuccess("Job erfolgreich erstellt!")

        if (onJobCreated) {
          onJobCreated(data.data)
        }

        // Nach kurzer Verzögerung Modal schließen
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error(data.message || "Fehler beim Erstellen des Jobs")
      }
    } catch (error) {
      console.error("[JobImportModal] Fehler beim Erstellen des Jobs:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Fehler beim Erstellen des Jobs. Bitte versuchen Sie es erneut."
      )
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* URL-Eingabe */}
      <div className="space-y-2">
        <Label htmlFor="url">Job-URL *</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/job-page"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={importing}
          className="w-full"
        />
        <p className="text-sm text-gray-600">
          URL der Seite mit den Job-Informationen
        </p>
      </div>

      {/* Fehler-Anzeige */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Erfolg-Anzeige */}
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Extrahierte Daten-Vorschau */}
      {importedData && <JobPreview data={importedData} />}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {!importedData ? (
          <Button
            onClick={handleImport}
            disabled={importing || !url.trim() || !isValidUrl(url)}
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extrahiere...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Daten extrahieren
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleCreateJob} disabled={importing}>
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Erstelle...
              </>
            ) : (
              "Job erstellen"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
