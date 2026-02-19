/**
 * Translation Layer für Job-Inhalte (Hybrid-Ansatz)
 * 
 * Kombiniert Mapping zu bekannten Jobs aus job-titles.ts mit Fallback-Mechanismen.
 * Übersetzt Titel, Beschreibungen, Aufgaben und Anforderungen basierend auf der ausgewählten Sprache.
 */

import type { Job } from "@/lib/job"
import type { Language } from "@/components/language-provider"
import { jobTitles, getJobTitle, getJobDescription } from "@/lib/job-titles"

/**
 * Interface für übersetzte Job-Daten
 */
export interface TranslatedJob {
  title: string
  tasks: string[]
  requirements: string[]
}

/**
 * Memory-Cache für Übersetzungen (Session-basiert)
 */
const translationCache = new Map<string, TranslatedJob>()

/**
 * Normalisiert einen Job-Titel für Matching
 * Entfernt Gender-Indikatoren und normalisiert den Text
 */
function normalizeJobTitle(title: string): string {
  let normalized = title.trim()
  
  // Entferne Gender-Indikatoren: (m/w/d), (m/f/d), (w/m/d), (m/w), etc.
  normalized = normalized.replace(/\s*\([mwfd\/\*]+[\/\*]?[mwfd\/\*]*\)/gi, '')
  
  // Entferne führende/nachfolgende Leerzeichen und Bindestriche
  normalized = normalized.replace(/^[\s\-]+|[\s\-]+$/g, '')
  
  // Normalisiere zu Kleinbuchstaben für Vergleich
  return normalized.toLowerCase()
}

/**
 * Findet einen passenden Job-Titel in job-titles.ts
 * 
 * Matching-Strategien (in Reihenfolge):
 * 1. Exakter Match (nach Normalisierung)
 * 2. Alias-Match
 * 3. Teilstring-Match
 * 
 * @param jobTitle Der zu matchende Job-Titel
 * @returns Die ID des gefundenen Jobs oder null
 */
export function findMatchingJobTitle(jobTitle: string): number | null {
  if (!jobTitle || !jobTitle.trim()) return null
  
  const normalizedTitle = normalizeJobTitle(jobTitle)
  
  // 1. Exakter Match gegen alle Titel (titleIt, titleDe, titleEn)
  for (const job of jobTitles) {
    const normalizedIt = normalizeJobTitle(job.titleIt)
    const normalizedDe = normalizeJobTitle(job.titleDe)
    const normalizedEn = normalizeJobTitle(job.titleEn)
    
    if (
      normalizedTitle === normalizedIt ||
      normalizedTitle === normalizedDe ||
      normalizedTitle === normalizedEn
    ) {
      return job.id
    }
  }
  
  // 2. Alias-Match
  for (const job of jobTitles) {
    if (job.aliases && job.aliases.length > 0) {
      for (const alias of job.aliases) {
        const normalizedAlias = normalizeJobTitle(alias)
        if (normalizedTitle === normalizedAlias) {
          return job.id
        }
      }
    }
  }
  
  // 3. Teilstring-Match: Prüfe ob normalisierter Titel Teil eines Job-Titels ist oder umgekehrt
  for (const job of jobTitles) {
    const normalizedIt = normalizeJobTitle(job.titleIt)
    const normalizedDe = normalizeJobTitle(job.titleDe)
    const normalizedEn = normalizeJobTitle(job.titleEn)
    
    // Prüfe ob Job-Titel Teil des gesuchten Titels ist
    if (
      normalizedTitle.includes(normalizedIt) ||
      normalizedTitle.includes(normalizedDe) ||
      normalizedTitle.includes(normalizedEn)
    ) {
      return job.id
    }
    
    // Prüfe ob gesuchter Titel Teil eines Job-Titels ist
    if (
      normalizedIt.includes(normalizedTitle) ||
      normalizedDe.includes(normalizedTitle) ||
      normalizedEn.includes(normalizedTitle)
    ) {
      return job.id
    }
    
    // Prüfe auch gegen Aliases
    if (job.aliases && job.aliases.length > 0) {
      for (const alias of job.aliases) {
        const normalizedAlias = normalizeJobTitle(alias)
        if (normalizedTitle.includes(normalizedAlias) || normalizedAlias.includes(normalizedTitle)) {
          return job.id
        }
      }
    }
  }
  
  return null
}

