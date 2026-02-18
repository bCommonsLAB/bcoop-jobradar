"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LanguageSelector } from "./language-selector"

export type Language = "de" | "it" | "en" | "ar" | "hi" | "ur" | "tr" | "ro" | "pl" | "ru" | "zh" | "es" | "fr" | "pt" | "sq" | "mk" | "sr" | "hr" | "bs" | "bg" | "uk" | "bn"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  resetLanguage: () => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("job-radar-language") as Language | null

        if (savedLanguage) {
          setLanguageState(savedLanguage)
        }
      } catch (error) {
        console.error("Error reading from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Prüfe nach dem Laden, ob Benutzer mit gespeicherter Sprache die WelcomePage noch nicht gesehen hat
  useEffect(() => {
    if (!isLoading && language && typeof window !== "undefined") {
      try {
        const hasSeenWelcome = localStorage.getItem("job-radar-has-seen-welcome")
        if (!hasSeenWelcome) {
          // Weiterleitung zur WelcomePage, wenn Sprache bereits gespeichert ist, aber WelcomePage noch nicht gesehen
          router.push("/")
          localStorage.setItem("job-radar-has-seen-welcome", "true")
        }
      } catch (error) {
        console.error("Error checking welcome flag:", error)
      }
    }
  }, [isLoading, language, router])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("job-radar-language", newLanguage)
        
        // Prüfe, ob der Benutzer bereits die WelcomePage gesehen hat
        const hasSeenWelcome = localStorage.getItem("job-radar-has-seen-welcome")
        if (!hasSeenWelcome) {
          // Weiterleitung zur WelcomePage beim ersten Besuch
          router.push("/")
          localStorage.setItem("job-radar-has-seen-welcome", "true")
        }
      } catch (error) {
        console.error("Error writing to localStorage:", error)
      }
    }
  }

  const resetLanguage = () => {
    setLanguageState(null)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("job-radar-language")
      } catch (error) {
        console.error("Error removing from localStorage:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!language) {
    return <LanguageSelector onLanguageSelect={setLanguage} isInitialSelection={true} />
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, resetLanguage }}>{children}</LanguageContext.Provider>
  )
}
