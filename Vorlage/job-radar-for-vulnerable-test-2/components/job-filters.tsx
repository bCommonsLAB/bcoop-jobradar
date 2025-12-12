"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ChefHat,
  Sparkles,
  Bed,
  Users,
  Coffee,
  UtensilsCrossed,
  Mountain,
  MapPin,
  Search,
  Briefcase,
  X,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface JobFiltersProps {
  onSubmit: (filters: { jobType: string; timeframe: string; location: string }) => void
}

interface CustomJob {
  id: number
  title: string
  value: string
}

export default function JobFilters({ onSubmit }: JobFiltersProps) {
  const [jobType, setJobType] = useState<string>("all")
  const [timeframe, setTimeframe] = useState<string>("all")
  const [location, setLocation] = useState<string>("all")
  const [isJobSelectorOpen, setIsJobSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [customJobs, setCustomJobs] = useState<CustomJob[]>([])

  const predefinedJobs = [
    { id: 1, title: "Aiuto cuoco (m/f/d)", company: "Ristorante Alto Adige", location: "Bolzano", type: "Part-time" },
    { id: 2, title: "Cameriere/a (m/f/d)", company: "Hotel Dolomiti", location: "Merano", type: "Full-time" },
    { id: 3, title: "Receptionist (m/f/d)", company: "Hotel Cristallo", location: "Cortina", type: "Full-time" },
    { id: 4, title: "Barista (m/f/d)", company: "Caffè Centrale", location: "Bolzano", type: "Part-time" },
    { id: 5, title: "Addetto/a pulizie (m/f/d)", company: "Hotel Alpino", location: "Bressanone", type: "Full-time" },
    { id: 6, title: "Chef de rang (m/f/d)", company: "Ristorante Gourmet", location: "Merano", type: "Full-time" },
    { id: 7, title: "Lavapiatti (m/f/d)", company: "Trattoria La Montagna", location: "Bolzano", type: "Part-time" },
    { id: 8, title: "Commis di cucina (m/f/d)", company: "Hotel Luxury", location: "Brunico", type: "Full-time" },
  ]

  const filteredJobs = predefinedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleJobSelect = (job: (typeof predefinedJobs)[0]) => {
    const jobValue = `custom-${job.id}`
    const customJob: CustomJob = {
      id: job.id,
      title: job.title,
      value: jobValue,
    }

    setCustomJobs([customJob])

    // Select this job (automatically deselects previous selection)
    setJobType(jobValue)
    setIsJobSelectorOpen(false)
    setSearchQuery("")
  }

  const removeCustomJob = (jobId: number) => {
    setCustomJobs(customJobs.filter((job) => job.id !== jobId))
    // If the removed job was selected, reset to "all"
    if (jobType === `custom-${jobId}`) {
      setJobType("all")
    }
  }

  const handleSubmit = () => {
    onSubmit({ jobType, timeframe, location })
  }

  const jobTypes = [
    { value: "all", label: "Tutto", icon: Sparkles },
    { value: "kitchen", label: "Cucina", icon: ChefHat },
    { value: "dishwasher", label: "Lavapiatti", icon: UtensilsCrossed },
    { value: "housekeeping", label: "Pulizie", icon: Bed },
    { value: "helper", label: "Aiutante", icon: Users },
    { value: "service", label: "Servizio", icon: Coffee },
  ]

  const locations = [
    { value: "all", label: "Tutte le regioni", icon: MapPin },
    { value: "bolzano", label: "Bolzano", icon: Mountain },
    { value: "merano", label: "Merano", icon: Mountain },
    { value: "bressanone", label: "Bressanone", icon: Mountain },
    { value: "brunico", label: "Brunico", icon: Mountain },
    { value: "vipiteno", label: "Vipiteno", icon: Mountain },
    { value: "val-pusteria", label: "Val Pusteria (opzionale)", icon: Mountain },
    { value: "val-venosta", label: "Val Venosta (opzionale)", icon: Mountain },
  ]

  return (
    <div className="bg-white border border-border rounded-[2rem] p-8 md:p-10 shadow-xl space-y-10">
      <Dialog open={isJobSelectorOpen} onOpenChange={setIsJobSelectorOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] rounded-[2rem] p-0 overflow-hidden">
          <div className="p-6 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-foreground">Altri lavori</DialogTitle>
            </DialogHeader>
            <div className="relative mt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cerca per lavoro, azienda o luogo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-base rounded-[1rem] border-2 focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-[50vh] p-6 space-y-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className="w-full text-left p-5 rounded-[1.25rem] border-2 border-border/50 bg-white hover:border-primary hover:shadow-lg transition-all hover:scale-[1.02] space-y-2"
                >
                  <div className="font-bold text-lg text-foreground">{job.title}</div>
                  <div className="text-sm text-muted-foreground">{job.company}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-primary">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{job.type}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                Nessun lavoro trovato. Prova con un'altra ricerca.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Type */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">Tipo di lavoro</label>
        <div className="grid grid-cols-2 gap-4">
          {jobTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.value}
                onClick={() => setJobType(type.value)}
                className={`py-5 px-5 rounded-[1.5rem] text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 ${
                  jobType === type.value
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-xl scale-[1.03]"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                <Icon className={`w-7 h-7 ${jobType === type.value ? "text-white" : "text-primary"}`} />
                {type.label}
              </button>
            )
          })}
          {customJobs.map((job) => (
            <button
              key={job.value}
              onClick={() => setJobType(job.value)}
              className={`py-5 px-5 rounded-[1.5rem] text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 relative ${
                jobType === job.value
                  ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-xl scale-[1.03]"
                  : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              <Briefcase className={`w-7 h-7 ${jobType === job.value ? "text-white" : "text-primary"}`} />
              <span className="text-sm leading-tight">{job.title}</span>
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeCustomJob(job.id)
                }}
                className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  jobType === job.value
                    ? "bg-white text-primary hover:bg-gray-100"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsJobSelectorOpen(true)}
          className="w-full py-5 px-6 rounded-[1.5rem] text-base md:text-lg font-semibold transition-all duration-200 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-cyan-50 text-primary hover:border-primary hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          <Search className="w-5 h-5" />
          Altri lavori
        </button>
      </div>

      {/* Timeframe */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">Periodo</label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "all", label: "Tutti" },
            { value: "week", label: "Questa settimana" },
            { value: "month", label: "Questo mese" },
          ].map((time) => (
            <button
              key={time.value}
              onClick={() => setTimeframe(time.value)}
              className={`py-5 px-5 rounded-[1.5rem] text-base md:text-lg font-bold transition-all duration-200 border-2 ${
                timeframe === time.value
                  ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-xl scale-[1.03]"
                  : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
              }`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-5">
        <label className="block text-2xl md:text-3xl font-bold text-foreground">Luogo</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const Icon = loc.icon
            return (
              <button
                key={loc.value}
                onClick={() => setLocation(loc.value)}
                className={`py-5 px-5 rounded-[1.5rem] text-base md:text-lg font-bold transition-all duration-200 border-2 flex flex-col items-center gap-3 ${
                  location === loc.value
                    ? "bg-gradient-to-br from-primary to-cyan-600 text-white border-primary shadow-xl scale-[1.03]"
                    : "bg-gradient-to-br from-white to-gray-50 text-foreground border-border/50 hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                <Icon className={`w-7 h-7 ${location === loc.value ? "text-white" : "text-primary"}`} />
                {loc.label}
              </button>
            )
          })}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        size="lg"
        className="w-full py-7 text-xl font-bold shadow-2xl gap-3 rounded-[1.5rem] bg-gradient-to-r from-primary to-cyan-600 hover:from-primary/90 hover:to-cyan-600/90 transition-all hover:scale-[1.02]"
      >
        Continua alle offerte
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  )
}
