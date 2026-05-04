"use client"

export type LinkCreatorFilter = {
  jobType: string
  location: string
}

export type LinkPreset = {
  id: string
  createdAt: string
  name: string
  filter: LinkCreatorFilter
  url: string
}

const LINK_PRESETS_KEY = "job-radar-link-presets"

export function loadLinkPresets(): LinkPreset[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(LINK_PRESETS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error("Error loading link presets:", error)
    return []
  }
}

function saveAllLinkPresets(presets: LinkPreset[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(LINK_PRESETS_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error("Error saving link presets:", error)
  }
}

export function saveLinkPreset(preset: LinkPreset): LinkPreset[] {
  const current = loadLinkPresets()
  const next = [preset, ...current]
  saveAllLinkPresets(next)
  return next
}

export function deleteLinkPreset(id: string): LinkPreset[] {
  const current = loadLinkPresets()
  const next = current.filter((item) => item.id !== id)
  saveAllLinkPresets(next)
  return next
}

export function buildJobsLink(filter: LinkCreatorFilter, origin: string): string {
  const url = new URL("/jobs", origin)
  url.searchParams.set("jobType", filter.jobType)
  url.searchParams.set("location", filter.location)
  return url.toString()
}