/**
 * Übersetzt einen Job-Titel basierend auf der ausgewählten Sprache
 * 
 * @param job Der Job
 * @param language Die Zielsprache
 * @returns Der übersetzte Titel oder der Original-Titel als Fallback
 */
export function getTranslatedJobTitle(job: Job, language: Language): string {
  const matchingJobId = findMatchingJobTitle(job.title)
  
  if (matchingJobId !== null) {
    const translatedTitle = getJobTitle(matchingJobId, language)
    if (translatedTitle) {
      return translatedTitle
    }
  }
  
  // Fallback: Original-Titel
  return job.title
}

/**
 * Übersetzungs-Mappings für häufige Task-Phrasen (DE → IT/EN)
 * 
 * Diese Mappings decken die häufigsten Phrasen aus gescrapten Jobs ab.
 * Unbekannte Phrasen bleiben im Original.
 */
const TASK_TRANSLATIONS: Record<Language, Record<string, string>> = {
  it: {
    // Rezeption / Front Office
    "Check-in und Check-out der Gäste": "Check-in e check-out degli ospiti",
    "Check-in und Check out der Gäste": "Check-in e check-out degli ospiti",
    "Betreuung und Beratung unserer Gäste": "Assistenza e consulenza ai nostri ospiti",
    "Betreuung der Gäste": "Assistenza agli ospiti",
    "allfällige Arbeiten an der Rezeption": "eventuali lavori alla reception",
    "Arbeiten an der Rezeption": "Lavori alla reception",
    "Rezeptionsdienst": "Servizio reception",
    
    // Service / Kellner
    "Servieren am Tisch": "Servizio ai tavoli",
    "Servieren der Gäste": "Servizio agli ospiti",
    "Bedienung der Gäste": "Servizio agli ospiti",
    "Servieren": "Servizio",
    "Bedienung": "Servizio",
    "Vorbereitung der Tische": "Preparazione dei tavoli",
    "Vorbereitung der Räume": "Preparazione delle sale",
    
    // Küche
    "Lavare piatti, pentole e bicchieri": "Lavare piatti, pentole e bicchieri",
    "Spülen von Geschirr": "Lavare piatti e stoviglie",
    "Geschirr spülen": "Lavare piatti",
    "Spülen": "Lavare piatti",
    "Vorbereitung der Zutaten": "Preparazione degli ingredienti",
    "Unterstützung der Köche": "Supporto ai cuochi",
    "Hilfe in der Küche": "Aiuto in cucina",
    "Unterstützung in der Küche": "Supporto in cucina",
    "Zubereitung der Gerichte": "Preparazione dei piatti",
    "Hygiene und Ordnung": "Igiene e ordine",
    "Küche sauber halten": "Tenere la cucina pulita",
    "Küche sauber und ordentlich halten": "Tenere la cucina pulita e ordinata",
    
    // Housekeeping / Reinigung
    "Pulizie camere": "Pulizia camere",
    "Reinigung der Zimmer": "Pulizia delle camere",
    "Zimmerreinigung": "Pulizia camere",
    "Vorbereitung der Zimmer": "Preparazione delle camere",
    "Bereitstellung der Dienstleistungen für Gäste": "Preparazione servizi per gli ospiti",
    "Wartung der Gemeinschaftsräume": "Manutenzione spazi comuni",
    "Reinigung der Gemeinschaftsräume": "Pulizia spazi comuni",
    "Pulizia e preparazione camere": "Pulizia e preparazione camere",
    "Servizi per gli ospiti": "Servizi per gli ospiti",
    "Spazi comuni": "Spazi comuni",
    
    // Allgemein
    "Unterstützung des Teams": "Supporto al team",
    "Zusammenarbeit mit dem Team": "Collaborazione con il team",
    "Lagerarbeit": "Lavoro in magazzino",
    "Magazzino": "Magazzino",
    "Supporto al team di cucina": "Supporto al team di cucina",
    "Pulizia stoviglie e attrezzature da cucina": "Pulizia stoviglie e attrezzature da cucina",
    "Preparazione piatti raffinati": "Preparazione piatti raffinati",
    "Supporto allo chef": "Supporto allo chef",
    "Organizzazione cucina": "Organizzazione cucina",
    "Assistenza agli ospiti": "Assistenza agli ospiti",
    "Preparazione sala": "Preparazione sala",
    
    // Zusätzliche italienische Phrasen aus Dummy-Jobs
    "Aiutare i cuochi quando serve": "Aiutare i cuochi quando serve",
    "Tenere la cucina ordinata": "Tenere la cucina ordinata",
    "Collaborare con il team": "Collaborare con il team",
    "Preparazione ingredienti": "Preparazione ingredienti",
    "Supporto ai cuochi": "Supporto ai cuochi",
    "Pulizie e servizio": "Pulizie e servizio",
    "Supporto in cucina": "Supporto in cucina",
    "Lavare piatti e pentole": "Lavare piatti e pentole",
  },
  de: {
    // Deutsche Originale bleiben gleich (Identity-Mapping)
    // Zusätzlich: Übersetzungen für italienische Phrasen
    "Aiutare i cuochi quando serve": "Den Köchen helfen, wenn nötig",
    "Tenere la cucina ordinata": "Küche ordentlich halten",
    "Collaborare con il team": "Mit dem Team zusammenarbeiten",
    "Preparazione ingredienti": "Vorbereitung der Zutaten",
    "Supporto ai cuochi": "Unterstützung der Köche",
    "Pulizie e servizio": "Reinigung und Service",
    "Supporto in cucina": "Unterstützung in der Küche",
    "Lavare piatti e pentole": "Geschirr und Töpfe spülen",
    "Esperienza nel settore alberghiero (preferibile)": "Erfahrung im Gastgewerbe (bevorzugt)",
    "Esperienza base in cucina": "Grundkenntnisse in der Küche",
    "Esperienza preferibile": "Erfahrung bevorzugt",
  },
  en: {
    // Rezeption / Front Office
    "Check-in und Check-out der Gäste": "Check-in and check-out of guests",
    "Check-in und Check out der Gäste": "Check-in and check-out of guests",
    "Betreuung und Beratung unserer Gäste": "Care and advice for our guests",
    "Betreuung der Gäste": "Guest care",
    "allfällige Arbeiten an der Rezeption": "various reception tasks",
    "Arbeiten an der Rezeption": "Reception work",
    "Rezeptionsdienst": "Reception service",
    
    // Service / Kellner
    "Servieren am Tisch": "Serving at tables",
    "Servieren der Gäste": "Serving guests",
    "Bedienung der Gäste": "Guest service",
    "Servieren": "Serving",
    "Bedienung": "Service",
    "Vorbereitung der Tische": "Table preparation",
    "Vorbereitung der Räume": "Room preparation",
    
    // Küche
    "Lavare piatti, pentole e bicchieri": "Washing dishes, pots and glasses",
    "Spülen von Geschirr": "Washing dishes",
    "Geschirr spülen": "Wash dishes",
    "Spülen": "Washing",
    "Vorbereitung der Zutaten": "Preparation of ingredients",
    "Unterstützung der Köche": "Supporting the cooks",
    "Hilfe in der Küche": "Help in the kitchen",
    "Unterstützung in der Küche": "Kitchen support",
    "Zubereitung der Gerichte": "Preparation of dishes",
    "Hygiene und Ordnung": "Hygiene and order",
    "Küche sauber halten": "Keep kitchen clean",
    "Küche sauber und ordentlich halten": "Keep kitchen clean and tidy",
    
    // Housekeeping / Reinigung
    "Pulizie camere": "Room cleaning",
    "Reinigung der Zimmer": "Room cleaning",
    "Zimmerreinigung": "Room cleaning",
    "Vorbereitung der Zimmer": "Room preparation",
    "Bereitstellung der Dienstleistungen für Gäste": "Providing services for guests",
    "Wartung der Gemeinschaftsräume": "Maintenance of common areas",
    "Reinigung der Gemeinschaftsräume": "Cleaning of common areas",
    "Pulizia e preparazione camere": "Room cleaning and preparation",
    "Servizi per gli ospiti": "Guest services",
    "Spazi comuni": "Common areas",
    
    // Allgemein
    "Unterstützung des Teams": "Team support",
    "Zusammenarbeit mit dem Team": "Working with the team",
    "Lagerarbeit": "Warehouse work",
    "Magazzino": "Warehouse",
    "Supporto al team di cucina": "Kitchen team support",
    "Pulizia stoviglie e attrezzature da cucina": "Cleaning dishes and kitchen equipment",
    "Preparazione piatti raffinati": "Preparation of refined dishes",
    "Supporto allo chef": "Supporting the chef",
    "Organizzazione cucina": "Kitchen organization",
    "Assistenza agli ospiti": "Guest assistance",
    "Preparazione sala": "Room preparation",
    
    // Zusätzliche italienische Phrasen aus Dummy-Jobs
    "Aiutare i cuochi quando serve": "Helping the cooks when needed",
    "Tenere la cucina ordinata": "Keep the kitchen tidy",
    "Collaborare con il team": "Working with the team",
    "Preparazione ingredienti": "Preparation of ingredients",
    "Supporto ai cuochi": "Supporting the cooks",
    "Pulizie e servizio": "Cleaning and service",
    "Supporto in cucina": "Kitchen support",
    "Lavare piatti e pentole": "Washing dishes and pots",
  },
  // Fallback für andere Sprachen - leer, verwende Original
  ar: {},
  hi: {},
  ur: {},
  tr: {},
  ro: {},
  pl: {},
  ru: {},
  zh: {},
  es: {},
  fr: {},
  pt: {},
  sq: {},
  mk: {},
  sr: {},
  hr: {},
  bs: {},
  bg: {},
  uk: {},
  bn: {},
}

