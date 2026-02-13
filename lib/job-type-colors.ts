/**
 * Zentrale Farb-/Stilzuordnung für Arbeitsbereiche (Job-Typen).
 *
 * Warum als statisches Mapping?
 * - Tailwind (JIT) erkennt Klassen zuverlässig nur, wenn sie als statische Strings im Code vorkommen.
 * - So vermeiden wir "missing styles" im Build durch dynamische Klassenkonstruktion.
 *
 * Ziel:
 * - Jeder Arbeitsbereich hat einen eigenen Farbton (Button + Badge).
 * - Unbekannte/Custom-Typen (z.B. `custom-*`) fallen sauber auf Primary zurück.
 */

export type JobTypeKey = "all" | "kitchen" | "dishwasher" | "housekeeping" | "helper" | "service"

export type JobTypeTone = {
  /** Klassen für den Arbeitsbereich-Button im ausgewählten Zustand */
  buttonSelected: string
  /** Klassen für den Arbeitsbereich-Button im nicht-ausgewählten Zustand */
  buttonUnselected: string
  /** Icon-Farbe im nicht-ausgewählten Zustand */
  iconUnselected: string
  /** Badge-Klassen für aktive Filter (Job-Typ-Chips) */
  badge: string
}

const DEFAULT_TONE: JobTypeTone = {
  // "Primary/Cyan" ist der existierende Look → sichere Fallback-Farbe.
  buttonSelected:
    "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-md scale-[1.02] ring-1 ring-primary/30",
  buttonUnselected:
    "bg-gradient-to-br from-white to-gray-50 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-primary/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
  iconUnselected: "text-primary",
  badge:
    "bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 hover:shadow-lg hover:scale-105",
}

const JOB_TYPE_TONES: Record<JobTypeKey, JobTypeTone> = {
  all: DEFAULT_TONE,
  kitchen: {
    buttonSelected:
      "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-500 shadow-md scale-[1.02] ring-1 ring-amber-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-amber-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-amber-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-amber-600",
    badge:
      "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border-2 border-amber-200 hover:shadow-lg hover:scale-105",
  },
  dishwasher: {
    buttonSelected:
      "bg-gradient-to-br from-sky-500 to-blue-600 text-white border-sky-500 shadow-md scale-[1.02] ring-1 ring-sky-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-sky-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-sky-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-sky-600",
    badge:
      "bg-gradient-to-r from-sky-50 to-blue-50 text-sky-800 border-2 border-sky-200 hover:shadow-lg hover:scale-105",
  },
  housekeeping: {
    buttonSelected:
      "bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white border-violet-500 shadow-md scale-[1.02] ring-1 ring-violet-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-violet-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-violet-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-violet-600",
    badge:
      "bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-800 border-2 border-violet-200 hover:shadow-lg hover:scale-105",
  },
  helper: {
    buttonSelected:
      "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-500 shadow-md scale-[1.02] ring-1 ring-emerald-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-emerald-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-emerald-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-emerald-600",
    badge:
      "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-2 border-emerald-200 hover:shadow-lg hover:scale-105",
  },
  service: {
    buttonSelected:
      "bg-gradient-to-br from-rose-500 to-pink-600 text-white border-rose-500 shadow-md scale-[1.02] ring-1 ring-rose-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-rose-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-rose-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-rose-600",
    badge:
      "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-800 border-2 border-rose-200 hover:shadow-lg hover:scale-105",
  },
}

function isJobTypeKey(value: string): value is JobTypeKey {
  return value in JOB_TYPE_TONES
}

/**
 * Liefert den Farbton (Klassen) für einen Job-Typ.
 * - Für bekannte Typen gibt es eine spezifische Farbpalette.
 * - Für unbekannte Typen (inkl. `custom-*`) liefern wir den Default-Ton.
 */
export function getJobTypeTone(jobType: string): JobTypeTone {
  if (isJobTypeKey(jobType)) return JOB_TYPE_TONES[jobType]
  return DEFAULT_TONE
}

