"use client"

import { useState, useEffect } from "react"
import { Bell, Mail, MessageSquare, Check, ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox as CheckboxUI } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import JobFilters from "@/components/job-filters"
import { useTranslation } from "@/hooks/use-translation"

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
  frequency: "daily" | "weekly" | "monthly"
  email: string
  whatsapp: string
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
    email: "",
    whatsapp: "",
    emailEnabled: false,
    whatsappEnabled: false,
    selectedDays: [],
    notificationTime: "09:00",
    filters: {
      jobTypes: [],
      timeframe: "all",
      locations: [],
      noQualificationRequired: false,
    },
  })

  // Verwende übergebene Filter oder gespeicherte Filter aus Settings
  const filters = propsFilters ?? settings.filters

  // Lade gespeicherte Einstellungen beim Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<NotificationSettings>
          // Stelle sicher, dass alle neuen Felder vorhanden sind (für alte gespeicherte Daten)
          setSettings({
            enabled: parsed.enabled ?? false,
            frequency: parsed.frequency ?? "weekly",
            email: parsed.email ?? "",
            whatsapp: parsed.whatsapp ?? "",
            emailEnabled: parsed.emailEnabled ?? false,
            whatsappEnabled: parsed.whatsappEnabled ?? false,
            selectedDays: parsed.selectedDays ?? [],
            notificationTime: parsed.notificationTime ?? "09:00",
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

  const handleFrequencyChange = (frequency: "daily" | "weekly" | "monthly") => {
    saveSettings({ ...settings, frequency })
  }

  const handleEmailToggle = (enabled: boolean) => {
    saveSettings({ ...settings, emailEnabled: enabled })
  }

  const handleWhatsAppToggle = (enabled: boolean) => {
    saveSettings({ ...settings, whatsappEnabled: enabled })
  }

  const handleEmailChange = (email: string) => {
    saveSettings({ ...settings, email })
  }

  const handleWhatsAppChange = (whatsapp: string) => {
    saveSettings({ ...settings, whatsapp })
  }

  const handleFiltersChange = (newFilters: { jobTypes: string[]; timeframe: string; locations: string[] }) => {
    saveSettings({ ...settings, filters: newFilters })
  }

  const handleDaysChange = (day: string) => {
    const newSelectedDays = settings.selectedDays.includes(day)
      ? settings.selectedDays.filter((d) => d !== day)
      : [...settings.selectedDays, day]
    saveSettings({ ...settings, selectedDays: newSelectedDays })
  }

  const handleTimeChange = (time: string) => {
    saveSettings({ ...settings, notificationTime: time })
  }

  const handleActivate = () => {
    // Validierung: Mindestens eine Versandart muss aktiviert sein
    if (!settings.emailEnabled && !settings.whatsappEnabled) {
      return
    }

    // Validierung: Mindestens ein Tag muss ausgewählt sein
    if (settings.selectedDays.length === 0) {
      return
    }

    // Validierung: E-Mail muss eingegeben sein, wenn E-Mail aktiviert ist
    if (settings.emailEnabled && !settings.email.trim()) {
      return
    }

    // Validierung: WhatsApp muss eingegeben sein, wenn WhatsApp aktiviert ist
    if (settings.whatsappEnabled && !settings.whatsapp.trim()) {
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
    if (settings.selectedDays.length === 0) {
      return
    }
    if (settings.emailEnabled && !settings.email.trim()) {
      return
    }
    if (settings.whatsappEnabled && !settings.whatsapp.trim()) {
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
      <Collapsible defaultOpen={false} className="mb-3">
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

      {/* Frequenz-Auswahl */}
      <div className="mb-3">
        <Label className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
          {t("notifications.frequency")}
        </Label>
        <div className="flex gap-2 md:gap-2.5">
          <button
            onClick={() => handleFrequencyChange("daily")}
            className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
              settings.frequency === "daily"
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {t("notifications.daily")}
          </button>
          <button
            onClick={() => handleFrequencyChange("weekly")}
            className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
              settings.frequency === "weekly"
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {t("notifications.weekly")}
          </button>
          <button
            onClick={() => handleFrequencyChange("monthly")}
            className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all ${
              settings.frequency === "monthly"
                ? "bg-primary text-white shadow-md"
                : "bg-gray-100 text-foreground hover:bg-gray-200"
            }`}
          >
            {t("notifications.monthly")}
          </button>
        </div>
      </div>

      {/* Tage-Auswahl */}
      <div className="mb-3">
        <Label className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
          {t("notifications.selectDays")}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2">
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

      {/* Uhrzeit-Auswahl */}
      <div className="mb-3">
        <Label htmlFor="notification-time" className="text-xs md:text-sm font-semibold text-foreground mb-1.5 md:mb-2 block">
          {t("notifications.selectTime")}
        </Label>
        <Input
          id="notification-time"
          type="time"
          value={settings.notificationTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-full text-xs md:text-sm"
        />
      </div>
    </>
  )

  return (
    <div className="bg-card rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl mb-4 md:mb-6 border-2 border-border">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <Bell className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <h3 className="text-lg md:text-xl font-bold text-foreground">{t("notifications.title")}</h3>
      </div>

      <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-5">{t("notifications.description")}</p>

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
                  <Input
                    type="email"
                    placeholder={t("notifications.emailPlaceholder")}
                    value={settings.email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="mt-1.5 md:mt-2 text-xs md:text-sm"
                  />
                )}

                <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                  <div className="flex items-center gap-2 md:gap-3">
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    <span className="text-xs md:text-sm font-medium">{t("notifications.whatsapp")}</span>
                  </div>
                  <Switch checked={settings.whatsappEnabled} onCheckedChange={handleWhatsAppToggle} />
                </div>
                {settings.whatsappEnabled && (
                  <Input
                    type="tel"
                    placeholder={t("notifications.whatsappPlaceholder")}
                    value={settings.whatsapp}
                    onChange={(e) => handleWhatsAppChange(e.target.value)}
                    className="mt-1.5 md:mt-2 text-xs md:text-sm"
                  />
                )}
              </div>
            </div>

            {/* Update Button wenn Filter sich geändert haben */}
            {(filtersChanged || settings.selectedDays.length === 0) && (
              <div className="pt-1.5 md:pt-2">
                <Button
                  onClick={handleUpdate}
                  disabled={settings.selectedDays.length === 0}
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
                <Input
                  type="email"
                  placeholder={t("notifications.emailPlaceholder")}
                  value={settings.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className="mt-1.5 md:mt-2 text-xs md:text-sm"
                />
              )}

              <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg md:rounded-xl border border-border">
                <div className="flex items-center gap-2 md:gap-3">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <span className="text-xs md:text-sm font-medium">{t("notifications.whatsapp")}</span>
                </div>
                <Switch checked={settings.whatsappEnabled} onCheckedChange={handleWhatsAppToggle} />
              </div>
              {settings.whatsappEnabled && (
                <Input
                  type="tel"
                  placeholder={t("notifications.whatsappPlaceholder")}
                  value={settings.whatsapp}
                  onChange={(e) => handleWhatsAppChange(e.target.value)}
                  className="mt-1.5 md:mt-2 text-xs md:text-sm"
                />
              )}
            </div>
          </div>

          {/* Aktivieren Button */}
          <Button
            onClick={handleActivate}
            disabled={(!settings.emailEnabled && !settings.whatsappEnabled) || settings.selectedDays.length === 0}
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