/**
 * Übersetzungs-Mappings für häufige Requirement-Phrasen (DE → IT/EN)
 */
const REQUIREMENT_TRANSLATIONS: Record<Language, Record<string, string>> = {
  it: {
    // Erfahrung
    "Erfahrung": "Esperienza",
    "Erfahrung im Gastgewerbe": "Esperienza nel settore alberghiero",
    "Erfahrung im Hotelbereich": "Esperienza nel settore alberghiero",
    "Erfahrung im Service": "Esperienza nel servizio",
    "Erfahrung in der Küche": "Esperienza in cucina",
    "Erfahrung bevorzugt": "Esperienza preferibile",
    "Erfahrung erwünscht": "Esperienza preferibile",
    "Keine Erfahrung erforderlich": "Nessuna esperienza richiesta",
    "Erfahrung nicht erforderlich": "Esperienza non richiesta",
    
    // Sprachkenntnisse
    "Sprachkenntnisse": "Conoscenza lingue",
    "Deutschkenntnisse": "Conoscenza tedesco",
    "Italienischkenntnisse": "Conoscenza italiano",
    "Englischkenntnisse": "Conoscenza inglese",
    "Gute Deutschkenntnisse": "Buona conoscenza tedesco",
    "Gute Italienischkenntnisse": "Buona conoscenza italiano",
    "Gute Englischkenntnisse": "Buona conoscenza inglese",
    "Konoscenza base italiano, tedesco, inglese": "Conoscenza base italiano, tedesco, inglese",
    "Conoscenza base italiano, tedesco, inglese": "Conoscenza base italiano, tedesco, inglese",
    
    // Persönliche Eigenschaften
    "Freude am Kontakt": "Piacere nel contatto",
    "Freude am Umgang mit Menschen": "Piacere nel contatto con le persone",
    "Freude am Service": "Piacere nel servizio",
    "Pünktlichkeit": "Puntualità",
    "Zuverlässigkeit": "Affidabilità",
    "Pünktlichkeit und Zuverlässigkeit": "Puntualità e affidabilità",
    "Essere puntuale e affidabile": "Essere puntuale e affidabile",
    "Affidabilità e puntualità": "Affidabilità e puntualità",
    "Gute Präsenz": "Buona presenza",
    "Buona presenza": "Buona presenza",
    "Kommunikationsfähigkeit": "Capacità comunicative",
    "Comunicazione efficace": "Comunicazione efficace",
    "Teamfähigkeit": "Spirito di squadra",
    "Spirito di squadra": "Spirito di squadra",
    "Flexibilität": "Flessibilità",
    "Flessibilità e adattabilità": "Flessibilità e adattabilità",
    "Fleiß": "Voglia di lavorare",
    "Voglia di lavorare": "Voglia di lavorare",
    "Voglia di lavorare e imparare": "Voglia di lavorare e imparare",
    "Voglia di imparare": "Voglia di imparare",
    "Lernbereitschaft": "Voglia di imparare",
    
    // Arbeitszeiten
    "Flexible Arbeitszeiten": "Orari flessibili",
    "Orari flessibili": "Orari flessibili",
    "Orari flessibili (anche weekend)": "Orari flessibili (anche weekend)",
    "Bereitschaft für Wochenenden": "Disponibilità per weekend",
    "Disponibilità per weekend": "Disponibilità per weekend",
    "Bereitschaft für Abendschichten": "Disponibilità per turni serali",
    "Disponibilità per turni serali": "Disponibilità per turni serali",
    "Bereitschaft für Abend- und Wochenendschichten": "Disponibilità per turni serali e weekend",
    "Disponibilità turni serali e weekend": "Disponibilità turni serali e weekend",
    "Disponibilità weekend e serali": "Disponibilità weekend e serali",
    "Bereitschaft für die gesamte Saison": "Disponibilità per stagione completa",
    "Disponibilità per stagione completa": "Disponibilità per stagione completa",
    
    // Körperliche Anforderungen
    "Gute körperliche Verfassung": "Buona salute fisica",
    "Buona salute fisica": "Buona salute fisica",
    "Gute körperliche Belastbarkeit": "Buona resistenza fisica",
    "Buona resistenza fisica": "Buona resistenza fisica",
    "Körperliche Belastbarkeit": "Resistenza fisica",
    
    // Fachkenntnisse
    "Genauigkeit": "Precisione",
    "Precisione e attenzione ai dettagli": "Precisione e attenzione ai dettagli",
    "Precisione e cura dei dettagli": "Precisione e cura dei dettagli",
    "Aufmerksamkeit für Details": "Attenzione ai dettagli",
    "Gute Arbeitsorganisation": "Buona organizzazione del lavoro",
    "Buona organizzazione del lavoro": "Buona organizzazione del lavoro",
    "HACCP-Kenntnisse": "Conoscenza norme igieniche HACCP",
    "Conoscenza norme igieniche HACCP": "Conoscenza norme igieniche HACCP",
    "HACCP-Zertifikat": "Certificato HACCP",
    "Certificato HACCP": "Certificato HACCP",
    "Kochkenntnisse": "Conoscenza cucina",
    "Interesse per la cucina": "Interesse per la cucina",
    "Passione per la cucina": "Passione per la cucina",
    "Grundkenntnisse in der Küche": "Conoscenza base in cucina",
    "Conoscenza tecniche di base": "Conoscenza tecniche di base",
    
    // Erfahrungslevel
    "Anfänger": "Principiante",
    "Principiante": "Principiante",
    "1-2 Jahre Erfahrung": "1-2 anni esperienza",
    "1-2 anni": "1-2 anni",
    "1-2 anni preferibili": "1-2 anni preferibili",
    "Mindestens 2 Jahre Erfahrung": "Esperienza minima 2 anni",
    "Esperienza minima 2 anni in cucina": "Esperienza minima 2 anni in cucina",
    "2-3 Jahre Erfahrung": "2-3 anni esperienza",
    "2-3 anni": "2-3 anni",
    
    // Zusätzliche italienische Phrasen aus Dummy-Jobs
    "Esperienza nel settore alberghiero (preferibile)": "Esperienza nel settore alberghiero (preferibile)",
    "Esperienza base in cucina": "Esperienza base in cucina",
    "Esperienza preferibile": "Esperienza preferibile",
  },
  de: {
    // Deutsche Originale bleiben gleich (Identity-Mapping)
    // Zusätzlich: Übersetzungen für italienische Phrasen
    "Esperienza nel settore alberghiero (preferibile)": "Erfahrung im Gastgewerbe (bevorzugt)",
    "Esperienza base in cucina": "Grundkenntnisse in der Küche",
    "Esperienza preferibile": "Erfahrung bevorzugt",
  },
  en: {
    // Erfahrung
    "Erfahrung": "Experience",
    "Erfahrung im Gastgewerbe": "Experience in hospitality",
    "Erfahrung im Hotelbereich": "Experience in hotel sector",
    "Erfahrung im Service": "Service experience",
    "Erfahrung in der Küche": "Kitchen experience",
    "Erfahrung bevorzugt": "Experience preferred",
    "Erfahrung erwünscht": "Experience preferred",
    "Keine Erfahrung erforderlich": "No experience required",
    "Erfahrung nicht erforderlich": "No experience required",
    
    // Sprachkenntnisse
    "Sprachkenntnisse": "Language skills",
    "Deutschkenntnisse": "German skills",
    "Italienischkenntnisse": "Italian skills",
    "Englischkenntnisse": "English skills",
    "Gute Deutschkenntnisse": "Good German skills",
    "Gute Italienischkenntnisse": "Good Italian skills",
    "Gute Englischkenntnisse": "Good English skills",
    "Konoscenza base italiano, tedesco, inglese": "Basic knowledge Italian, German, English",
    "Conoscenza base italiano, tedesco, inglese": "Basic knowledge Italian, German, English",
    
    // Persönliche Eigenschaften
    "Freude am Kontakt": "Enjoyment of contact",
    "Freude am Umgang mit Menschen": "Enjoyment of working with people",
    "Freude am Service": "Enjoyment of service",
    "Pünktlichkeit": "Punctuality",
    "Zuverlässigkeit": "Reliability",
    "Pünktlichkeit und Zuverlässigkeit": "Punctuality and reliability",
    "Essere puntuale e affidabile": "Be punctual and reliable",
    "Affidabilità e puntualità": "Reliability and punctuality",
    "Gute Präsenz": "Good presence",
    "Buona presenza": "Good presence",
    "Kommunikationsfähigkeit": "Communication skills",
    "Comunicazione efficace": "Effective communication",
    "Teamfähigkeit": "Team spirit",
    "Spirito di squadra": "Team spirit",
    "Flexibilität": "Flexibility",
    "Flessibilità e adattabilità": "Flexibility and adaptability",
    "Fleiß": "Willingness to work",
    "Voglia di lavorare": "Willingness to work",
    "Voglia di lavorare e imparare": "Willingness to work and learn",
    "Voglia di imparare": "Willingness to learn",
    "Lernbereitschaft": "Willingness to learn",
    
    // Arbeitszeiten
    "Flexible Arbeitszeiten": "Flexible hours",
    "Orari flessibili": "Flexible hours",
    "Orari flessibili (anche weekend)": "Flexible hours (including weekends)",
    "Bereitschaft für Wochenenden": "Weekend availability",
    "Disponibilità per weekend": "Weekend availability",
    "Bereitschaft für Abendschichten": "Evening shift availability",
    "Disponibilità per turni serali": "Evening shift availability",
    "Bereitschaft für Abend- und Wochenendschichten": "Evening and weekend shift availability",
    "Disponibilità turni serali e weekend": "Evening and weekend shift availability",
    "Disponibilità weekend e serali": "Weekend and evening availability",
    "Bereitschaft für die gesamte Saison": "Full season availability",
    "Disponibilità per stagione completa": "Full season availability",
    
    // Körperliche Anforderungen
    "Gute körperliche Verfassung": "Good physical health",
    "Buona salute fisica": "Good physical health",
    "Gute körperliche Belastbarkeit": "Good physical stamina",
    "Buona resistenza fisica": "Good physical stamina",
    "Körperliche Belastbarkeit": "Physical stamina",
    
    // Fachkenntnisse
    "Genauigkeit": "Accuracy",
    "Precisione e attenzione ai dettagli": "Precision and attention to detail",
    "Precisione e cura dei dettagli": "Precision and care for details",
    "Aufmerksamkeit für Details": "Attention to detail",
    "Gute Arbeitsorganisation": "Good work organization",
    "Buona organizzazione del lavoro": "Good work organization",
    "HACCP-Kenntnisse": "HACCP knowledge",
    "Conoscenza norme igieniche HACCP": "HACCP hygiene knowledge",
    "HACCP-Zertifikat": "HACCP certificate",
    "Certificato HACCP": "HACCP certificate",
    "Kochkenntnisse": "Cooking knowledge",
    "Interesse per la cucina": "Interest in cooking",
    "Passione per la cucina": "Passion for cooking",
    "Grundkenntnisse in der Küche": "Basic kitchen knowledge",
    "Conoscenza tecniche di base": "Basic technical knowledge",
    
    // Erfahrungslevel
    "Anfänger": "Beginner",
    "Principiante": "Beginner",
    "1-2 Jahre Erfahrung": "1-2 years experience",
    "1-2 anni": "1-2 years",
    "1-2 anni preferibili": "1-2 years preferred",
    "Mindestens 2 Jahre Erfahrung": "Minimum 2 years experience",
    "Esperienza minima 2 anni in cucina": "Minimum 2 years kitchen experience",
    "2-3 Jahre Erfahrung": "2-3 years experience",
    "2-3 anni": "2-3 years",
    
    // Zusätzliche italienische Phrasen aus Dummy-Jobs
    "Esperienza nel settore alberghiero (preferibile)": "Experience in hospitality (preferred)",
    "Esperienza base in cucina": "Basic kitchen experience",
    "Esperienza preferibile": "Experience preferred",
  },
  // Fallback für andere Sprachen - leer, verwende Original
  ar: {},
  hi: {},
  ur: {},
  tr: {},
  ro: {},
  pl: {},
  ru: {},
  zh: {},
  es: {},
  fr: {},
  pt: {},
  sq: {},
  mk: {},
  sr: {},
  hr: {},
  bs: {},
  bg: {},
  uk: {},
  bn: {},
}

