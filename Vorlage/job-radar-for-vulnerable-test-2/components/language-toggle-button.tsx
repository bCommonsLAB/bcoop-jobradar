"use client"

import { Languages } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Button } from "./ui/button"

export function LanguageToggleButton() {
  const { resetLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={resetLanguage}
      className="text-white hover:text-white hover:bg-white/20 rounded-xl"
      title="Sprache ändern / Cambia lingua / Change language"
    >
      <Languages className="h-5 w-5" />
    </Button>
  )
}
