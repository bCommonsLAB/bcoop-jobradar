"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Lock, AlertCircle, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown, Download } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import JobImportModal from "@/components/job-import/job-import-modal"
import type { Job } from "@/lib/job"

/**
 * Admin-Job-Verwaltungsseite
 * 
 * Zeigt alle Jobs in einer Tabelle mit Filter, Sortierung und Lösch-Funktionen.
 */
export default function AdminJobsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  
  // Filter und Sortierung
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("")
  const [sortField, setSortField] = useState<"importDate" | "region" | "location">("importDate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Prüfe ob bereits authentifiziert
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = sessionStorage.getItem("admin_authenticated")
      if (authStatus === "true") {
        setIsAuthenticated(true)
        loadJobs()
      }
    }
  }, [])

  const loadJobs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/jobs")
      const data = await response.json()
      if (data.jobs) {
        setJobs(data.jobs)
      }
    } catch (error) {
      setError("Fehler beim Laden der Jobs")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.status === "success" && data.authenticated) {
        setIsAuthenticated(true)
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_authenticated", "true")
        }
        loadJobs()
      } else {
        setError(data.message || "Falsches Passwort")
      }
    } catch (error) {
      setError("Fehler bei der Passwort-Prüfung. Bitte versuchen Sie es erneut.")
    } finally {
      setIsChecking(false)
    }
  }

  // Gefilterte und sortierte Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs]

    // Filter nach Region
    if (regionFilter !== "all") {
      filtered = filtered.filter((job) => job.locationRegion === regionFilter)
    }

    // Filter nach Location (Textsuche)
    if (locationFilter.trim()) {
      const searchLower = locationFilter.toLowerCase()
      filtered = filtered.filter(
        (job) =>
          job.location.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.title.toLowerCase().includes(searchLower)
      )
    }

    // Sortierung
    filtered.sort((a, b) => {
      let aValue: string | number = ""
      let bValue: string | number = ""

      if (sortField === "importDate") {
        // Verwende sourceUrl als Proxy für Import-Datum (neueste zuerst wenn desc)
        // Jobs ohne sourceUrl werden nach hinten sortiert
        if (!a.sourceUrl && !b.sourceUrl) return 0
        if (!a.sourceUrl) return 1
        if (!b.sourceUrl) return -1
        // Einfache String-Sortierung (besser wäre ein tatsächliches Datum-Feld)
        aValue = a.sourceUrl
        bValue = b.sourceUrl
      } else if (sortField === "region") {
        aValue = a.locationRegion || ""
        bValue = b.locationRegion || ""
      } else if (sortField === "location") {
        aValue = a.location || ""
        bValue = b.location || ""
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [jobs, regionFilter, locationFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage)
  const paginatedJobs = filteredAndSortedJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Eindeutige Regionen für Filter
  const uniqueRegions = useMemo(() => {
    const regions = new Set(jobs.map((job) => job.locationRegion).filter(Boolean))
    return Array.from(regions).sort()
  }, [jobs])

  const handleSelectJob = (jobId: string, checked: boolean) => {
    const newSelected = new Set(selectedJobs)
    if (checked) {
      newSelected.add(jobId)
    } else {
      newSelected.delete(jobId)
    }
    setSelectedJobs(newSelected)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedJobs(new Set(paginatedJobs.map((job) => job.id)))
    } else {
      setSelectedJobs(new Set())
    }
  }

  const handleDelete = async (jobIds: string[]) => {
    if (!confirm(`Möchten Sie ${jobIds.length} Job(s) wirklich löschen?`)) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)

    try {
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobIds }),
      })

      const data = await response.json()

      if (data.status === "success") {
        setSelectedJobs(new Set())
        await loadJobs()
        setCurrentPage(1) // Zurück zur ersten Seite
      } else {
        setDeleteError(data.message || "Fehler beim Löschen")
      }
    } catch (error) {
      setDeleteError("Fehler beim Löschen der Jobs")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSort = (field: "importDate" | "region" | "location") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    )
  }

  // Passwort-Eingabe anzeigen wenn nicht authentifiziert
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card rounded-2xl p-8 shadow-lg border border-border/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin-Zugang</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Bitte geben Sie das Admin-Passwort ein
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isChecking}
                className="w-full"
                autoFocus
                placeholder="Admin-Passwort eingeben"
              />
            </div>

            <Button
              type="submit"
              disabled={isChecking || !password.trim()}
              className="w-full"
              size="lg"
            >
              {isChecking ? "Prüfe..." : "Anmelden"}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-border/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Admin-Bereich</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Verwalten Sie alle Jobs: Importieren, Filtern, Sortieren und Löschen
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsImportModalOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-primary via-primary/90 to-cyan-600 hover:from-primary/90 hover:via-primary/80 hover:to-cyan-600/90 text-white font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                Jobs importieren
              </Button>
              <Button onClick={loadJobs} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Aktualisieren
              </Button>
            </div>
          </div>

          {/* Filter und Sortierung */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Regionen</SelectItem>
                  {uniqueRegions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Suche (Ort/Firma/Titel)</Label>
              <Input
                placeholder="Suchen..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Sortieren nach</Label>
              <Select
                value={sortField}
                onValueChange={(value) => setSortField(value as typeof sortField)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="importDate">Import-Datum</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              {selectedJobs.size > 0 && (
                <Button
                  onClick={() => handleDelete(Array.from(selectedJobs))}
                  disabled={isDeleting}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {selectedJobs.size} löschen
                </Button>
              )}
            </div>
          </div>

          {deleteError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}

          {/* Tabelle */}
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Lade Jobs...</p>
            </div>
          ) : paginatedJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Keine Jobs gefunden</p>
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            paginatedJobs.length > 0 &&
                            paginatedJobs.every((job) => selectedJobs.has(job.id))
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("importDate")}
                          className="flex items-center hover:text-primary"
                        >
                          Import-Datum
                          <SortIcon field="importDate" />
                        </button>
                      </TableHead>
                      <TableHead>Titel</TableHead>
                      <TableHead>Firma</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("location")}
                          className="flex items-center hover:text-primary"
                        >
                          Location
                          <SortIcon field="location" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort("region")}
                          className="flex items-center hover:text-primary"
                        >
                          Region
                          <SortIcon field="region" />
                        </button>
                      </TableHead>
                      <TableHead>Job-Typ</TableHead>
                      <TableHead className="w-20">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedJobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedJobs.has(job.id)}
                            onCheckedChange={(checked) =>
                              handleSelectJob(job.id, checked === true)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          {job.sourceUrl ? (
                            <span className="text-muted-foreground">
                              {new Date().toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.locationRegion}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {job.jobType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete([job.id])}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Seite {currentPage} von {totalPages} ({filteredAndSortedJobs.length} Jobs)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Zurück
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Import Modal */}
        <JobImportModal
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onJobsImported={() => {
            // Nach erfolgreichem Import: Jobs neu laden
            loadJobs()
            setIsImportModalOpen(false)
          }}
        />
      </div>
    </div>
  )
}