/**
 * Übersetzt einen einzelnen Task-String basierend auf der ausgewählten Sprache
 * 
 * @param task Der zu übersetzende Task-String
 * @param language Die Zielsprache
 * @returns Der übersetzte Task oder der Original-Task als Fallback
 */
function translateTask(task: string, language: Language): string {
  if (!task || !task.trim()) return task
  
  const langTranslations = TASK_TRANSLATIONS[language] || {}
  
  // Exakter Match
  if (langTranslations[task]) {
    return langTranslations[task]
  }
  
  // Fallback: Original
  return task
}

/**
 * Übersetzt einen einzelnen Requirement-String basierend auf der ausgewählten Sprache
 * 
 * @param requirement Der zu übersetzende Requirement-String
 * @param language Die Zielsprache
 * @returns Der übersetzte Requirement oder der Original-Requirement als Fallback
 */
function translateRequirement(requirement: string, language: Language): string {
  if (!requirement || !requirement.trim()) return requirement
  
  const langTranslations = REQUIREMENT_TRANSLATIONS[language] || {}
  
  // Exakter Match
  if (langTranslations[requirement]) {
    return langTranslations[requirement]
  }
  
  // Fallback: Original
  return requirement
}

/**
 * Übersetzt Job-Aufgaben (Tasks) basierend auf der ausgewählten Sprache
 * 
 * @param job Der Job
 * @param language Die Zielsprache
 * @returns Die übersetzten Tasks oder die Original-Tasks als Fallback
 */
