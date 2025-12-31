"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Languages, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepIndicator from "@/components/step-indicator"
import JobFilters from "@/components/job-filters"
import JobList from "@/components/job-list"
import ActiveFilters from "@/components/active-filters"
import JobNotifications from "@/components/job-notifications"
import { LanguageProvider, useLanguage } from "@/components/language-provider"
import { LanguageToggleButton } from "@/components/language-toggle-button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useTranslation } from "@/hooks/use-translation"

function JobsPageContent() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [filters, setFilters] = useState({
    jobTypes: [] as string[],
    timeframe: "all",
    locations: [] as string[],
  })
  const { resetLanguage } = useLanguage()
  const { t } = useTranslation()

  const handleFiltersSubmit = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentStep(2)
  }

  // Handler zum Entfernen einzelner Filter
  const handleRemoveFilter = (filterType: "jobTypes" | "timeframe" | "locations", value?: string) => {
    setFilters((prev) => {
      if (filterType === "timeframe") {
        return {
          ...prev,
          timeframe: "all",
        }
      } else if (filterType === "jobTypes" && value) {
        return {
          ...prev,
          jobTypes: prev.jobTypes.filter((t) => t !== value),
        }
      } else if (filterType === "locations" && value) {
        return {
          ...prev,
          locations: prev.locations.filter((l) => l !== value),
        }
      }
      return prev
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-accent/20">
      <header className="relative bg-gradient-to-br from-teal-500 via-teal-400 via-cyan-500 via-cyan-400 to-teal-600 text-white py-6 px-4 shadow-xl overflow-hidden">
        {/* Hintergrundbild */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-lake.png" 
            alt="Mountain Lake Landscape" 
            fill 
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>
        
        {/* Bestehende animierte Blur-Elemente */}
        <div className="absolute inset-0 overflow-hidden opacity-10 z-0">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-white/30 flex items-center gap-3 transition-all duration-300 hover:bg-white/30">
            <div className="flex-shrink-0 relative">
              <Image src="/bcoop-logo.png" alt="bcoop Logo" width={100} height={40} className="w-auto h-8 mix-blend-screen" />
            </div>
            <div className="h-8 w-px bg-white/30" />
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg whitespace-nowrap">job*radar</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggleButton />
            <Button variant="ghost" size="sm" className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 rounded-xl shadow-lg transition-all duration-300">
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
            {t("nav.backToStart")}
          </Button>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-6">
        <StepIndicator currentStep={currentStep} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-12">
        {currentStep === 1 && (
          <div>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md mb-10 transition-all duration-200 hover:shadow-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                {t("jobs.step1Title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed tracking-normal">
                {t("jobs.step1Description")}
              </p>
            </div>
            <JobFilters onSubmit={handleFiltersSubmit} />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md mb-10 transition-all duration-200 hover:shadow-lg">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                {t("jobs.step2Title")}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 tracking-normal">
                {t("jobs.step2Description")}
              </p>
            </div>
            
            {/* Filter als Collapsible */}
            <Collapsible defaultOpen={false} className="mb-6">
              <CollapsibleTrigger className="w-full bg-white rounded-[2rem] p-6 shadow-xl border-2 border-border flex items-center justify-between hover:shadow-2xl transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{t("jobs.modifyFilters")}</h3>
                </div>
                <ChevronDown className="w-6 h-6 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                <JobFilters 
                  onSubmit={handleFiltersSubmit} 
                  initialFilters={filters}
                  autoApply={true}
                  showSubmitButton={false}
                />
              </CollapsibleContent>
            </Collapsible>
            
            {/* Zeige aktive Filter an */}
            <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} />
            
            {/* Job-Benachrichtigungen */}
            <JobNotifications filters={filters} />
            
            <JobList filters={filters} onJobSelect={() => {}} />
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-border py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">{t("welcome.footer")}</p>
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={resetLanguage} className="gap-1.5 text-xs px-3 py-1.5 bg-transparent border-border/50 hover:border-primary/50">
              <Languages className="h-3.5 w-3.5" />
              {t("welcome.language")}
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
