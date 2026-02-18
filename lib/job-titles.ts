import type { Language } from "@/components/language-provider"

export interface Job {
  id: number
  titleIt: string         // Titel auf Italienisch
  titleDe: string         // Titel auf Deutsch
  titleEn: string         // Titel auf Englisch
  it: string              // Kurze Beschreibung auf Italienisch
  de: string              // Kurze Beschreibung auf Deutsch
  en: string              // Kurze Beschreibung auf Englisch
  aliases: string[]       // Versteckte Suchbegriffe
}

export const jobTitles: Job[] = [
  // CUCINA (5)
  {
    id: 1,
    titleIt: "Cuoco/a",
    titleDe: "Koch/Köchin",
    titleEn: "Cook",
    it: "Cucinare i piatti",
    de: "Gerichte zubereiten",
    en: "Prepare dishes",
    aliases: ["chef", "cuoco", "cuoca", "koch", "köchin", "cook", "kitchen chef", "chef de cuisine", "cucina", "küche", "cooker"]
  },
  {
    id: 2,
    titleIt: "Aiuto in cucina",
    titleDe: "Küchenhilfe",
    titleEn: "Kitchen helper",
    it: "Aiutare in cucina",
    de: "In der Küche helfen",
    en: "Help in the kitchen",
    aliases: ["aiuto cuoco", "commis", "commis di cucina", "commis de cuisine", "küchenhilfe", "kitchen assistant", "kitchen aid", "aiuto cucina", "kitchen helper", "küchengehilfe"]
  },
  {
    id: 3,
    titleIt: "Pizzaiolo",
    titleDe: "Pizzabäcker/in",
    titleEn: "Pizza maker",
    it: "Preparare la pizza",
    de: "Pizza zubereiten",
    en: "Prepare pizza",
    aliases: ["pizzaiolo", "pizzabäcker", "pizzabäckerin", "pizza maker", "pizza baker", "pizzeria"]
  },
  {
    id: 4,
    titleIt: "Pasticcere/a",
    titleDe: "Konditor/in",
    titleEn: "Pastry chef",
    it: "Fare dolci e torte",
    de: "Kuchen und Torten machen",
    en: "Make cakes and pastries",
    aliases: ["pasticcere", "pasticcera", "patissier", "konditor", "konditorin", "confectioner", "baker", "bäcker", "bäckerin", "dolci", "torte"]
  },
  {
    id: 5,
    titleIt: "Lavapiatti",
    titleDe: "Tellerwäscher/in",
    titleEn: "Dishwasher",
    it: "Lavare i piatti",
    de: "Geschirr spülen",
    en: "Wash dishes",
    aliases: ["lavapiatti", "spüler", "dishwasher", "plongeur", "spülkraft", "lavastoviglie", "spülhilfe", "spülmaschine"]
  },
  
  // SALA & BAR (3)
  {
    id: 6,
    titleIt: "Cameriere/a",
    titleDe: "Kellner/in",
    titleEn: "Waiter/Waitress",
    it: "Servire ai tavoli",
    de: "An Tischen bedienen",
    en: "Serve at tables",
    aliases: ["cameriere", "cameriera", "chef de rang", "chef de salle", "maitre", "kellner", "kellnerin", "waiter", "waitress", "servizio sala", "servizio", "bedienung", "servizio ai tavoli", "server"]
  },
  {
    id: 7,
    titleIt: "Barista",
    titleDe: "Barista",
    titleEn: "Barista",
    it: "Preparare caffè e bevande",
    de: "Kaffee und Getränke zubereiten",
    en: "Prepare coffee and drinks",
    aliases: ["barista", "caffè", "kaffee", "coffee", "barman", "bartender", "bar", "caffettiera", "mixologist", "barista"]
  },
  {
    id: 8,
    titleIt: "Sommelier",
    titleDe: "Sommelier",
    titleEn: "Sommelier",
    it: "Consigliare e servire vino",
    de: "Wein beraten und servieren",
    en: "Advise and serve wine",
    aliases: ["sommelier", "weinkellner", "wine waiter", "wine steward", "vino", "wein", "wine"]
  },
  
  // HOTEL (6)
  {
    id: 9,
    titleIt: "Receptionist",
    titleDe: "Rezeptionist/in",
    titleEn: "Receptionist",
    it: "Accogliere i clienti",
    de: "Gäste empfangen",
    en: "Welcome guests",
    aliases: ["receptionist", "reception", "empfang", "accoglienza", "front desk", "concierge", "rezeption", "ricevimento", "night auditor", "front office"]
  },
  {
    id: 10,
    titleIt: "Pulizie",
    titleDe: "Reinigungskraft",
    titleEn: "Cleaning staff",
    it: "Pulire le stanze",
    de: "Räume reinigen",
    en: "Clean rooms",
    aliases: ["pulizie", "housekeeping", "reinigung", "cleaning", "addetto pulizie", "reinigungsfachkraft", "pulizia", "addetto alle pulizie", "room service", "zimmermadchen", "roomboy", "room girl"]
  },
  {
    id: 11,
    titleIt: "Facchino",
    titleDe: "Gepäckträger/in",
    titleEn: "Porter",
    it: "Portare i bagagli",
    de: "Gepäck tragen",
    en: "Carry luggage",
    aliases: ["facchino", "gepäckträger", "gepäckträgerin", "porter", "bagaglio", "baggage", "träger", "bellboy", "bellhop"]
  },
  {
    id: 12,
    titleIt: "Portiere",
    titleDe: "Portier/in",
    titleEn: "Doorman/Concierge",
    it: "Sorvegliare l'ingresso",
    de: "Eingang überwachen",
    en: "Guard the entrance",
    aliases: ["portiere", "portier", "portierin", "doorman", "concierge", "portineria", "portier"]
  },
  {
    id: 13,
    titleIt: "Bagnino",
    titleDe: "Bademeister/in",
    titleEn: "Lifeguard",
    it: "Sorvegliare la piscina",
    de: "Schwimmbad überwachen",
    en: "Supervise pool",
    aliases: ["bagnino", "bademeister", "bademeisterin", "lifeguard", "rettungsschwimmer", "soccorritore acquatico", "pool attendant"]
  },
  {
    id: 14,
    titleIt: "Animatore/trice",
    titleDe: "Animateur/in",
    titleEn: "Entertainment staff",
    it: "Organizzare attività per i clienti",
    de: "Aktivitäten für Gäste organisieren",
    en: "Organize activities for guests",
    aliases: ["animatore", "animatrice", "animator", "aktivitäten", "activities", "entertainment", "unterhaltung", "animazione"]
  },
  
  // EDILIZIA & ARTIGIANATO (7)
  {
    id: 15,
    titleIt: "Muratore",
    titleDe: "Maurer/in",
    titleEn: "Mason",
    it: "Costruire muri e case",
    de: "Mauern und Häuser bauen",
    en: "Build walls and houses",
    aliases: ["muratore", "bauarbeiter", "construction worker", "mason", "maurer", "mauer", "costruzione", "bau"]
  },
  {
    id: 16,
    titleIt: "Imbianchino",
    titleDe: "Maler/in",
    titleEn: "Painter",
    it: "Verniciare pareti",
    de: "Wände streichen",
    en: "Paint walls",
    aliases: ["imbianchino", "maler", "malerin", "painter", "streichen", "verniciare", "pittore", "anstreicher"]
  },
  {
    id: 17,
    titleIt: "Elettricista",
    titleDe: "Elektriker/in",
    titleEn: "Electrician",
    it: "Installare e riparare elettricità",
    de: "Strom installieren und reparieren",
    en: "Install and repair electricity",
    aliases: ["elettricista", "elektriker", "elektrikerin", "electrician", "elektro", "elektrizität", "electricity"]
  },
  {
    id: 18,
    titleIt: "Idraulico",
    titleDe: "Klempner/in",
    titleEn: "Plumber",
    it: "Riparare tubi e rubinetti",
    de: "Rohre und Wasserhähne reparieren",
    en: "Repair pipes and taps",
    aliases: ["idraulico", "klempner", "klempnerin", "plumber", "rohre", "tubi", "wasser", "water"]
  },
  {
    id: 19,
    titleIt: "Falegname",
    titleDe: "Tischler/in",
    titleEn: "Carpenter",
    it: "Lavorare il legno",
    de: "Mit Holz arbeiten",
    en: "Work with wood",
    aliases: ["falegname", "tischler", "tischlerin", "carpenter", "schreiner", "schreinerin", "holz", "wood", "legno"]
  },
  {
    id: 20,
    titleIt: "Saldatore",
    titleDe: "Schweißer/in",
    titleEn: "Welder",
    it: "Unire metalli con il fuoco",
    de: "Metalle mit Feuer verbinden",
    en: "Join metals with fire",
    aliases: ["saldatore", "schweißer", "schweißerin", "welder", "schweißen", "saldare", "metall", "metal"]
  },
  {
    id: 21,
    titleIt: "Piastrellista",
    titleDe: "Fliesenleger/in",
    titleEn: "Tiler",
    it: "Mettere piastrelle",
    de: "Fliesen legen",
    en: "Lay tiles",
    aliases: ["piastrellista", "fliesenleger", "fliesenlegerin", "tiler", "piastrelle", "fliesen", "tiles"]
  },
  
  // AGRICOLTURA (2)
  {
    id: 22,
    titleIt: "Lavoro in campagna",
    titleDe: "Feldarbeit",
    titleEn: "Field work",
    it: "Lavorare nei campi",
    de: "Auf dem Feld arbeiten",
    en: "Work in the fields",
    aliases: ["lavoro in campagna", "bracciante", "erntehelfer", "erntehelferin", "field worker", "agricoltura", "landwirtschaft", "agriculture", "apfelernte", "vendemmia", "trauben", "grapes", "obst", "fruit"]
  },
  {
    id: 23,
    titleIt: "Giardiniere",
    titleDe: "Gärtner/in",
    titleEn: "Gardener",
    it: "Curare il giardino",
    de: "Garten pflegen",
    en: "Take care of the garden",
    aliases: ["giardiniere", "gärtner", "gärtnerin", "gardener", "giardino", "garten", "landscaper", "landschaftsgärtner"]
  },
  
  // VENDITA (2)
  {
    id: 24,
    titleIt: "Commesso/a",
    titleDe: "Verkäufer/in",
    titleEn: "Salesperson",
    it: "Vendere prodotti",
    de: "Produkte verkaufen",
    en: "Sell products",
    aliases: ["commesso", "commessa", "verkäufer", "verkäuferin", "salesperson", "verkauf", "vendita", "sales", "shop assistant", "ladenverkäufer"]
  },
  {
    id: 25,
    titleIt: "Magazziniere",
    titleDe: "Lagerarbeiter/in",
    titleEn: "Warehouse worker",
    it: "Organizzare e consegnare merci",
    de: "Waren organisieren und ausliefern",
    en: "Organize and deliver goods",
    aliases: ["magazziniere", "lagerarbeiter", "lagerarbeiterin", "warehouse worker", "lager", "warehouse", "magazzino", "stock"]
  },
  
  // TRASPORTO (3)
  {
    id: 26,
    titleIt: "Autista",
    titleDe: "Fahrer/in",
    titleEn: "Driver",
    it: "Guidare macchine",
    de: "Autos fahren",
    en: "Drive cars",
    aliases: ["autista", "fahrer", "fahrerin", "driver", "chauffeur", "autofahrer", "macchina", "auto", "car"]
  },
  {
    id: 27,
    titleIt: "Corriere",
    titleDe: "Kurier/in",
    titleEn: "Courier",
    it: "Consegnare pacchi",
    de: "Pakete ausliefern",
    en: "Deliver packages",
    aliases: ["corriere", "kurier", "kurierin", "courier", "paketbote", "paketbotin", "pacco", "paket", "package", "delivery"]
  },
  {
    id: 28,
    titleIt: "Traslochi",
    titleDe: "Umzugshelfer/in",
    titleEn: "Mover",
    it: "Spostare mobili",
    de: "Möbel transportieren",
    en: "Move furniture",
    aliases: ["traslochi", "umzug", "mover", "umzugshelfer", "umzugshelferin", "mobili", "furniture", "möbel", "moving"]
  },
  
  // CURA & SALUTE (3)
  {
    id: 29,
    titleIt: "Badante",
    titleDe: "Pfleger/in",
    titleEn: "Caregiver",
    it: "Aiutare persone anziane",
    de: "Älteren Menschen helfen",
    en: "Help elderly people",
    aliases: ["badante", "pfleger", "pflegerin", "caregiver", "altenpfleger", "altenpflegerin", "anziani", "elderly", "senioren"]
  },
  {
    id: 30,
    titleIt: "Baby-sitter",
    titleDe: "Babysitter",
    titleEn: "Babysitter",
    it: "Accudire bambini",
    de: "Kinder betreuen",
    en: "Take care of children",
    aliases: ["baby-sitter", "babysitter", "kinderbetreuung", "childcare", "bambini", "children", "kinder", "nanny", "tagesmutter"]
  },
  {
    id: 31,
    titleIt: "Aiuto in casa",
    titleDe: "Haushaltshilfe",
    titleEn: "Housekeeper",
    it: "Aiutare nelle faccende domestiche",
    de: "Bei Hausarbeiten helfen",
    en: "Help with housework",
    aliases: ["aiuto in casa", "colf", "collaboratrice domestica", "haushaltshilfe", "housekeeper", "hausarbeit", "housework", "domestica", "hausfrau"]
  },
  
  // WELLNESS & SPA (2)
  {
    id: 32,
    titleIt: "Massaggiatore/trice",
    titleDe: "Masseur/in",
    titleEn: "Massage therapist",
    it: "Fare massaggi",
    de: "Massagen machen",
    en: "Give massages",
    aliases: ["massaggiatore", "massaggiatrice", "masseur", "masseurin", "masseuse", "massage", "massaggio", "wellness"]
  },
  {
    id: 33,
    titleIt: "Estetista",
    titleDe: "Kosmetiker/in",
    titleEn: "Beautician",
    it: "Curare bellezza e benessere",
    de: "Schönheit und Wohlbefinden pflegen",
    en: "Take care of beauty and wellness",
    aliases: ["estetista", "kosmetiker", "kosmetikerin", "beautician", "kosmetik", "beauty", "bellezza", "schönheit"]
  },
  
  // MONTAGNA & SCI (4)
  {
    id: 34,
    titleIt: "Maestro di sci",
    titleDe: "Skilehrer/in",
    titleEn: "Ski instructor",
    it: "Insegnare a sciare",
    de: "Skifahren beibringen",
    en: "Teach skiing",
    aliases: ["maestro di sci", "skilehrer", "skilehrerin", "ski instructor", "sci", "ski", "schifahren", "skiing"]
  },
  {
    id: 35,
    titleIt: "Noleggio sci",
    titleDe: "Ski-Verleih",
    titleEn: "Ski rental",
    it: "Affittare attrezzatura sciistica",
    de: "Skiausrüstung vermieten",
    en: "Rent ski equipment",
    aliases: ["noleggio sci", "ski verleih", "ski rental", "attrezzatura", "equipment", "ausrüstung", "sci", "ski"]
  },
  {
    id: 36,
    titleIt: "Impianti a fune",
    titleDe: "Seilbahn",
    titleEn: "Cable car operator",
    it: "Lavorare alle seggiovie",
    de: "An Seilbahnen arbeiten",
    en: "Work at cable cars",
    aliases: ["impianti a fune", "seilbahn", "cable car", "seggiovia", "lift", "lifte", "skilift", "gondola"]
  },
  {
    id: 37,
    titleIt: "Lavoro in malga",
    titleDe: "Alm-Arbeit",
    titleEn: "Alpine work",
    it: "Lavorare in montagna con animali",
    de: "In den Bergen mit Tieren arbeiten",
    en: "Work in the mountains with animals",
    aliases: ["lavoro in malga", "alm", "alpeggio", "bergarbeit", "mountain work", "malga", "alpe", "berg", "mountain"]
  },
  
  // SALUTE (2)
  {
    id: 38,
    titleIt: "Infermiere/a",
    titleDe: "Krankenpfleger/in",
    titleEn: "Nurse",
    it: "Assistere i pazienti",
    de: "Kranke pflegen",
    en: "Care for patients",
    aliases: ["infermiere", "infermiera", "krankenpfleger", "krankenpflegerin", "nurse", "pflegekraft", "pfleger", "pflegerin", "krankenschwester", "oss", "operatore socio sanitario"]
  },
  {
    id: 39,
    titleIt: "Aiuto in ospedale",
    titleDe: "Krankenhaushilfe",
    titleEn: "Hospital helper",
    it: "Aiutare in ospedale",
    de: "Im Krankenhaus helfen",
    en: "Help in hospital",
    aliases: ["aiuto in ospedale", "krankenhaushilfe", "hospital helper", "ospedale", "hospital", "krankenhaus", "sanitäter"]
  },
  
  // UFFICIO (1)
  {
    id: 40,
    titleIt: "Lavoro in ufficio",
    titleDe: "Büroarbeit",
    titleEn: "Office work",
    it: "Lavorare al computer",
    de: "Am Computer arbeiten",
    en: "Work at computer",
    aliases: ["lavoro in ufficio", "ufficio", "office", "büro", "computer", "schreibtisch", "desk", "administrativo", "verwaltung"]
  },
  
  // SICUREZZA (1)
  {
    id: 41,
    titleIt: "Guardia",
    titleDe: "Wächter/in",
    titleEn: "Guard",
    it: "Sorvegliare e proteggere",
    de: "Überwachen und schützen",
    en: "Watch and protect",
    aliases: ["guardia", "wächter", "wächterin", "guard", "security", "sicherheit", "sorveglianza", "wachdienst", "sicherheitsdienst"]
  },
  
  // ALTRO (7)
  {
    id: 42,
    titleIt: "Operaio/a",
    titleDe: "Arbeiter/in",
    titleEn: "Worker",
    it: "Lavoro manuale generico",
    de: "Allgemeine Handarbeit",
    en: "General manual work",
    aliases: ["operaio", "operaia", "arbeiter", "arbeiterin", "worker", "lavoratore", "arbeit", "work", "manuale", "manual"]
  },
  {
    id: 43,
    titleIt: "Tuttofare",
    titleDe: "Hausmeister/in",
    titleEn: "Handyman",
    it: "Fare diversi lavori",
    de: "Verschiedene Arbeiten machen",
    en: "Do various jobs",
    aliases: ["tuttofare", "handyman", "hausmeister", "hausmeisterin", "facility manager", "various", "verschieden", "diversi"]
  },
  {
    id: 44,
    titleIt: "Lavanderia",
    titleDe: "Wäscherei",
    titleEn: "Laundry",
    it: "Lavare e stirare vestiti",
    de: "Kleidung waschen und bügeln",
    en: "Wash and iron clothes",
    aliases: ["lavanderia", "wäscherei", "laundry", "wäsche", "clothes", "vestiti", "kleidung", "washing"]
  },
  {
    id: 45,
    titleIt: "Parrucchiere/a",
    titleDe: "Friseur/in",
    titleEn: "Hairdresser",
    it: "Tagliare e curare i capelli",
    de: "Haare schneiden und pflegen",
    en: "Cut and care for hair",
    aliases: ["parrucchiere", "parrucchiera", "friseur", "friseurin", "hairdresser", "haare", "hair", "capelli", "salon", "barbiere", "barber"]
  },
  {
    id: 46,
    titleIt: "Meccanico",
    titleDe: "Mechaniker/in",
    titleEn: "Mechanic",
    it: "Riparare macchine",
    de: "Autos reparieren",
    en: "Repair cars",
    aliases: ["meccanico", "mechaniker", "mechanikerin", "mechanic", "auto", "car", "macchina", "repair", "riparazione", "reparatur"]
  },
  {
    id: 47,
    titleIt: "Copritetto",
    titleDe: "Dachdecker/in",
    titleEn: "Roofer",
    it: "Riparare tetti",
    de: "Dächer reparieren",
    en: "Repair roofs",
    aliases: ["copritetto", "dachdecker", "dachdeckerin", "roofer", "tetto", "dach", "roof", "riparazione tetti"]
  },
  {
    id: 48,
    titleIt: "Fabbro",
    titleDe: "Schmied/in",
    titleEn: "Blacksmith",
    it: "Lavorare il ferro",
    de: "Mit Eisen arbeiten",
    en: "Work with iron",
    aliases: ["fabbro", "schmied", "schmiedin", "blacksmith", "ferro", "iron", "eisen", "metall", "metal"]
  },
]

// Helper function to get job title for current language
export function getJobTitle(jobId: number, language: Language): string | null {
  const job = jobTitles.find(j => j.id === jobId)
  if (!job) return null
  
  // Map language to supported translations, fallback to 'it' if not supported
  const supportedLanguages: Record<string, "titleIt" | "titleDe" | "titleEn"> = {
    it: "titleIt",
    de: "titleDe",
    en: "titleEn",
  }
  
  const langKey = supportedLanguages[language] || "titleIt"
  return job[langKey]
}

// Helper function to get job description for current language
export function getJobDescription(jobId: number, language: Language): string | null {
  const job = jobTitles.find(j => j.id === jobId)
  if (!job) return null
  
  // Map language to supported translations, fallback to 'it' if not supported
  const supportedLanguages: Record<string, "it" | "de" | "en"> = {
    it: "it",
    de: "de",
    en: "en",
  }
  
  const langKey = supportedLanguages[language] || "it"
  return job[langKey]
}