export function getTranslatedTasks(job: Job, language: Language): string[] {
  if (!job.tasks || job.tasks.length === 0) {
    return []
  }
  
  // Übersetze jeden Task einzeln
  return job.tasks.map(task => translateTask(task, language))
}

/**
 * Übersetzt Job-Anforderungen (Requirements) basierend auf der ausgewählten Sprache
 * 
 * @param job Der Job
 * @param language Die Zielsprache
 * @returns Die übersetzten Requirements oder die Original-Requirements als Fallback
 */
export function getTranslatedRequirements(job: Job, language: Language): string[] {
  if (!job.requirements || job.requirements.length === 0) {
    return []
  }
  
  // Übersetze jeden Requirement einzeln
  return job.requirements.map(requirement => translateRequirement(requirement, language))
}

/**
 * Übersetzt alle Job-Inhalte basierend auf der ausgewählten Sprache
 * 
 * Nutzt Caching für Performance-Optimierung.
 * 
 * @param job Der Job
 * @param language Die Zielsprache
 * @returns Ein TranslatedJob-Objekt mit übersetzten Feldern
 */
export function translateJobContent(job: Job, language: Language): TranslatedJob {
  // Cache-Key: job.id + language
  const cacheKey = `${job.id}-${language}`
  
  // Prüfe Cache
  const cached = translationCache.get(cacheKey)
  if (cached) {
    return cached
  }
  
  // Übersetze alle Felder
  const translated: TranslatedJob = {
    title: getTranslatedJobTitle(job, language),
    tasks: getTranslatedTasks(job, language),
    requirements: getTranslatedRequirements(job, language),
  }
  
  // Speichere im Cache
  translationCache.set(cacheKey, translated)
  
  return translated
}

