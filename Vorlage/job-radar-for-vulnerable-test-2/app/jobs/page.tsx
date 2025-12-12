"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepIndicator from "@/components/step-indicator"
import JobFilters from "@/components/job-filters"
import JobList from "@/components/job-list"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"

function JobsPageContent() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [filters, setFilters] = useState({
    jobType: "all",
    timeframe: "all",
    location: "all",
  })
  const { resetLanguage } = useLanguage()

  const handleFiltersSubmit = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <header className="relative bg-gradient-to-br from-primary via-primary to-purple-600 text-primary-foreground py-6 px-4 shadow-lg">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-3 shadow-lg">
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">job*radar</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggleButton />
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
              Jobs
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-6">
        <Link href="/">
          <Button
            variant="outline"
            size="lg"
            className="gap-3 bg-white border-2 border-border rounded-2xl shadow-md hover:shadow-lg transition-all px-6 py-5 text-base md:text-lg font-semibold"
          >
            <ArrowLeft className="w-6 h-6" />
            Torna all'inizio
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-12">
        {currentStep === 1 && (
          <div>
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl mb-10 border-2 border-border">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Passo 1: Imposta i tuoi filtri
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                Scegli cosa è importante per te. Puoi cambiare i filtri in qualsiasi momento.
              </p>
            </div>
            <JobFilters onSubmit={handleFiltersSubmit} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-2xl mb-10 border-2 border-border">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                Passo 2: Guarda le offerte
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                Ecco i lavori che corrispondono ai tuoi filtri. Clicca su un'offerta per vedere i dettagli.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="gap-3 bg-white border-2 border-border rounded-2xl shadow-md hover:shadow-lg transition-all px-6 py-5 text-base md:text-lg font-semibold"
                onClick={() => setCurrentStep(1)}
              >
                <ArrowLeft className="w-6 h-6" />
                Cambia filtri
              </Button>
            </div>
            <JobList filters={filters} />
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-border py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">Job*Radar Alto Adige – Aiuto nella ricerca di lavoro</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-2 text-sm bg-transparent">
              <Languages className="h-4 w-4" />
              Cambia lingua
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function JobsPage() {
  return (
    <LanguageProvider>
      <JobsPageContent />
    </LanguageProvider>
  )
}
