interface StepIndicatorProps {
  currentStep: 1 | 2
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Filtri" },
    { number: 2, label: "Offerte" },
  ]

  return (
    <div className="bg-card border-2 border-border rounded-3xl p-8 md:p-10 shadow-md mb-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  currentStep === step.number
                    ? "bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white shadow-xl scale-110 ring-4 ring-teal-200"
                    : currentStep > step.number
                      ? "bg-gradient-to-br from-teal-400 to-teal-500 text-white shadow-md"
                      : "bg-muted text-muted-foreground border-2 border-border"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`text-base font-bold mt-3 ${
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
                  currentStep > step.number ? "bg-gradient-to-r from-teal-500 to-teal-600 shadow-sm" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-xl font-bold text-foreground">Passo {currentStep} di 2</p>
      </div>
    </div>
  )
}