/**
 * Übersetzt employmentType-Werte (z.B. "Vollzeit, Teilzeit" → "Tempo pieno, Tempo parziale")
 * 
 * @param employmentType Der Original-employmentType-String
 * @param language Die Zielsprache
 * @returns Der übersetzte employmentType-String
 */
export function translateEmploymentType(employmentType: string, language: Language): string {
  if (!employmentType) return employmentType
  
  const lower = employmentType.toLowerCase()
  
  // Mapping für verschiedene Sprachen
  const translations: Record<Language, Record<string, string>> = {
    it: {
      "vollzeit": "Tempo pieno",
      "full-time": "Tempo pieno",
      "fulltime": "Tempo pieno",
      "tempo pieno": "Tempo pieno",
      "teilzeit": "Tempo parziale",
      "part-time": "Tempo parziale",
      "parttime": "Tempo parziale",
      "tempo parziale": "Tempo parziale",
    },
    de: {
      "vollzeit": "Vollzeit",
      "full-time": "Vollzeit",
      "fulltime": "Vollzeit",
      "tempo pieno": "Vollzeit",
      "teilzeit": "Teilzeit",
      "part-time": "Teilzeit",
      "parttime": "Teilzeit",
      "tempo parziale": "Teilzeit",
    },
    en: {
      "vollzeit": "Full-time",
      "full-time": "Full-time",
      "fulltime": "Full-time",
      "tempo pieno": "Full-time",
      "teilzeit": "Part-time",
      "part-time": "Part-time",
      "parttime": "Part-time",
      "tempo parziale": "Part-time",
    },
    // Fallback für andere Sprachen - verwende Original
    ar: {},
    hi: {},
    ur: {},
    tr: {},
    ro: {},
    pl: {},
    ru: {},
    zh: {},
    es: {},
    fr: {},
    pt: {},
    sq: {},
    mk: {},
    sr: {},
    hr: {},
    bs: {},
    bg: {},
    uk: {},
    bn: {},
  }
  
  const langTranslations = translations[language] || {}
  
  // Wenn der String mehrere Werte enthält (z.B. "Vollzeit, Teilzeit")
  if (lower.includes(",")) {
    return employmentType
      .split(",")
      .map((part) => {
        const trimmed = part.trim().toLowerCase()
        return langTranslations[trimmed] || part.trim()
      })
      .join(", ")
  }
  
  // Einzelner Wert
  const translated = langTranslations[lower]
  return translated || employmentType
}

/**
 * Löscht den Translation-Cache (nützlich für Tests oder wenn Jobs aktualisiert wurden)
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}
