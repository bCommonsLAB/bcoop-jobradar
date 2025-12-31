"use client"

import { useLanguage } from "@/components/language-provider"
import { getTranslation, type TranslationKey } from "@/lib/translations"

export function useTranslation() {
  const { language } = useLanguage()
  
  const t = (key: TranslationKey): string => {
    return getTranslation(language, key)
  }
  
  return { t, language }
}

