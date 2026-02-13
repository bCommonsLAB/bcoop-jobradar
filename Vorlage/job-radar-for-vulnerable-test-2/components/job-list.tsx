"use client"

import JobCard from "@/components/job-card"

interface JobListProps {
  filters: {
    jobType: string
    timeframe: string
    location: string
  }
  onJobSelect: () => void
}

const sampleJobs = [
  {
    id: "1",
    title: "Lavapiatti (m/f/d)",
    company: "Hotel Kassian",
    location: "Algund",
    locationRegion: "burggrafenamt",
    employmentType: "Tempo pieno",
    startDate: "03.12.2025",
    jobType: "dishwasher",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0473 448545",
    email: "office@kassian.it",
    description: "Cerchiamo supporto nella nostra cucina. Nessuna esperienza necessaria.",
    // Extended fields
    companyDescription:
      "L'Hotel Kassian è un hotel a 4 stelle situato nel cuore di Algund, che offre un'atmosfera familiare e un servizio di alta qualità.",
    companyWebsite: "https://www.hotel-kassian.com",
    companyAddress: "Via Principale 123, 39022 Algund (BZ)",
    fullDescription:
      "Cerchiamo un/a lavapiatti motivato/a per unirsi al nostro team di cucina. Il candidato ideale sarà responsabile della pulizia e della manutenzione delle attrezzature da cucina, garantendo gli standard di igiene più elevati.",
    requirements: [
      "Atteggiamento positivo e volontà di imparare",
      "Capacità di lavorare in un ambiente frenetico",
      "Flessibilità negli orari di lavoro",
    ],
    benefits: [
      "Contratto a tempo indeterminato",
      "13ª e 14ª mensilità",
      "Formazione continua",
      "Ambiente di lavoro moderno",
    ],
    contractType: "Tempo indeterminato",
    experienceLevel: "Principiante",
    languages: ["Italiano", "Tedesco (base)"],
    contactPerson: "Maria Rossi",
    contactPhone: "0473 448545",
    contactEmail: "jobs@kassian.it",
    workingHours: "40 ore/settimana",
    salaryMin: 1800,
    salaryMax: 2200,
    jobReference: "KAS-LAV-2025-001",
  },
  {
    id: "2",
    title: "Aiuto cuoco (m/f/d)",
    company: "Ristorante Alto Adige",
    location: "Bolzano",
    locationRegion: "burggrafenamt",
    employmentType: "Part-time",
    startDate: "Subito",
    jobType: "kitchen",
    hasAccommodation: false,
    hasMeals: true,
    phone: "0471 123456",
    email: "info@ristorante-altoadige.it",
    description: "Cerchiamo aiuto in cucina. Orari di lavoro flessibili possibili.",
    // Extended fields
    companyDescription:
      "Ristorante Alto Adige è un ristorante tradizionale che offre cucina locale con prodotti freschi e di stagione.",
    fullDescription:
      "Per il nostro ristorante cerchiamo un aiuto cuoco per supportare il nostro team nella preparazione dei piatti. Offriamo orari flessibili e un ambiente di lavoro stimolante.",
    requirements: [
      "Esperienza base in cucina",
      "Conoscenza delle norme igieniche HACCP",
      "Passione per la cucina",
      "Disponibilità anche nei weekend",
    ],
    benefits: ["Orari flessibili", "Pasti inclusi durante il turno", "Possibilità di crescita professionale"],
    contractType: "Part-time",
    experienceLevel: "1-2 anni",
    languages: ["Italiano", "Tedesco"],
    workingHours: "25 ore/settimana",
    salaryMin: 1200,
    salaryMax: 1500,
    applicationDeadline: "31.12.2025",
  },
  {
    id: "3",
    title: "Addetto/a alle pulizie (m/f/d)",
    company: "Hotel Dolomiti",
    location: "Merano",
    locationRegion: "burggrafenamt",
    employmentType: "Tempo pieno",
    startDate: "15.12.2025",
    jobType: "housekeeping",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0473 987654",
    email: "jobs@hotel-dolomiti.it",
    description: "Pulizia delle camere d'albergo. Esperienza vantaggiosa, ma non necessaria.",
    // Extended fields
    companyDescription:
      "L'Hotel Dolomiti è un hotel a 5 stelle nel centro di Merano, noto per l'eccellenza del servizio e l'attenzione ai dettagli.",
    companyWebsite: "https://www.hotel-dolomiti.it",
    fullDescription:
      "Cerchiamo personale per le pulizie delle camere e degli spazi comuni. Il/la candidato/a ideale è una persona attenta ai dettagli, affidabile e con buone capacità organizzative.",
    requirements: [
      "Esperienza nel settore alberghiero (preferibile)",
      "Precisione e attenzione ai dettagli",
      "Affidabilità e puntualità",
      "Buona forma fisica",
    ],
    benefits: [
      "Alloggio in camera singola",
      "Vitto completo",
      "Assicurazione sanitaria integrativa",
      "Bonus di fine anno",
    ],
    contractType: "Tempo determinato (6 mesi)",
    experienceLevel: "Esperienza preferibile",
    education: "Diploma di scuola superiore",
    languages: ["Italiano", "Tedesco", "Inglese (base)"],
    certifications: ["Attestato HACCP"],
    contactPerson: "Luca Bianchi - Responsabile HR",
    contactEmail: "hr@hotel-dolomiti.it",
    workingHours: "38 ore/settimana",
    numberOfPositions: 2,
    salaryMin: 1900,
    salaryMax: 2300,
    jobReference: "HDM-PUL-2025-003",
    applicationDeadline: "10.12.2025",
  },
]

