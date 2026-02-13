# Job*Radar - Arbeit finden in Südtirol

Eine moderne Next.js-Anwendung zur Jobsuche in Südtirol, speziell für den Bereich Hotels, Gastronomie und Service.

## Technologie-Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS 4
- **Komponenten**: shadcn/ui (New York Style)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Package Manager**: pnpm
- **TypeScript**: Strict Mode

## Features

- 🎯 Job-Suche mit Filtern (Job-Typ, Zeitraum, Ort)
- 🌍 Mehrsprachigkeit (Deutsch, Italienisch, Englisch und weitere Sprachen)
- 📱 Responsive Design
- 🎨 Moderne UI mit Tailwind CSS 4
- 🔍 Detaillierte Job-Informationen
- 📞 Direkter Kontakt zu Arbeitgebern

## Setup

### Voraussetzungen

- Node.js 18+ 
- pnpm (empfohlen) oder npm/yarn

### Installation

1. Dependencies installieren:
```bash
pnpm install
```

2. Development-Server starten:
```bash
pnpm dev
```

3. Öffne [http://localhost:3000](http://localhost:3000) im Browser

### Verfügbare Scripts

- `pnpm dev` - Startet den Development-Server
- `pnpm build` - Erstellt eine Production-Build
- `pnpm start` - Startet den Production-Server
- `pnpm lint` - Führt ESLint aus

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root Layout
│   ├── page.tsx           # Startseite
│   ├── jobs/              # Jobs-Seite
│   └── globals.css        # Globale Styles
├── components/            # React Komponenten
│   ├── ui/               # shadcn/ui Komponenten
│   ├── job-card.tsx      # Job-Karte Komponente
│   ├── job-list.tsx      # Job-Liste Komponente
│   └── job-filters.tsx   # Filter-Komponente
├── lib/                   # Utility-Funktionen
│   ├── data/             # Dummy-Daten
│   │   └── dummy-jobs.ts # 10 Dummy-Job-Datensätze
│   └── utils.ts          # Utility-Funktionen
├── hooks/                # Custom Hooks
├── public/               # Statische Assets
└── styles/               # Zusätzliche Styles (falls vorhanden)
```

## Dummy-Daten

Die Anwendung verwendet aktuell Dummy-Daten aus `lib/data/dummy-jobs.ts`. Diese enthalten 10 realistische Job-Datensätze für verschiedene Job-Typen:

- **Abspüler** (dishwasher): 3 Jobs
- **Hotel/Housekeeping** (housekeeping): 2 Jobs
- **Hilfsarbeiter** (helper): 2 Jobs
- **Küche** (kitchen): 2 Jobs
- **Service** (service): 1 Job

## Nächste Schritte

- [ ] MongoDB Integration für echte Datenbank-Anbindung
- [ ] Daten aus BEC exportieren und in MongoDB importieren
- [ ] Internationalisierung vervollständigen
- [ ] Tests hinzufügen
- [ ] Weitere Features entwickeln

## Lizenz

Private Projekt - bcoop

