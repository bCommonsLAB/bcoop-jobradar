"use client"

import { useState, useEffect, useContext } from "react"
import { Badge } from "@/components/ui/badge"
import { Languages, X, Search } from "lucide-react"
import { LanguageContext } from "./language-provider"

type Language =
  | "de"
  | "it"
  | "en"
  | "ar"
  | "hi"
  | "ur"
  | "tr"
  | "ro"
  | "pl"
  | "ru"
  | "zh"
  | "es"
  | "fr"
  | "pt"
  | "sq"
  | "mk"
  | "sr"
  | "hr"
  | "bs"
  | "bg"
  | "uk"
  | "bn"

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void
  isOpen?: boolean
  onClose?: () => void
  isInitialSelection?: boolean
}

export function LanguageSelector({ onLanguageSelect, isOpen, onClose, isInitialSelection = true }: LanguageSelectorProps) {
  // Lese die aktuelle Sprache aus dem LanguageProvider (optional, da bei initialer Auswahl nicht verfügbar)
  const languageContext = useContext(LanguageContext)
  const currentLanguage = languageContext?.language || null

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(currentLanguage)
  const [showMoreLanguagesModal, setShowMoreLanguagesModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Synchronisiere selectedLanguage mit der aktuellen Sprache aus dem LanguageProvider
  useEffect(() => {
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage)
    }
  }, [currentLanguage])

  const languages = [
    { code: "it" as Language, name: "Italiano", flag: "🇮🇹" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "en" as Language, name: "English", flag: "🇬🇧" },
  ]

  const moreLanguages = [
    // Balkan (größte Migrantengruppen)
    { code: "sq" as Language, name: "Shqip", de: "Albanisch", it: "Albanese", en: "Albanian", flag: "🇦🇱" },
    { code: "sr" as Language, name: "Српски", de: "Serbisch", it: "Serbo", en: "Serbian", flag: "🇷🇸" },
    { code: "hr" as Language, name: "Hrvatski", de: "Kroatisch", it: "Croato", en: "Croatian", flag: "🇭🇷" },
    { code: "bs" as Language, name: "Bosanski", de: "Bosnisch", it: "Bosniaco", en: "Bosnian", flag: "🇧🇦" },
    { code: "mk" as Language, name: "Македонски", de: "Mazedonisch", it: "Macedone", en: "Macedonian", flag: "🇲🇰" },

    // Osteuropa
    { code: "ro" as Language, name: "Română", de: "Rumänisch", it: "Rumeno", en: "Romanian", flag: "🇷🇴" },
    { code: "pl" as Language, name: "Polski", de: "Polnisch", it: "Polacco", en: "Polish", flag: "🇵🇱" },
    { code: "uk" as Language, name: "Українська", de: "Ukrainisch", it: "Ucraino", en: "Ukrainian", flag: "🇺🇦" },
    { code: "ru" as Language, name: "Русский", de: "Russisch", it: "Russo", en: "Russian", flag: "🇷🇺" },
    { code: "bg" as Language, name: "Български", de: "Bulgarisch", it: "Bulgaro", en: "Bulgarian", flag: "🇧🇬" },

    // Südasien (Pakistan, Indien, Bangladesh)
    { code: "ur" as Language, name: "اردو", de: "Urdu", it: "Urdu", en: "Urdu", flag: "🇵🇰" },
    { code: "hi" as Language, name: "हिन्दी", de: "Hindi", it: "Hindi", en: "Hindi", flag: "🇮🇳" },
    { code: "bn" as Language, name: "বাংলা", de: "Bengalisch", it: "Bengalese", en: "Bengali", flag: "🇧🇩" },

    // Nordafrika & Naher Osten
    { code: "ar" as Language, name: "العربية", de: "Arabisch", it: "Arabo", en: "Arabic", flag: "🇸🇦" },
    { code: "tr" as Language, name: "Türkçe", de: "Türkisch", it: "Turco", en: "Turkish", flag: "🇹🇷" },

    // Westeuropa (verbreitet)
    { code: "es" as Language, name: "Español", de: "Spanisch", it: "Spagnolo", en: "Spanish", flag: "🇪🇸" },
    { code: "fr" as Language, name: "Français", de: "Französisch", it: "Francese", en: "French", flag: "🇫🇷" },
    { code: "pt" as Language, name: "Português", de: "Portugiesisch", it: "Portoghese", en: "Portuguese", flag: "🇵🇹" },

    // Asien
    { code: "zh" as Language, name: "中文", de: "Chinesisch", it: "Cinese", en: "Chinese", flag: "🇨🇳" },
  ]

  const filteredLanguages = moreLanguages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.de.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.it.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleLanguageSelect = (e: React.MouseEvent, language: Language) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedLanguage(language)
    setShowMoreLanguagesModal(false)
    // Automatisch weiterleiten, sowohl bei Modal-Modus als auch bei initialer Auswahl
    onLanguageSelect(language)
    if (onClose) {
      onClose()
    }
  }

  const mainContent = (
    <div className={`max-w-xl w-full bg-card rounded-3xl shadow-lg p-4 sm:p-6 md:p-10 lg:p-12 relative z-[102] isolate ${isInitialSelection ? 'border border-border/40' : ''}`}>
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl mb-3 sm:mb-4 shadow-lg">
          <Languages className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
          Scegli la tua lingua
          <br />
          Wähle deine Sprache
          <br />
          Choose your language
        </h1>
      </div>

      <div className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={(e) => handleLanguageSelect(e, language.code)}
            className={`w-full p-3 sm:p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-2.5 sm:gap-3 hover:shadow-lg ${
              selectedLanguage === language.code
                ? "border-teal-500 bg-teal-50 shadow-md"
                : "border-border bg-card hover:border-teal-300"
            }`}
          >
            <span className="text-2xl sm:text-3xl">{language.flag}</span>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground flex-1 text-left">{language.name}</span>
            {selectedLanguage === language.code && (
              <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}

        <button
          onClick={() => setShowMoreLanguagesModal(true)}
          className="w-full p-3 sm:p-4 md:p-5 rounded-2xl border-2 border-dashed border-border bg-gray-50 hover:bg-gray-100 hover:border-teal-300 transition-all duration-200 flex items-center gap-2.5 sm:gap-3"
        >
          <Languages className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
          <span className="text-base sm:text-lg md:text-xl font-semibold text-foreground flex-1 text-left">
            Altre lingue / Weitere Sprachen / More languages
          </span>
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )

  // Wenn initiale Auswahl, fullscreen rendern
  if (isInitialSelection) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
          {mainContent}
        </div>
        {showMoreLanguagesModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[200] animate-in fade-in duration-200">
            <div className="bg-card rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Languages className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Altre lingue</h2>
                    <p className="text-sm text-white/90">Weitere Sprachen / More languages</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMoreLanguagesModal(false)}
                  className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Search Section */}
              <div className="p-3 sm:p-4 pb-2.5 sm:pb-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sprache suchen / Cerca lingua / Search language..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-border focus:border-teal-500 focus:outline-none text-sm transition-colors"
                  />
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-3 sm:p-4 overflow-y-auto max-h-[calc(85vh-200px)]">
                {filteredLanguages.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredLanguages.map((language) => {
                      const isNew = language.code === "mk" // Mazedonisch ist neu
                      return (
                        <button
                          key={language.code}
                          onClick={(e) => handleLanguageSelect(e, language.code)}
                          className={`p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-start gap-2 hover:shadow-lg relative ${
                            selectedLanguage === language.code
                              ? "border-teal-500 bg-teal-50 shadow-md"
                              : "border-border bg-card hover:border-teal-300"
                          }`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <span className="text-2xl">{language.flag}</span>
                            <span className="text-base font-bold text-foreground flex-1 text-left">{language.name}</span>
                            {isNew && (
                              <Badge variant="default" className="bg-primary text-white shadow-md text-[10px] shrink-0">
                                Neu
                              </Badge>
                            )}
                            {selectedLanguage === language.code && (
                              <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground pl-12">
                            {language.de} • {language.it} • {language.en}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-base text-muted-foreground">
                      Keine Sprache gefunden
                      <br />
                      Nessuna lingua trovata
                      <br />
                      No language found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Wenn Modal-Modus, als Modal rendern
  if (!isOpen) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
        <div className="relative max-w-xl w-full z-[101] overflow-visible" style={{ transform: 'translateZ(0)' }}>
          {mainContent}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>
      {showMoreLanguagesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 p-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Altre lingue</h2>
                  <p className="text-sm text-white/90">Weitere Sprachen / More languages</p>
                </div>
              </div>
              <button
                onClick={() => setShowMoreLanguagesModal(false)}
                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Search Section */}
            <div className="p-4 pb-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sprache suchen / Cerca lingua / Search language..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border focus:border-teal-500 focus:outline-none text-sm transition-colors"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(85vh-200px)]">
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredLanguages.map((language) => {
                    const isNew = language.code === "mk" // Mazedonisch ist neu
                    return (
                      <button
                        key={language.code}
                        onClick={(e) => handleLanguageSelect(e, language.code)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-start gap-2 hover:shadow-lg relative ${
                          selectedLanguage === language.code
                            ? "border-teal-500 bg-teal-50 shadow-md"
                            : "border-border bg-card hover:border-teal-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-2xl">{language.flag}</span>
                          <span className="text-base font-bold text-foreground flex-1 text-left">{language.name}</span>
                          {isNew && (
                            <Badge variant="default" className="bg-primary text-white shadow-md text-[10px] shrink-0">
                              Neu
                            </Badge>
                          )}
                          {selectedLanguage === language.code && (
                            <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground pl-12">
                          {language.de} • {language.it} • {language.en}
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-base text-muted-foreground">
                    Keine Sprache gefunden
                    <br />
                    Nessuna lingua trovata
                    <br />
                    No language found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
