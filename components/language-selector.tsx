"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages, X, Search } from "lucide-react"

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
  | "es"
  | "fr"
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
}

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [showMoreLanguagesModal, setShowMoreLanguagesModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
  ]

  const filteredLanguages = moreLanguages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.de.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.it.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language)
    setShowMoreLanguagesModal(false)
  }

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-16 border-2 border-border">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl mb-6 shadow-lg">
              <Languages className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Scegli la tua lingua
              <br />
              Wähle deine Sprache
              <br />
              Choose your language
            </h1>
            <p className="text-lg text-muted-foreground">
              Seleziona una lingua per continuare.
              <br />
              Bitte wähle eine Sprache aus, um fortzufahren.
              <br />
              Please select a language to continue.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 hover:shadow-lg ${
                  selectedLanguage === language.code
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-border bg-white hover:border-teal-300"
                }`}
              >
                <span className="text-4xl">{language.flag}</span>
                <span className="text-2xl font-semibold text-foreground flex-1 text-left">{language.name}</span>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            <button
              onClick={() => setShowMoreLanguagesModal(true)}
              className="w-full p-6 rounded-2xl border-2 border-dashed border-border bg-gray-50 hover:bg-gray-100 hover:border-teal-300 transition-all duration-200 flex items-center gap-4"
            >
              <Languages className="w-8 h-8 text-teal-600" />
              <span className="text-xl font-semibold text-foreground flex-1 text-left">
                Altre lingue / Weitere Sprachen / More languages
              </span>
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white px-8 py-8 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continua / Weiter / Continue
          </Button>
        </div>
      </div>

      {showMoreLanguagesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 p-6 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Languages className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Altre lingue</h2>
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
            <div className="p-6 pb-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Sprache suchen / Cerca lingua / Search language..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-border focus:border-teal-500 focus:outline-none text-base transition-colors"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-start gap-2 hover:shadow-lg ${
                        selectedLanguage === language.code
                          ? "border-teal-500 bg-teal-50 shadow-md"
                          : "border-border bg-white hover:border-teal-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-3xl">{language.flag}</span>
                        <span className="text-lg font-bold text-foreground flex-1 text-left">{language.name}</span>
                        {selectedLanguage === language.code && (
                          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground pl-12">
                        {language.de} • {language.it} • {language.en}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground">
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
