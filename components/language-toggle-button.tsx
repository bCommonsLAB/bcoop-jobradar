"use client"

import { useState } from "react"
import { Languages } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Button } from "./ui/button"
import { LanguageSelector } from "./language-selector"

export function LanguageToggleButton() {
  const { setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-white hover:text-white hover:bg-white/20 rounded-xl"
        title="Sprache ändern / Cambia lingua / Change language"
      >
        <Languages className="h-5 w-5" />
      </Button>
      <LanguageSelector
        onLanguageSelect={setLanguage}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isInitialSelection={false}
      />
    </>
  )
}
