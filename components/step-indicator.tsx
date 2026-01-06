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
    <div className="bg-card border-2 border-border rounded-lg md:rounded-2xl p-2 md:p-6 shadow-md mb-3 md:mb-6 max-w-2xl mx-auto transition-all duration-300">
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                  currentStep === step.number
                    ? "bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white shadow-lg scale-110 ring-2 ring-teal-200 animate-pulse glow-teal"
                    : currentStep > step.number
                      ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-lg"
                      : "bg-gray-100 text-muted-foreground border-2 border-border"
                }`}
              >
                {/* Mobile: Show number and icon together */}
                <div className="md:hidden flex flex-col items-center justify-center relative w-full h-full gap-0.5">
                  <step.icon
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      currentStep === step.number || currentStep > step.number
                        ? "text-white"
                        : "text-muted-foreground"
                    } ${currentStep === step.number ? "animate-pulse" : ""}`}
                  />
                  <span className={`text-[10px] font-bold leading-none ${
                    currentStep === step.number || currentStep > step.number
                      ? "text-white"
                      : "text-muted-foreground"
                  }`}>
                    {step.number}
                  </span>
                </div>
                {/* Desktop: Show icon normally */}
                <step.icon
                  className={`hidden md:block w-7 md:w-7 lg:w-8 lg:h-8 transition-transform duration-300 ${
                    currentStep === step.number || currentStep > step.number
                      ? "text-white"
                      : "text-muted-foreground"
                  } ${currentStep === step.number ? "animate-pulse" : ""}`}
                />
                {/* Number Badge on Desktop */}
                <div className="hidden md:flex absolute -top-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 bg-yellow-400 rounded-full items-center justify-center shadow-md border-2 border-white">
                  <span className="text-sm lg:text-base font-bold text-gray-900">
                    {step.number}
                  </span>
                </div>
              </div>
              <span
                className={`text-[10px] md:text-sm font-bold mt-1.5 md:mt-2.5 transition-colors duration-300 ${
                  currentStep === step.number ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 md:h-2 w-8 md:w-16 lg:w-20 mx-1.5 md:mx-3 rounded-full transition-all duration-300 ${
                  currentStep > step.number ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-md" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
