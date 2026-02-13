"use client"

import { useState, useEffect, useRef } from "react"
import { Mail, MessageSquare, Check, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox as CheckboxUI } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import JobFilters from "@/components/job-filters"
import { useTranslation } from "@/hooks/use-translation"

/** Zeiten im 30-Minuten-Takt von 00:00 bis 23:30 (48 Einträge), Format "HH:mm" (Outlook-ähnlich). */
function getTimeOptions(): string[] {
  const options: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    }
  }
  return options
}

const TIME_OPTIONS = getTimeOptions()

/** Normiert einen String nach Möglichkeit auf HH:mm (z. B. "9:00" → "09:00"). */
function normalizeTimeInput(value: string): string {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return trimmed
  const h = Math.min(23, Math.max(0, parseInt(match[1], 10)))
  const m = Math.min(59, Math.max(0, parseInt(match[2], 10)))
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

interface TimePickerWithDropdownProps {
  id: string
  value: string
  onChange: (time: string) => void
}

function TimePickerWithDropdown({ id, value, onChange }: TimePickerWithDropdownProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const inputContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    if (open) {
      inputContainerRef.current?.querySelector<HTMLInputElement>("input")?.focus()
    }
  }, [open])

  const handleInputChange = (v: string) => {
    setInputValue(v)
    const normalized = normalizeTimeInput(v)
    if (normalized.length === 5 && /^\d{2}:\d{2}$/.test(normalized)) {
      onChange(normalized)
      setOpen(false)
    }
  }

  const handleBlur = () => {
    const normalized = normalizeTimeInput(inputValue)
    if (normalized !== inputValue) {
      setInputValue(normalized)
      onChange(normalized)
    }
  }

  const handleSelectTime = (time: string) => {
    setInputValue(time)
    onChange(time)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="flex w-full rounded-md border border-input shadow-xs">
          <div ref={inputContainerRef} className="flex-1 min-w-0">
            <Input
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={handleBlur}
            placeholder="06:00"
            className="flex-1 rounded-r-none border-0 border-r-0 bg-transparent shadow-none focus-visible:ring-0 text-xs md:text-sm"
            autoComplete="off"
          />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-l-none border-l border-l-input"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Zeitliste öffnen"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </PopoverAnchor>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden" align="start">
        <ScrollArea className="h-[220px]">
          <div className="p-1">
            {TIME_OPTIONS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleSelectTime(time)}
                className={`w-full text-left px-2 py-1.5 rounded text-xs md:text-sm ${
                  value === time
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

interface JobNotificationsProps {
  filters?: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
    noQualificationRequired?: boolean
  }
}

interface NotificationSettings {
  enabled: boolean
  frequency: "daily" | "weekly"
  emails: string[]
  whatsappNumbers: string[]
  emailEnabled: boolean
  whatsappEnabled: boolean
  selectedDays: string[]
  notificationTime: string
  filters: {
    jobTypes: string[]
    timeframe: string
    locations: string[]
    noQualificationRequired: boolean
  }
}

const STORAGE_KEY = "job-radar-notifications"

export default function JobNotifications({ filters: propsFilters }: JobNotificationsProps) {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    frequency: "weekly",
    emails: [""],
    whatsappNumbers: [""],
    emailEnabled: false,
    whatsappEnabled: false,
    selectedDays: [],
    notificationTime: "06:00",
    filters: {
      jobTypes: [],
      timeframe: "all",
      locations: [],
      noQualificationRequired: false,
    },
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Verwende übergebene Filter oder gespeicherte Filter aus Settings
  // WICHTIG: `noQualificationRequired` ist in `NotificationSettings["filters"]` verpflichtend.
  // Props dürfen es optional liefern, daher normalisieren wir hier auf ein sicheres Shape.
  const filters: NotificationSettings["filters"] = {
    jobTypes: propsFilters?.jobTypes ?? settings.filters.jobTypes,
    timeframe: propsFilters?.timeframe ?? settings.filters.timeframe,
    locations: propsFilters?.locations ?? settings.filters.locations,
    noQualificationRequired: propsFilters?.noQualificationRequired ?? settings.filters.noQualificationRequired,
  }

  // Lade gespeicherte Einstellungen beim Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<NotificationSettings>
          // Stelle sicher, dass alle neuen Felder vorhanden sind (für alte gespeicherte Daten)
          // Migration: frequency immer auf "weekly" setzen (daily wurde entfernt)
          const migratedFrequency = "weekly"
          // Migration: Alte einzelne email/whatsapp zu Arrays
          const migratedEmails = Array.isArray((parsed as { emails?: string[] }).emails)
            ? (parsed as { emails: string[] }).emails
            : (parsed as { email?: string }).email
              ? [(parsed as { email: string }).email]
              : [""]
          const migratedWhatsApp = Array.isArray((parsed as { whatsappNumbers?: string[] }).whatsappNumbers)
            ? (parsed as { whatsappNumbers: string[] }).whatsappNumbers
            : (parsed as { whatsapp?: string }).whatsapp
              ? [(parsed as { whatsapp: string }).whatsapp]
              : [""]
          
          setSettings({
            enabled: parsed.enabled ?? false,
            frequency: migratedFrequency as "daily" | "weekly",
            emails: migratedEmails.length > 0 ? migratedEmails : [""],
            whatsappNumbers: migratedWhatsApp.length > 0 ? migratedWhatsApp : [""],
            emailEnabled: parsed.emailEnabled ?? false,
            whatsappEnabled: parsed.whatsappEnabled ?? false,
            selectedDays: parsed.selectedDays ?? [],
            notificationTime: parsed.notificationTime ?? "06:00",
              filters: parsed.filters
                ? {
                    ...parsed.filters,
                    noQualificationRequired: parsed.filters.noQualificationRequired ?? false,
                  }
                : {
                    jobTypes: [],
                    timeframe: "all",
                    locations: [],
                    noQualificationRequired: false,
                  },
          })
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
      }
    }
  }, [])

  // Speichere Einstellungen in localStorage
  const saveSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings))
      } catch (error) {
        console.error("Error saving notification settings:", error)
      }
    }
  }


  const handleEmailToggle = (enabled: boolean) => {
    saveSettings({ ...settings, emailEnabled: enabled })
  }

  const handleWhatsAppToggle = (enabled: boolean) => {
    saveSettings({ ...settings, whatsappEnabled: enabled })
  }

  // Ein Textblock: Zeilen (oder Komma) in E-Mail-Liste parsen
  const parseLines = (text: string): string[] => {
    const lines = text.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean)
    return lines.length > 0 ? lines : [""]
  }

  const handleEmailsTextChange = (text: string) => {
    saveSettings({ ...settings, emails: parseLines(text) })
  }

  const handleWhatsAppTextChange = (text: string) => {
    saveSettings({ ...settings, whatsappNumbers: parseLines(text) })
  }

  const handleFiltersChange = (newFilters: NotificationSettings["filters"]) => {
    saveSettings({ ...settings, filters: newFilters })
  }

  const handleFiltersOpenChange = (open: boolean) => {
    setIsFiltersOpen(open)
    if (open) {
      // Filter auf Standardwerte zurücksetzen beim Öffnen
      const defaultFilters: NotificationSettings["filters"] = {
        jobTypes: ["all"],
        timeframe: "all",
        locations: ["all"],
        noQualificationRequired: false,
      }
      saveSettings({ ...settings, filters: defaultFilters })
    }
  }

  const handleDaysChange = (day: string) => {
    const newSelectedDays = settings.selectedDays.includes(day)
      ? settings.selectedDays.filter((d) => d !== day)
      : [...settings.selectedDays, day]
    saveSettings({ ...settings, selectedDays: newSelectedDays })
  }

  const handleSelectAllDays = () => {
    const allDayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const allSelected = settings.selectedDays.length === 7
    saveSettings({
      ...settings,
      selectedDays: allSelected ? [] : allDayKeys,
    })
  }

  const handleTimeChange = (time: string) => {
    saveSettings({ ...settings, notificationTime: time })
  }

  const handleActivate = () => {
    // Validierung: Mindestens eine Versandart muss aktiviert sein
    if (!settings.emailEnabled && !settings.whatsappEnabled) {
      return
    }

    // Validierung: Mindestens ein Wochentag + Uhrzeit müssen gesetzt sein
    if (settings.selectedDays.length === 0 || !settings.notificationTime) {
      return
    }

    // Validierung: Mindestens eine gültige E-Mail, wenn E-Mail aktiviert ist
    if (settings.emailEnabled && !settings.emails.some((e) => e.trim())) {
      return
    }

    // Validierung: Mindestens eine gültige WhatsApp-Nummer, wenn WhatsApp aktiviert ist
    if (settings.whatsappEnabled && !settings.whatsappNumbers.some((w) => w.trim())) {
      return
    }

    const newSettings: NotificationSettings = {
      ...settings,
      enabled: true,
      filters: { ...filters },
    }
    saveSettings(newSettings)
  }

  const handleDeactivate = () => {
    const newSettings: NotificationSettings = {
      ...settings,
      enabled: false,
    }
    saveSettings(newSettings)
  }

  const handleUpdate = () => {
    // Gleiche Validierung wie bei Aktivierung
    if (!settings.emailEnabled && !settings.whatsappEnabled) {
      return
    }

    // Validierung: Mindestens ein Wochentag + Uhrzeit müssen gesetzt sein
    if (settings.selectedDays.length === 0 || !settings.notificationTime) {
      return
    }

    if (settings.emailEnabled && !settings.emails.some((e) => e.trim())) {
      return
    }
    if (settings.whatsappEnabled && !settings.whatsappNumbers.some((w) => w.trim())) {
      return
    }

    const newSettings: NotificationSettings = {
      ...settings,
      filters: { ...filters },
    }
    saveSettings(newSettings)
  }

  // Prüfe, ob Filter sich geändert haben (Array-Vergleich)
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false
    const sortedA = [...a].sort()
    const sortedB = [...b].sort()
    return sortedA.every((val, index) => val === sortedB[index])
  }

  const filtersChanged = propsFilters
    ? (!arraysEqual(settings.filters.jobTypes || [], filters.jobTypes || []) ||
       settings.filters.timeframe !== filters.timeframe ||
       !arraysEqual(settings.filters.locations || [], filters.locations || []) ||
       settings.filters.noQualificationRequired !== (filters.noQualificationRequired ?? false))
    : false

  const daysOfWeek = [
    { key: "monday", label: t("notifications.monday") },
    { key: "tuesday", label: t("notifications.tuesday") },
    { key: "wednesday", label: t("notifications.wednesday") },
    { key: "thursday", label: t("notifications.thursday") },
    { key: "friday", label: t("notifications.friday") },
    { key: "saturday", label: t("notifications.saturday") },
    { key: "sunday", label: t("notifications.sunday") },
  ]

  const renderCommonSections = () => (
    <>
      {/* Filter-Bereich (Collapsible) */}
      <Collapsible open={isFiltersOpen} onOpenChange={handleFiltersOpenChange} className="mb-3">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border hover:bg-gray-50 transition-all">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            <span className="text-xs md:text-sm font-semibold text-foreground">{t("notifications.selectFilters")}</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 data-[state=open]:animate-in data-[state=closed]:animate-out">
          <div className="p-3 md:p-4 border border-border rounded-lg md:rounded-xl bg-gray-50/50">
            <JobFilters
              onSubmit={handleFiltersChange}
              initialFilters={settings.filters}
              autoApply={true}
              showSubmitButton={false}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Wochentagsauswahl */}
      <div className="mb-3">
        <Label className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
          {t("notifications.selectWeekday")}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2">
          <div className="flex items-center space-x-1.5 md:space-x-2 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border hover:bg-gray-50">
            <CheckboxUI
              id="day-all"
              checked={settings.selectedDays.length === 7}
              onCheckedChange={handleSelectAllDays}
            />
            <Label
              htmlFor="day-all"
              className="text-xs md:text-sm font-medium cursor-pointer flex-1"
            >
              {t("notifications.allDays")}
            </Label>
          </div>
          {daysOfWeek.map((day) => (
            <div key={day.key} className="flex items-center space-x-1.5 md:space-x-2 p-1.5 md:p-2 rounded-md md:rounded-lg border border-border hover:bg-gray-50">
              <CheckboxUI
                id={`day-${day.key}`}
                checked={settings.selectedDays.includes(day.key)}
                onCheckedChange={() => handleDaysChange(day.key)}
              />
              <Label
                htmlFor={`day-${day.key}`}
                className="text-xs md:text-sm font-medium cursor-pointer flex-1"
              >
                {day.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <Label htmlFor="notification-time" className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
          {t("notifications.selectTime")}
        </Label>
        <TimePickerWithDropdown
          id="notification-time"
          value={settings.notificationTime}
          onChange={handleTimeChange}
        />
      </div>

    </>
  )

  return (
    <div className="backdrop-blur-md bg-white/80 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl mb-4 md:mb-6 border-2 border-border/50">
      {settings.enabled ? (
        // Anzeige aktiver Einstellungen
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-primary font-semibold">
            <Check className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{t("notifications.active")}</span>
          </div>

          <div className="space-y-2.5 md:space-y-3">
            {renderCommonSections()}

            {/* Versandart */}
            <div>
              <Label className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
                {t("notifications.deliveryMethod")}
              </Label>
              <div className="space-y-2.5 md:space-y-3">
                <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium">{t("notifications.email")}</span>
                  </div>
                  <Switch checked={settings.emailEnabled} onCheckedChange={handleEmailToggle} />
                </div>
                {settings.emailEnabled && (
                  <div className="mt-1.5 md:mt-2">
                    <Textarea
                      placeholder={t("notifications.emailsPlaceholder") || "Eine E-Mail-Adresse pro Zeile (oder durch Komma getrennt)"}
                      value={settings.emails.filter(Boolean).join("\n")}
                      onChange={(e) => handleEmailsTextChange(e.target.value)}
                      className="min-h-[80px] text-xs md:text-sm resize-y"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                  <div className="flex items-center gap-2 md:gap-3">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium">{t("notifications.whatsapp")}</span>
                  </div>
                  <Switch checked={settings.whatsappEnabled} onCheckedChange={handleWhatsAppToggle} />
                </div>
                {settings.whatsappEnabled && (
                  <div className="mt-1.5 md:mt-2">
                    <Textarea
                      placeholder={t("notifications.whatsappNumbersPlaceholder") || "Eine Nummer pro Zeile (oder durch Komma getrennt)"}
                      value={settings.whatsappNumbers.filter(Boolean).join("\n")}
                      onChange={(e) => handleWhatsAppTextChange(e.target.value)}
                      className="min-h-[80px] text-xs md:text-sm resize-y"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Update Button wenn Filter sich geändert haben oder Validierung fehlschlägt */}
            {(filtersChanged || 
              settings.selectedDays.length === 0 ||
              !settings.notificationTime) && (
              <div className="pt-1.5 md:pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={
                    settings.selectedDays.length === 0 ||
                    !settings.notificationTime
                  }
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm py-2"
                >
                  {t("notifications.update")}
                </Button>
              </div>
            )}

            {/* Deaktivieren Button */}
            <div className="pt-1.5 md:pt-2 border-t border-border">
              <Button
                onClick={handleDeactivate}
                variant="outline"
                size="sm"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 text-xs md:text-sm py-2"
              >
                {t("notifications.deactivate")}
              </Button>
            </div>
          </div>

          {/* Datenschutz-Hinweis */}
          <p className="text-xs text-muted-foreground mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
            {t("notifications.privacy")}
          </p>
        </div>
      ) : (
        // Formular zum Aktivieren
        <div className="space-y-3 md:space-y-4">
          {renderCommonSections()}

          {/* Versandart */}
          <div>
            <Label className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
              {t("notifications.deliveryMethod")}
            </Label>
            <div className="space-y-2.5 md:space-y-3">
              <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                <div className="flex items-center gap-2 md:gap-3">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-xs md:text-sm font-medium">{t("notifications.email")}</span>
                </div>
                <Switch checked={settings.emailEnabled} onCheckedChange={handleEmailToggle} />
              </div>
              {settings.emailEnabled && (
                <div className="mt-1.5 md:mt-2">
                  <Textarea
                    placeholder={t("notifications.emailsPlaceholder") || "Eine E-Mail-Adresse pro Zeile (oder durch Komma getrennt)"}
                    value={settings.emails.filter(Boolean).join("\n")}
                    onChange={(e) => handleEmailsTextChange(e.target.value)}
                    className="min-h-[80px] text-xs md:text-sm resize-y"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                <div className="flex items-center gap-2 md:gap-3">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-xs md:text-sm font-medium">{t("notifications.whatsapp")}</span>
                </div>
                <Switch checked={settings.whatsappEnabled} onCheckedChange={handleWhatsAppToggle} />
              </div>
              {settings.whatsappEnabled && (
                <div className="mt-1.5 md:mt-2">
                  <Textarea
                    placeholder={t("notifications.whatsappNumbersPlaceholder") || "Eine Nummer pro Zeile (oder durch Komma getrennt)"}
                    value={settings.whatsappNumbers.filter(Boolean).join("\n")}
                    onChange={(e) => handleWhatsAppTextChange(e.target.value)}
                    className="min-h-[80px] text-xs md:text-sm resize-y"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Aktivieren Button */}
          <Button
            onClick={handleActivate}
            disabled={
              (!settings.emailEnabled && !settings.whatsappEnabled) ||
              (settings.emailEnabled && !settings.emails.some((e) => e.trim())) ||
              (settings.whatsappEnabled && !settings.whatsappNumbers.some((w) => w.trim())) ||
              settings.selectedDays.length === 0 ||
              !settings.notificationTime
            }
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm py-2"
          >
            {t("notifications.activate")}
          </Button>

          {/* Datenschutz-Hinweis */}
          <p className="text-xs text-muted-foreground mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
            {t("notifications.privacy")}
          </p>
        </div>
      )}
    </div>
  )
}


