"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { LanguageSelector } from "./language-selector"

type Language = "de" | "it" | "en" | "ar" | "hi" | "ur" | "tr" | "ro" | "pl" | "ru" | "zh" | "es" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  resetLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

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

  useEffect(() => {
    const savedLanguage = localStorage.getItem("job-radar-language") as Language | null

    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
    setIsLoading(false)
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("job-radar-language", newLanguage)
  }

  const resetLanguage = () => {
    setLanguageState(null)
    localStorage.removeItem("job-radar-language")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  if (!language) {
    return <LanguageSelector onLanguageSelect={setLanguage} />
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, resetLanguage }}>{children}</LanguageContext.Provider>
  )
}
