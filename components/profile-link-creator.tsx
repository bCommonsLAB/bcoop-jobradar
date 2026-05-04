"use client"

import { useEffect, useMemo, useState } from "react"
import { Clock3, Copy, ExternalLink, Link2, Search, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslation } from "@/hooks/use-translation"
import { buildJobsLink, deleteLinkPreset, loadLinkPresets, saveLinkPreset, type LinkPreset } from "@/lib/link-presets"

export default function ProfileLinkCreator() {
  const { t } = useTranslation()
  const [jobType, setJobType] = useState("all")
  const [location, setLocation] = useState("all")
  const [personName, setPersonName] = useState("")
  const [search, setSearch] = useState("")
  const [presets, setPresets] = useState<LinkPreset[]>([])
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    setPresets(loadLinkPresets())
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    setPreviewUrl(buildJobsLink({ jobType, location }, window.location.origin))
  }, [jobType, location])

  const jobTypeOptions = [
    { value: "all", label: t("jobTypes.all") },
    { value: "kitchen", label: t("jobTypes.kitchen") },
    { value: "dishwasher", label: t("jobTypes.dishwasher") },
    { value: "housekeeping", label: t("jobTypes.housekeeping") },
    { value: "helper", label: t("jobTypes.helper") },
    { value: "service", label: t("jobTypes.service") },
  ]

  const locationOptions = [
    { value: "all", label: t("locations.all") },
    { value: "bolzano", label: t("locations.bolzano") },
    { value: "merano", label: t("locations.merano") },
    { value: "bressanone", label: t("locations.bressanone") },
    { value: "brunico", label: t("locations.brunico") },
    { value: "vipiteno", label: t("locations.vipiteno") },
    { value: "val-pusteria", label: t("locations.valPusteria") },
    { value: "val-venosta", label: t("locations.valVenosta") },
  ]

  const filterSummary = `${jobTypeOptions.find((item) => item.value === jobType)?.label ?? jobType} • ${locationOptions.find((item) => item.value === location)?.label ?? location}`

  const filteredPresets = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return presets
    return presets.filter((preset) => {
      const summary = `${preset.name} ${preset.filter.jobType} ${preset.filter.location}`.toLowerCase()
      return summary.includes(query)
    })
  }, [presets, search])

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  const handleCreateAndCopy = async () => {
    if (!personName.trim() || !previewUrl) return

    const preset: LinkPreset = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: personName.trim(),
      filter: { jobType, location },
      url: previewUrl,
    }

    const next = saveLinkPreset(preset)
    setPresets(next)
    await copyToClipboard(previewUrl)
    setPersonName("")
  }

  const handleDelete = (id: string) => {
    setPresets(deleteLinkPreset(id))
  }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-5 pt-2 md:pt-3 space-y-3 md:space-y-4">
      <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 shadow-md">
        <div className="flex items-center gap-2 text-primary mb-1">
          <Link2 className="w-4 h-4 md:w-5 md:h-5" />
          <h2 className="text-lg md:text-2xl font-bold text-foreground">{t("linkCreator.title")}</h2>
        </div>
        <p className="text-xs md:text-sm text-muted-foreground">{t("linkCreator.subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2 text-primary">
          <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-base md:text-xl font-semibold text-foreground">{t("linkCreator.createNewLink")}</h3>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{t("filters.jobType")}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {jobTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setJobType(option.value)}
                className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                  jobType === option.value
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent"
                    : "bg-white text-foreground border-border hover:border-primary/40"
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{t("filters.location")}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {locationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLocation(option.value)}
                className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                  location === option.value
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-transparent"
                    : "bg-white text-foreground border-border hover:border-primary/40"
                }`}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">{t("linkCreator.personName")}</p>
          <Input
            value={personName}
            onChange={(event) => setPersonName(event.target.value)}
            placeholder={t("linkCreator.personNamePlaceholder")}
          />
        </div>

        <div className="rounded-xl bg-teal-50/70 border border-teal-100 p-3">
          <p className="text-xs text-muted-foreground mb-1">{t("linkCreator.preview")}</p>
          <p className="text-xs md:text-sm break-all text-primary">{previewUrl}</p>
          <p className="text-xs mt-2">{t("linkCreator.filtersLabel")}: {filterSummary}</p>
        </div>

        <Button
          onClick={handleCreateAndCopy}
          disabled={!personName.trim() || !previewUrl}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
        >
          {t("linkCreator.createAndCopy")}
        </Button>
      </div>

      <div className="bg-white rounded-xl md:rounded-3xl p-3 md:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Clock3 className="w-4 h-4 md:w-5 md:h-5" />
            <h3 className="text-base md:text-xl font-semibold text-foreground">
              {t("linkCreator.savedLinks")} ({presets.length})
            </h3>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("linkCreator.searchPlaceholder")}
              className="pl-8"
            />
          </div>
        </div>

        {filteredPresets.length === 0 ? (
          <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
            <Link2 className="w-8 h-8 mx-auto mb-2 opacity-70" />
            <p className="font-semibold text-foreground">{t("linkCreator.emptyTitle")}</p>
            <p className="text-sm">{t("linkCreator.emptyDescription")}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("linkCreator.tableName")}</TableHead>
                  <TableHead>{t("linkCreator.tableFilter")}</TableHead>
                  <TableHead>{t("linkCreator.tableDate")}</TableHead>
                  <TableHead>{t("linkCreator.tableTime")}</TableHead>
                  <TableHead>{t("linkCreator.tableActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPresets.map((preset) => {
                  const created = new Date(preset.createdAt)
                  return (
                    <TableRow key={preset.id}>
                      <TableCell>{preset.name}</TableCell>
                      <TableCell className="text-xs">{preset.filter.jobType} / {preset.filter.location}</TableCell>
                      <TableCell>{created.toLocaleDateString()}</TableCell>
                      <TableCell>{created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => void copyToClipboard(preset.url)} aria-label={t("linkCreator.copy")}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => window.open(preset.url, "_blank", "noopener,noreferrer")}
                            aria-label={t("linkCreator.open")}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(preset.id)} aria-label={t("linkCreator.delete")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
