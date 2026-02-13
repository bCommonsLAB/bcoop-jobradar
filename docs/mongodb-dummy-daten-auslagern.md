## Ziel

Wir wollen die bisherigen Dummy-Jobdaten (`lib/data/dummy-jobs.ts`) durch Daten aus MongoDB ersetzen. Die MongoDB-Konfiguration kommt **ausschließlich** aus diesen drei Variablen: `MONGODB_URI`, `MONGODB_DATABASE_NAME`, `MONGODB_COLLECTION_NAME`. Es soll **keine Default-/Fallback-Logik** geben (d.h. fehlende Werte sind ein Fehler).

Aktueller Ist-Zustand: `components/job-list.tsx` ist eine Client-Komponente und importiert `dummyJobs` direkt. Dadurch ist die Datenquelle aktuell „im Frontend eingebrannt“ und kann nicht serverseitig über ENV (ohne `NEXT_PUBLIC_`) konfiguriert werden.

## Lösungsvarianten

### Variante A — API-Route (Node.js) + Client-Fetch (minimal-invasiv)

- **Wie**: `app/api/jobs/route.ts` (Server) lädt Jobs aus MongoDB und liefert JSON. `components/job-list.tsx` lädt die Jobs beim Mount via `fetch("/api/jobs")` und führt anschließend das bestehende Filtering/Sorting im Client aus.
- **Vorteile**:
  - Sehr kleine Änderungen am bestehenden UI/State-Flow (Filters sind ohnehin clientseitig).
  - MongoDB-Zugriff bleibt strikt serverseitig (ENV ist nicht im Client nötig).
  - Gute Trennlinie: UI bleibt UI, DB bleibt Server.
- **Nachteile**:
  - Zusätzlicher HTTP-Hop (Client → API → DB).
  - Filtering passiert im Browser (bei sehr vielen Jobs später evtl. suboptimal).

### Variante B — Server Component lädt Jobs + Props in Client-Komponenten (performant, aber mehr Umbau)

- **Wie**: `app/jobs/page.tsx` würde serverseitig Jobs laden (MongoDB) und als Props in eine Client-Komponente geben, die dann nur noch filtert.
- **Vorteile**:
  - Kein zusätzlicher API-Hop.
  - Besseres SSR/Streaming-Potenzial.
- **Nachteile**:
  - `app/jobs/page.tsx` ist derzeit komplett clientseitig aufgebaut („use client“, viel UI-State). Das sauber zu trennen ist mehr Arbeit und erhöht das Risiko von Regressionen.

### Variante C — Serverseitige Filterung (API unterstützt Query-Parameter)

- **Wie**: `/api/jobs` akzeptiert Filter (jobTypes/timeframe/locations/...) als Query-Parameter und filtert in MongoDB.
- **Vorteile**:
  - Skaliert besser (weniger Daten zum Client, DB macht die Arbeit).
- **Nachteile**:
  - Mehr Logik und mehr Edge-Cases sofort nötig (Datum, „Subito“, Custom-Jobtypen, Sortierung).
  - Höheres Risiko, dass das Verhalten nicht 1:1 dem bisherigen UI entspricht.

## Entscheidung (für jetzt)

Wir starten mit **Variante A (API-Route + Client-Fetch)**, weil sie die **minimal notwendige Änderung** ist und das bestehende Filtering/Sorting unverändert lässt. Damit können wir schnell und risikoarm von Dummy-Daten auf eine echte Datenquelle wechseln.

Sobald die Datenmenge wächst oder wir bessere Performance brauchen, ist Variante C die natürliche Weiterentwicklung (Filter in der DB). Variante B ist ebenfalls möglich, erfordert aber ein sauberes Auftrennen der Jobs-Seite in Server/Client-Komponenten und wird daher bewusst später angegangen.

