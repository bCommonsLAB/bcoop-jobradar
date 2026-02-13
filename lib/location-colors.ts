/**
 * Zentrale Farb-/Stilzuordnung für Regionen (Luogo).
 *
 * Warum als statisches Mapping?
 * - Tailwind (JIT) erkennt Klassen zuverlässig nur, wenn sie als statische Strings im Code vorkommen.
 * - So vermeiden wir "missing styles" im Build durch dynamische Klassenkonstruktion.
 *
 * Ziel:
 * - Jede Region hat einen eigenen Farbton (Button + Badge).
 * - Unbekannte Regionen fallen sauber auf Primary zurück.
 */

export type LocationKey = "all" | "bolzano" | "merano" | "bressanone" | "brunico" | "vipiteno" | "val-pusteria" | "val-venosta"

export type LocationTone = {
  /** Klassen für den Regions-Button im ausgewählten Zustand */
  buttonSelected: string
  /** Klassen für den Regions-Button im nicht-ausgewählten Zustand */
  buttonUnselected: string
  /** Icon-Farbe im nicht-ausgewählten Zustand */
  iconUnselected: string
  /** Badge-Klassen für aktive Filter (Region-Chips) */
  badge: string
}

const DEFAULT_TONE: LocationTone = {
  // "Primary/Cyan" ist der existierende Look → sichere Fallback-Farbe.
  buttonSelected:
    "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-md scale-[1.02] ring-1 ring-primary/30",
  buttonUnselected:
    "bg-gradient-to-br from-white to-gray-50 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-primary/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
  iconUnselected: "text-primary",
  badge:
    "bg-gradient-to-r from-primary/10 to-cyan-50 text-primary border-2 border-primary/20 hover:shadow-lg hover:scale-105",
}

const LOCATION_TONES: Record<LocationKey, LocationTone> = {
  all: DEFAULT_TONE,
  bolzano: {
    // Kräftiges Blau (Indigo/Slate) - repräsentiert Urbanität
    buttonSelected:
      "bg-gradient-to-br from-indigo-500 to-slate-600 text-white border-indigo-500 shadow-md scale-[1.02] ring-1 ring-indigo-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-indigo-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-indigo-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-indigo-600",
    badge:
      "bg-gradient-to-r from-indigo-50 to-slate-50 text-indigo-800 border-2 border-indigo-200 hover:shadow-lg hover:scale-105",
  },
  merano: {
    // Warmes Orange/Terrakotta - repräsentiert Wärme und Wellness
    buttonSelected:
      "bg-gradient-to-br from-orange-500 to-amber-600 text-white border-orange-500 shadow-md scale-[1.02] ring-1 ring-orange-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-orange-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-orange-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-orange-600",
    badge:
      "bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border-2 border-orange-200 hover:shadow-lg hover:scale-105",
  },
  bressanone: {
    // Kühles Türkis/Cyan - repräsentiert Frische
    buttonSelected:
      "bg-gradient-to-br from-cyan-500 to-teal-600 text-white border-cyan-500 shadow-md scale-[1.02] ring-1 ring-cyan-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-cyan-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-cyan-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-cyan-600",
    badge:
      "bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-800 border-2 border-cyan-200 hover:shadow-lg hover:scale-105",
  },
  brunico: {
    // Warmes Gold/Amber - repräsentiert Sonne und Berge
    buttonSelected:
      "bg-gradient-to-br from-yellow-500 to-amber-600 text-white border-yellow-500 shadow-md scale-[1.02] ring-1 ring-yellow-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-yellow-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-yellow-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-yellow-600",
    badge:
      "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border-2 border-yellow-200 hover:shadow-lg hover:scale-105",
  },
  vipiteno: {
    // Kühles Lila/Violet - repräsentiert Eleganz
    buttonSelected:
      "bg-gradient-to-br from-purple-500 to-violet-600 text-white border-purple-500 shadow-md scale-[1.02] ring-1 ring-purple-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-purple-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-purple-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-purple-600",
    badge:
      "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-800 border-2 border-purple-200 hover:shadow-lg hover:scale-105",
  },
  "val-pusteria": {
    // Warmes Rot/Rose - repräsentiert Energie
    buttonSelected:
      "bg-gradient-to-br from-red-500 to-rose-600 text-white border-red-500 shadow-md scale-[1.02] ring-1 ring-red-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-red-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-red-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-red-600",
    badge:
      "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-2 border-red-200 hover:shadow-lg hover:scale-105",
  },
  "val-venosta": {
    // Kühles Grün/Emerald - repräsentiert Natur
    buttonSelected:
      "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-500 shadow-md scale-[1.02] ring-1 ring-green-500/30",
    buttonUnselected:
      "bg-gradient-to-br from-white to-green-50/30 dark:from-[#2c2c2c] dark:to-[#2c2c2c] text-foreground border-border/50 dark:border-[#3c3c3c] hover:border-green-500/50 dark:hover:bg-[#2c2c2c] hover:shadow-sm hover:scale-[1.02] active:scale-95",
    iconUnselected: "text-green-600",
    badge:
      "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-2 border-green-200 hover:shadow-lg hover:scale-105",
  },
}

function isLocationKey(value: string): value is LocationKey {
  return value in LOCATION_TONES
}

/**
 * Liefert den Farbton (Klassen) für eine Region.
 * - Für bekannte Regionen gibt es eine spezifische Farbpalette.
 * - Für unbekannte Regionen liefern wir den Default-Ton.
 */
export function getLocationTone(location: string): LocationTone {
  if (isLocationKey(location)) return LOCATION_TONES[location]
  return DEFAULT_TONE
}

