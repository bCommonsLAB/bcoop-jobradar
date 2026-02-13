/**
 * Dummy-Job-Daten für die Job-Radar Anwendung
 *
 * Diese Datei bleibt als Daten-Referenz / Seed-Vorlage bestehen.
 * Die produktive Datenquelle ist MongoDB (siehe `app/api/jobs/route.ts`).
 */

import type { Job } from "@/lib/job"

/**
 * 10 realistische Dummy-Job-Datensätze für verschiedene Job-Typen
 * 
 * Verteilung:
 * - Abspüler (dishwasher): 3 Jobs
 * - Hotel/Housekeeping (housekeeping): 2 Jobs
 * - Hilfsarbeiter (helper): 2 Jobs
 * - Küche (kitchen): 2 Jobs
 * - Service (service): 1 Job
 */
export const dummyJobs: Job[] = [
  // ===== ABSPÜLER (DISHWASHER) - 3 Jobs =====
  
  {
    id: "1",
    title: "Lavapiatti (m/f/d)",
    company: "Hotel Kassian",
    location: "Algund",
    locationRegion: "merano",
    employmentType: "Tempo pieno",
    startDate: "03.12.2025",
    jobType: "dishwasher",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0473 448545",
    email: "office@kassian.it",
    description: "Cerchiamo supporto nella nostra cucina. Nessuna esperienza necessaria.",
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
    title: "Lavapiatti part-time (m/f/d)",
    company: "Ristorante La Montagna",
    location: "Bolzano",
    locationRegion: "bolzano",
    employmentType: "Part-time",
    startDate: "Subito",
    jobType: "dishwasher",
    hasAccommodation: false,
    hasMeals: true,
    phone: "0471 234567",
    email: "info@ristorante-montagna.it",
    description: "Cerchiamo lavapiatti per turni serali. Ambiente giovane e dinamico.",
    companyDescription:
      "Ristorante La Montagna è un ristorante tradizionale nel centro di Bolzano, specializzato in cucina tipica altoatesina.",
    companyAddress: "Via Portici 45, 39100 Bolzano (BZ)",
    fullDescription:
      "Per il nostro ristorante cerchiamo un/a lavapiatti per turni serali. Il lavoro prevede la pulizia delle stoviglie e delle attrezzature da cucina durante il servizio serale.",
    requirements: [
      "Disponibilità per turni serali",
      "Buona resistenza fisica",
      "Puntualità e affidabilità",
    ],
    benefits: [
      "Pasti inclusi durante il turno",
      "Orari flessibili",
      "Ambiente di lavoro amichevole",
    ],
    contractType: "Part-time",
    experienceLevel: "Principiante",
    languages: ["Italiano"],
    workingHours: "20 ore/settimana",
    salaryMin: 900,
    salaryMax: 1100,
    jobReference: "RIM-LAV-2025-002",
  },
  
  {
    id: "3",
    title: "Lavapiatti stagionale (m/f/d)",
    company: "Hotel Alpino",
    location: "Bressanone",
    locationRegion: "bressanone",
    employmentType: "Tempo pieno",
    startDate: "01.12.2025",
    jobType: "dishwasher",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0472 345678",
    email: "jobs@hotel-alpino.it",
    description: "Posizione stagionale per la stagione invernale. Alloggio incluso.",
    companyDescription:
      "L'Hotel Alpino è un hotel a 3 stelle situato a Bressanone, ideale per chi cerca un'esperienza lavorativa nella stagione turistica.",
    companyWebsite: "https://www.hotel-alpino.it",
    companyAddress: "Via Dante 12, 39042 Bressanone (BZ)",
    fullDescription:
      "Cerchiamo lavapiatti per la stagione invernale (dicembre-marzo). Offriamo alloggio in camera condivisa e vitto completo. Ambiente internazionale e possibilità di crescita.",
    requirements: [
      "Disponibilità per stagione completa",
      "Buona salute fisica",
      "Spirito di squadra",
    ],
    benefits: [
      "Alloggio incluso",
      "Vitto completo",
      "Contratto stagionale con possibilità di rinnovo",
      "Formazione sul posto",
    ],
    contractType: "Tempo determinato (stagionale)",
    experienceLevel: "Principiante",
    languages: ["Italiano", "Tedesco", "Inglese (base)"],
    workingHours: "40 ore/settimana",
    salaryMin: 1700,
    salaryMax: 2000,
    numberOfPositions: 2,
    applicationDeadline: "25.11.2025",
    jobReference: "HAL-LAV-2025-003",
  },
  
  // ===== HOTEL/HOUSEKEEPING - 2 Jobs =====
  
  {
    id: "4",
    title: "Addetto/a alle pulizie (m/f/d)",
    company: "Hotel Dolomiti",
    location: "Merano",
    locationRegion: "merano",
    employmentType: "Tempo pieno",
    startDate: "15.12.2025",
    jobType: "housekeeping",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0473 987654",
    email: "jobs@hotel-dolomiti.it",
    description: "Pulizia delle camere d'albergo. Esperienza vantaggiosa, ma non necessaria.",
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
    jobReference: "HDM-PUL-2025-004",
    applicationDeadline: "10.12.2025",
  },
  
  {
    id: "5",
    title: "Addetto/a alle pulizie camere (m/f/d)",
    company: "Hotel Cristallo",
    location: "Brunico",
    locationRegion: "brunico",
    employmentType: "Tempo pieno",
    startDate: "20.12.2025",
    jobType: "housekeeping",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0474 456789",
    email: "hr@hotel-cristallo.it",
    description: "Pulizia e preparazione camere. Ambiente professionale e moderno.",
    companyDescription:
      "L'Hotel Cristallo è un moderno hotel a 4 stelle a Brunico, con un team giovane e dinamico.",
    companyWebsite: "https://www.hotel-cristallo.it",
    companyAddress: "Via Pusteria 8, 39031 Brunico (BZ)",
    fullDescription:
      "Cerchiamo personale per la pulizia e preparazione delle camere. Il lavoro include anche la preparazione dei servizi per gli ospiti e la manutenzione degli spazi comuni.",
    requirements: [
      "Precisione e cura dei dettagli",
      "Buona organizzazione del lavoro",
      "Disponibilità per weekend",
      "Buona comunicazione con il team",
    ],
    benefits: [
      "Alloggio incluso",
      "Vitto completo",
      "Formazione professionale",
      "Possibilità di crescita",
      "Bonus produzione",
    ],
    contractType: "Tempo indeterminato",
    experienceLevel: "1-2 anni preferibili",
    languages: ["Italiano", "Tedesco"],
    contactPerson: "Anna Weber",
    contactPhone: "0474 456789",
    contactEmail: "hr@hotel-cristallo.it",
    workingHours: "40 ore/settimana",
    salaryMin: 1850,
    salaryMax: 2150,
    jobReference: "HCR-PUL-2025-005",
  },
  
  // ===== HILFSARBEITER (HELPER) - 2 Jobs =====
  
  {
    id: "6",
    title: "Aiutante generico (m/f/d)",
    company: "Hotel Panorama",
    location: "Vipiteno",
    locationRegion: "vipiteno",
    employmentType: "Tempo pieno",
    startDate: "Subito",
    jobType: "helper",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0472 567890",
    email: "info@hotel-panorama.it",
    description: "Supporto generale in hotel. Varie mansioni, ambiente dinamico.",
    companyDescription:
      "L'Hotel Panorama è un hotel a 3 stelle a Vipiteno, che cerca personale versatile e motivato.",
    companyAddress: "Via Brennero 15, 39049 Vipiteno (BZ)",
    fullDescription:
      "Cerchiamo un/a aiutante generico per supportare il team in varie mansioni: supporto in cucina, pulizie, servizio, magazzino. Ideale per chi vuole imparare e crescere professionalmente.",
    requirements: [
      "Flessibilità e adattabilità",
      "Voglia di imparare",
      "Buona resistenza fisica",
      "Disponibilità per orari variabili",
    ],
    benefits: [
      "Alloggio incluso",
      "Vitto completo",
      "Formazione su più reparti",
      "Possibilità di specializzazione",
    ],
    contractType: "Tempo indeterminato",
    experienceLevel: "Principiante",
    languages: ["Italiano", "Tedesco (base)"],
    contactPerson: "Thomas Müller",
    contactPhone: "0472 567890",
    contactEmail: "info@hotel-panorama.it",
    workingHours: "40 ore/settimana",
    salaryMin: 1750,
    salaryMax: 2050,
    jobReference: "HPA-HEL-2025-006",
  },
  
  {
    id: "7",
    title: "Aiutante cucina e servizio (m/f/d)",
    company: "Ristorante Gourmet",
    location: "Merano",
    locationRegion: "merano",
    employmentType: "Part-time",
    startDate: "05.12.2025",
    jobType: "helper",
    hasAccommodation: false,
    hasMeals: true,
    phone: "0473 112233",
    email: "jobs@ristorante-gourmet.it",
    description: "Supporto in cucina e servizio sala. Ambiente raffinato e professionale.",
    companyDescription:
      "Ristorante Gourmet è un ristorante di alta cucina a Merano, noto per la qualità e l'innovazione.",
    companyAddress: "Corso Libertà 28, 39012 Merano (BZ)",
    fullDescription:
      "Cerchiamo un/a aiutante per supportare sia in cucina che in sala. Il lavoro prevede preparazione ingredienti, supporto ai cuochi, e servizio ai tavoli durante il servizio.",
    requirements: [
      "Interesse per la cucina",
      "Buona presenza",
      "Puntualità",
      "Disponibilità per weekend e serali",
    ],
    benefits: [
      "Pasti inclusi",
      "Formazione professionale",
      "Ambiente stimolante",
      "Possibilità di crescita",
    ],
    contractType: "Part-time",
    experienceLevel: "Principiante",
    languages: ["Italiano", "Tedesco"],
    workingHours: "30 ore/settimana",
    salaryMin: 1300,
    salaryMax: 1600,
    jobReference: "RGO-HEL-2025-007",
  },
  
  // ===== KÜCHE (KITCHEN) - 2 Jobs =====
  
  {
    id: "8",
    title: "Aiuto cuoco (m/f/d)",
    company: "Ristorante Alto Adige",
    location: "Bolzano",
    locationRegion: "bolzano",
    employmentType: "Part-time",
    startDate: "Subito",
    jobType: "kitchen",
    hasAccommodation: false,
    hasMeals: true,
    phone: "0471 123456",
    email: "info@ristorante-altoadige.it",
    description: "Cerchiamo aiuto in cucina. Orari di lavoro flessibili possibili.",
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
    benefits: [
      "Orari flessibili",
      "Pasti inclusi durante il turno",
      "Possibilità di crescita professionale",
    ],
    contractType: "Part-time",
    experienceLevel: "1-2 anni",
    languages: ["Italiano", "Tedesco"],
    workingHours: "25 ore/settimana",
    salaryMin: 1200,
    salaryMax: 1500,
    applicationDeadline: "31.12.2025",
    jobReference: "RAA-KIT-2025-008",
  },
  
  {
    id: "9",
    title: "Commis di cucina (m/f/d)",
    company: "Hotel Luxury",
    location: "Brunico",
    locationRegion: "brunico",
    employmentType: "Tempo pieno",
    startDate: "10.12.2025",
    jobType: "kitchen",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0474 789012",
    email: "kitchen@hotel-luxury.it",
    description: "Commis di cucina per hotel di lusso. Esperienza richiesta.",
    companyDescription:
      "L'Hotel Luxury è un hotel a 5 stelle a Brunico, con una cucina di alto livello e un team internazionale.",
    companyWebsite: "https://www.hotel-luxury.it",
    companyAddress: "Via Centrale 5, 39031 Brunico (BZ)",
    fullDescription:
      "Cerchiamo un/a commis di cucina con esperienza per il nostro ristorante gourmet. Il lavoro prevede la preparazione di piatti raffinati sotto la guida dello chef.",
    requirements: [
      "Esperienza minima 2 anni in cucina",
      "Conoscenza approfondita delle tecniche di base",
      "Precisione e attenzione ai dettagli",
      "Capacità di lavorare sotto pressione",
      "Certificato HACCP",
    ],
    benefits: [
      "Alloggio incluso",
      "Vitto completo",
      "Formazione continua con chef professionisti",
      "Possibilità di crescita",
      "Bonus performance",
    ],
    contractType: "Tempo indeterminato",
    experienceLevel: "2-3 anni",
    languages: ["Italiano", "Tedesco", "Inglese"],
    certifications: ["Certificato HACCP"],
    contactPerson: "Chef Marco Rossi",
    contactPhone: "0474 789012",
    contactEmail: "kitchen@hotel-luxury.it",
    workingHours: "40 ore/settimana",
    salaryMin: 2000,
    salaryMax: 2400,
    jobReference: "HLU-KIT-2025-009",
  },
  
  // ===== SERVICE - 1 Job =====
  
  {
    id: "10",
    title: "Cameriere/a (m/f/d)",
    company: "Hotel Dolomiti",
    location: "Merano",
    locationRegion: "merano",
    employmentType: "Tempo pieno",
    startDate: "01.12.2025",
    jobType: "service",
    hasAccommodation: true,
    hasMeals: true,
    phone: "0473 987654",
    email: "service@hotel-dolomiti.it",
    description: "Cameriere/a per ristorante hotel. Esperienza preferibile ma non necessaria.",
    companyDescription:
      "L'Hotel Dolomiti è un hotel a 5 stelle nel centro di Merano, noto per l'eccellenza del servizio.",
    companyWebsite: "https://www.hotel-dolomiti.it",
    fullDescription:
      "Cerchiamo cameriere/a per il nostro ristorante. Il lavoro prevede il servizio ai tavoli, la preparazione della sala e l'assistenza agli ospiti. Formazione fornita.",
    requirements: [
      "Buona presenza",
      "Comunicazione efficace",
      "Disponibilità per turni serali e weekend",
      "Conoscenza base delle lingue (italiano, tedesco, inglese)",
    ],
    benefits: [
      "Alloggio incluso",
      "Vitto completo",
      "Formazione professionale",
      "Mance",
      "Possibilità di crescita",
    ],
    contractType: "Tempo indeterminato",
    experienceLevel: "Esperienza preferibile",
    languages: ["Italiano", "Tedesco", "Inglese"],
    contactPerson: "Sofia Bianchi - Responsabile Sala",
    contactPhone: "0473 987654",
    contactEmail: "service@hotel-dolomiti.it",
    workingHours: "40 ore/settimana",
    salaryMin: 1900,
    salaryMax: 2200,
    numberOfPositions: 1,
    jobReference: "HDM-SER-2025-010",
  },
]

