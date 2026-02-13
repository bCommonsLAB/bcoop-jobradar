"use client"

import { Search, Eye, Check } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface StepIndicatorProps {
  currentStep: 1 | 2
  onStepClick?: (step: number) => void
}

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  const { t } = useTranslation()
  const steps = [
    { number: 1, label: t("stepIndicator.filters"), icon: Search, unicode: "①" },
    { number: 2, label: t("stepIndicator.offers"), icon: Eye, unicode: "②" },
  ]

  return (
    <div className="backdrop-blur-md bg-white/80 border-2 border-border/50 rounded-lg md:rounded-3xl p-2 md:p-4 lg:p-8 shadow-xl mb-3 md:mb-6 max-w-3xl mx-auto transition-all duration-300 hover:shadow-2xl">
      {/* Mobile: Desktop-ähnliches Design */}
      <div className="md:hidden flex items-center justify-center gap-1 md:gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const isPending = currentStep < step.number
          
          return (
            <div key={step.number} className="flex items-center">
              {/* Step Card */}
              <div 
                className={`flex flex-col items-center flex-shrink-0 group ${
                  step.number === 1 && currentStep === 2 && onStepClick ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (step.number === 1 && currentStep === 2 && onStepClick) {
                    onStepClick(1)
                  }
                }}
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 relative ${
                    isActive
                      ? "bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white shadow-2xl scale-110 ring-4 ring-teal-200/50 glow-teal hover:scale-115 hover:shadow-2xl"
                      : isCompleted
                        ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-xl scale-105 hover:scale-110 hover:shadow-2xl"
                        : step.number === 1 && currentStep === 2 && onStepClick
                          ? "bg-gradient-to-br from-gray-100 to-gray-200 text-muted-foreground border-2 border-border shadow-md hover:scale-110 hover:shadow-xl hover:bg-gray-200/80 cursor-pointer ring-2 ring-teal-300/30 hover:ring-teal-400/50"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-muted-foreground border-2 border-border shadow-md hover:scale-105 hover:shadow-lg hover:bg-gray-200/80"
                  }`}
                >
                  {/* Show icon or checkmark */}
                  {isCompleted ? (
                    <Check 
                      className="w-5 h-5 md:w-6 md:h-6 text-white animate-in fade-in zoom-in duration-300" 
                      strokeWidth={3} 
                    />
                  ) : (
                    <step.icon
                      className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                        isActive ? "text-white animate-pulse scale-110" : isPending ? "text-muted-foreground" : "text-white"
                      } ${!isPending ? "group-hover:scale-110" : ""}`}
                    />
                  )}
                  
                  {/* Number Badge (only for active or pending) */}
                  {!isCompleted && (
                    <div className={`absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 rounded-full items-center justify-center shadow-lg border-2 border-white transition-all duration-300 flex ${
                      isActive 
                        ? "bg-gradient-to-br from-yellow-400 to-orange-400 scale-110" 
                        : "bg-gradient-to-br from-yellow-400/80 to-orange-400/80 hover:scale-105"
                    }`}>
                      <span className={`text-[10px] md:text-xs font-bold ${
                        isActive ? "text-gray-900" : "text-gray-800"
                      }`}>
                        {step.number}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`text-[10px] md:text-xs font-bold mt-1.5 transition-all duration-300 text-center ${
                    isActive 
                      ? "text-foreground drop-shadow-sm" 
                      : isCompleted
                        ? "text-teal-600 font-semibold"
                        : "text-muted-foreground"
                  } ${isActive ? "scale-105" : ""}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Animated Progress Line */}
              {index < steps.length - 1 && (
                <div className="relative h-0.5 md:h-1 w-6 md:w-8 mx-1.5 rounded-full overflow-hidden bg-border">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${
                      isCompleted
                        ? "w-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 shadow-md glow-primary"
                        : "w-0 bg-gradient-to-r from-teal-500 to-cyan-500"
                    }`}
                    style={{
                      transitionDelay: isCompleted ? "200ms" : "0ms"
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Desktop: Altes kreisförmiges Design */}
      <div className="hidden md:flex items-center justify-center gap-3 md:gap-6 lg:gap-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const isPending = currentStep < step.number
          
          return (
            <div key={step.number} className="flex items-center">
              {/* Step Card */}
              <div 
                className={`flex flex-col items-center flex-shrink-0 group ${
                  step.number === 1 && currentStep === 2 && onStepClick ? "cursor-pointer" : ""
                }`}
                onClick={() => {
                  if (step.number === 1 && currentStep === 2 && onStepClick) {
                    onStepClick(1)
                  }
                }}
              >
                <div
                  className={`w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl md:rounded-2xl lg:rounded-3xl flex items-center justify-center transition-all duration-500 relative ${
                    isActive
                      ? "bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white shadow-2xl scale-110 ring-4 ring-teal-200/50 glow-teal hover:scale-115 hover:shadow-2xl"
                      : isCompleted
                        ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-xl scale-105 hover:scale-110 hover:shadow-2xl"
                        : step.number === 1 && currentStep === 2 && onStepClick
                          ? "bg-gradient-to-br from-gray-100 to-gray-200 text-muted-foreground border-2 border-border shadow-md hover:scale-110 hover:shadow-xl hover:bg-gray-200/80 cursor-pointer ring-2 ring-teal-300/30 hover:ring-teal-400/50"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-muted-foreground border-2 border-border shadow-md hover:scale-105 hover:shadow-lg hover:bg-gray-200/80"
                  }`}
                >
                  {/* Desktop: Show icon or checkmark */}
                  {isCompleted ? (
                    <Check 
                      className="hidden md:block w-10 h-10 lg:w-12 lg:h-12 text-white animate-in fade-in zoom-in duration-300" 
                      strokeWidth={3} 
                    />
                  ) : (
                    <step.icon
                      className={`hidden md:block w-8 h-8 lg:w-10 lg:h-10 transition-all duration-300 ${
                        isActive ? "text-white animate-pulse scale-110" : isPending ? "text-muted-foreground" : "text-white"
                      } ${!isPending ? "group-hover:scale-110" : ""}`}
                    />
                  )}
                  
                  {/* Number Badge on Desktop (only for active or pending) */}
                  {!isCompleted && (
                    <div className={`hidden md:flex absolute -top-2 -right-2 w-7 h-7 lg:w-8 lg:h-8 rounded-full items-center justify-center shadow-lg border-2 border-white transition-all duration-300 ${
                      isActive 
                        ? "bg-gradient-to-br from-yellow-400 to-orange-400 scale-110" 
                        : "bg-gradient-to-br from-yellow-400/80 to-orange-400/80 hover:scale-105"
                    }`}>
                      <span className={`text-sm lg:text-base font-bold ${
                        isActive ? "text-gray-900" : "text-gray-800"
                      }`}>
                        {step.number}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Label */}
                <span
                  className={`text-xs md:text-base lg:text-lg font-bold mt-2 md:mt-3 transition-all duration-300 text-center ${
                    isActive 
                      ? "text-foreground drop-shadow-sm" 
                      : isCompleted
                        ? "text-teal-600 font-semibold"
                        : "text-muted-foreground"
                  } ${isActive ? "scale-105" : ""}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Animated Progress Line */}
              {index < steps.length - 1 && (
                <div className="relative h-1.5 md:h-2 w-10 md:w-16 lg:w-24 mx-2 md:mx-4 lg:mx-6 rounded-full overflow-hidden bg-border">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out ${
                      isCompleted
                        ? "w-full bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 shadow-md glow-primary"
                        : "w-0 bg-gradient-to-r from-teal-500 to-cyan-500"
                    }`}
                    style={{
                      transitionDelay: isCompleted ? "200ms" : "0ms"
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
