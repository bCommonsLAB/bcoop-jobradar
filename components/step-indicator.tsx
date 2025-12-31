"use client"

import { Search, Eye } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface StepIndicatorProps {
  currentStep: 1 | 2
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation()
  const steps = [
    { number: 1, label: t("stepIndicator.filters"), icon: Search },
    { number: 2, label: t("stepIndicator.offers"), icon: Eye },
  ]

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-10 shadow-md mb-8 max-w-2xl mx-auto transition-all duration-300">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  currentStep === step.number
                    ? "bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white shadow-lg scale-110 ring-2 ring-teal-200 animate-pulse glow-teal"
                    : currentStep > step.number
                      ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg"
                      : "bg-gray-100 text-muted-foreground border-2 border-border"
                }`}
              >
                <step.icon
                  className={`w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 ${
                    currentStep === step.number || currentStep > step.number
                      ? "text-white"
                      : "text-muted-foreground"
                  } ${currentStep === step.number ? "animate-pulse" : ""}`}
                />
              </div>
              <span
                className={`text-base font-bold mt-3 transition-colors duration-300 ${
                  currentStep === step.number ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`h-2 w-20 mx-3 rounded-full transition-all duration-300 ${
                  currentStep > step.number ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-md" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-xl font-bold text-foreground">{t("stepIndicator.step")} {currentStep} {t("stepIndicator.of")} 2</p>
      </div>
    </div>
  )
}