export default function JobList({ filters, onJobSelect }: JobListProps) {
  const filteredJobs = sampleJobs.filter((job) => {
    // Filter by job type
    if (filters.jobType !== "all") {
      // Check if it's a custom job (from "Altri lavori")
      if (filters.jobType.startsWith("custom-")) {
        const customJobId = filters.jobType.replace("custom-", "")
        // For custom jobs, we need to match by title or id
        // For now, we'll skip this filter for custom jobs since we don't have a mapping
        // In a real app, this would be handled properly
      } else {
        // Standard job type filter
        if (job.jobType !== filters.jobType) {
          return false
        }
      }
    }

    // Filter by timeframe
    if (filters.timeframe !== "all") {
      const today = new Date()
      const jobDate = parseJobDate(job.startDate)

      if (filters.timeframe === "week") {
        const oneWeekFromNow = new Date(today)
        oneWeekFromNow.setDate(today.getDate() + 7)
        if (jobDate > oneWeekFromNow) {
          return false
        }
      } else if (filters.timeframe === "month") {
        const oneMonthFromNow = new Date(today)
        oneMonthFromNow.setMonth(today.getMonth() + 1)
        if (jobDate > oneMonthFromNow) {
          return false
        }
      }
    }

    // Filter by location
    if (filters.location !== "all") {
      if (job.locationRegion !== filters.location) {
        return false
      }
    }

    return true
  })

  // Helper function to parse job start dates
  function parseJobDate(dateStr: string): Date {
    if (dateStr.toLowerCase() === "subito") {
      return new Date() // "Subito" means immediate start
    }
    // Parse DD.MM.YYYY format
    const parts = dateStr.split(".")
    if (parts.length === 3) {
      return new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
    }
    return new Date()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">{filteredJobs.length} lavori trovati</h2>
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => <JobCard key={job.id} job={job} onSelect={onJobSelect} />)
      ) : (
        <div className="bg-white rounded-[2rem] p-10 md:p-12 shadow-xl text-center border-2 border-border">
          <p className="text-xl md:text-2xl text-muted-foreground">
            Nessun lavoro trovato con questi filtri. Prova a modificare la tua selezione.
          </p>
        </div>
      )}
    </div>
  )
}
