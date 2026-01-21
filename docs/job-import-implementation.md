# Job-Import aus Website: Implementierungsentscheidungen

## Kontext

Wir implementieren den Website-Import für Jobs analog zum Session-Import aus dem anderen Projekt. Die Implementierung folgt **Variante B** (Generisches Website-Import-Modul), um Code-Duplikation zu vermeiden und gleichzeitig die Domain-Logik sauber getrennt zu halten.

## Entscheidungen

### Variante: Generisches Modul (Variante B)

**Gewählt**: Variante B - Generisches Website-Import-Modul

**Begründung**:
- Vermeidet Code-Duplikation zwischen Session- und Job-Import
- UI/Retry/Progress/Cancel-Logik wird einmalig implementiert
- Domain-spezifisches Mapping bleibt klar getrennt
- Refactoring-Aufwand ist lokal begrenzt und überschaubar

**Struktur**:
- Generische Secretary-Integration (Client, Adapter, API-Proxy)
- Job-spezifisches Mapping-Modul (`lib/job-import/mapper.ts`)
- Job-spezifische UI-Komponenten (`components/job-import/`)
- Eigener API-Endpoint (`POST /api/jobs`)

## Template-Verwaltung

**WICHTIG**: Die Templates werden **lokal aus dem `templates/` Verzeichnis** geladen und als `template_content` an den Secretary Service gesendet. Sie müssen nicht auf dem Secretary Service existieren.

### Single Import
- **Template-Datei**: `templates/ExtractJobDataFromWebsite.md`
- **Lader-Funktion**: `loadJobDataTemplate()` in `lib/templates/template-loader.ts`
- **Struktur**: Erwartet ein Objekt mit Job-Datenfeldern
- **Verwendung**: Wird automatisch geladen, wenn `template: 'ExtractJobDataFromWebsite'` verwendet wird

### Batch Import
- **Template-Datei**: `templates/ExtractJobListFromWebsite.md`
- **Lader-Funktion**: `loadJobListTemplate()` in `lib/templates/template-loader.ts`
- **Struktur**: Erwartet Array oder Objekt mit `items`/`jobs` Array
- **Format-Toleranz**: Unterstützt `[{ name, url, ... }]`, `{ items: [...] }`, `{ jobs: [...] }`
- **Verwendung**: Wird automatisch geladen, wenn `template: 'ExtractJobListFromWebsite'` verwendet wird

**Vorteil**: Templates können lokal bearbeitet werden, ohne den Secretary Service zu ändern. Änderungen werden sofort wirksam.

## Pflichtfelder für Jobs

Basierend auf dem bestehenden `Job` Interface und der UI-Logik sind folgende Felder **Pflicht**:

### Absolut erforderlich (UI/Filter brechen ohne diese):
- `id`: Wird automatisch generiert, falls nicht vorhanden
- `title`: Job-Titel
- `company`: Firmenname
- `location`: Standort (z.B. "Bolzano")
- `locationRegion`: Region für Filter (z.B. "bolzano", "merano", "bressanone")
- `employmentType`: Arbeitszeit (z.B. "Full-time", "Part-time")
- `startDate`: Startdatum (Format: "DD.MM.YYYY" oder "subito")
- `jobType`: Job-Typ (`"dishwasher" | "kitchen" | "housekeeping" | "helper" | "service"`)
- `phone`: Telefonnummer (für Kontakt-Buttons)
- `email`: E-Mail-Adresse (für Kontakt-Buttons)
- `description`: Job-Beschreibung

### Optionale Felder (mit Defaults):
- `hasAccommodation`: Default `false`
- `hasMeals`: Default `false`
- Alle anderen Felder aus `Job` Interface sind optional

## Defaults und Fallbacks

### Mapping-Logik (`lib/job-import/mapper.ts`)

**Pflichtfeld-Validierung**:
- Fehlende Pflichtfelder führen zu einem Fehler beim Mapping
- UI zeigt Vorschau und blockiert Speichern, wenn Pflichtfelder fehlen
- Optionale Felder werden mit Defaults befüllt

**Defaults**:
```typescript
{
  hasAccommodation: false,
  hasMeals: false,
  // Alle anderen optionalen Felder bleiben undefined
}
```

**locationRegion-Mapping**:
- Automatisches Mapping von `location` → `locationRegion` basierend auf bekannten Städten
- Falls nicht mappbar: Fehler (benötigt manuelle Eingabe)

**jobType-Mapping**:
- Versucht automatisches Mapping basierend auf `title` oder `description`
- Falls nicht mappbar: Fehler (benötigt manuelle Eingabe)

## Datenfluss

### Single Import
1. Admin gibt Job-URL ein
2. UI ruft `importJobFromUrl(url, options)` auf
3. Client → API Proxy (`POST /api/secretary/import-from-url`)
4. API Proxy → Secretary Service (`POST /transformer/template`)
5. Secretary Service extrahiert `structured_data`
6. UI zeigt Vorschau der extrahierten Daten
7. Mapping: `structured_data` → `JobCreateInput` (mit Validierung)
8. Bei Erfolg: `POST /api/jobs` mit `{ jobs: [jobData] }`
9. Admin-Seite lädt Jobs neu

### Batch Import
1. Admin gibt URL der Job-Liste ein
2. UI ruft `importJobFromUrl(batchUrl, { template: 'ExtractJobListFromWebsite', ... })` auf
3. Secretary Service extrahiert Liste von Job-Links
4. UI zeigt Liste der gefundenen Jobs
5. Für jeden Link:
   - `importJobFromUrl(link.url, default template)`
   - Mapping → `POST /api/jobs`
   - Status-Tracking: pending/importing/success/error
6. Progress-Bar zeigt Fortschritt
7. Throttling: 1s Pause zwischen Requests

## Risiken und Mitigation

### 1. Template-Dateien fehlen im templates/ Verzeichnis
**Risiko**: Import schlägt mit Template-Lade-Fehler fehl  
**Mitigation**: Templates werden aus `templates/ExtractJobDataFromWebsite.md` und `templates/ExtractJobListFromWebsite.md` geladen. Stelle sicher, dass diese Dateien existieren.

### 2. Pflichtfelder fehlen in `structured_data`
**Risiko**: UI/Filter brechen, Jobs können nicht korrekt angezeigt werden  
**Mitigation**: Strikte Validierung im Mapper, UI blockiert Speichern bei fehlenden Pflichtfeldern. Admin kann fehlende Felder manuell ergänzen.

### 3. `locationRegion` oder `jobType` können nicht automatisch gemappt werden
**Risiko**: Import schlägt fehl, obwohl Daten vorhanden sind  
**Mitigation**: UI zeigt Vorschau mit fehlenden Feldern, Admin kann manuell korrigieren. Mapping-Logik ist erweiterbar.

### 4. Batch-Import ist langsam bei vielen Jobs
**Risiko**: Lange Wartezeiten, mögliche Timeouts  
**Mitigation**: Throttling (1s zwischen Requests), Progress-Bar, Cancel-Funktion. Timeout-Konfiguration in `fetch-with-timeout.ts`.

### 5. `structured_data` Format ändert sich
**Risiko**: Mapping bricht still, keine Fehlermeldung  
**Mitigation**: Type Guards im Parser, Unit-Tests für Mapping-Logik, explizite Fehlerbehandlung.

## Dateistruktur

```
lib/
  secretary/
    client.ts          # importJobFromUrl(), SecretaryServiceError
    adapter.ts         # callTemplateExtractFromUrl()
  job-import/
    mapper.ts          # mapStructuredDataToJob(), Validierung, Defaults
    parse.ts           # parseBatchJobList(), Type Guards
  utils/
    fetch-with-timeout.ts  # fetchWithTimeout(), Fehlerklassen
  env.ts               # getSecretaryConfig()
  job.ts               # JobCreateRequest Typ ergänzen

app/
  api/
    secretary/
      import-from-url/
        route.ts       # API Proxy → Secretary Service
    jobs/
      route.ts         # POST /api/jobs ergänzen

components/
  job-import/
    job-import-modal.tsx      # Haupt-Modal (Single + Batch Tabs)
    single-import-tab.tsx     # Single Import UI
    batch-import-tab.tsx      # Batch Import UI
    job-preview.tsx           # Vorschau-Komponente

app/
  admin/
    import/
      page.tsx        # Admin-Import-Seite
```

## Testing-Strategie

### Unit-Tests
- `lib/job-import/mapper.test.ts`: Mapping-Logik, Pflichtfeld-Validierung, Defaults
- `lib/job-import/parse.test.ts`: Batch-Parser, Type Guards, verschiedene Formate

### Integration-Tests (optional)
- End-to-End: URL → Secretary → Mapping → API → DB
- Mock Secretary Service Responses

## Offene Fragen

1. **Authentifizierung**: Soll die Admin-Import-Seite geschützt sein? (aktuell: offen)
2. **Batch-Größe**: Gibt es ein Limit für Batch-Imports? (aktuell: kein Limit)
3. **Duplikate**: Wie werden doppelte Jobs behandelt? (aktuell: werden erstellt, keine Deduplizierung)
4. **Fehlerbehandlung**: Soll bei Batch-Import bei Fehlern abgebrochen oder fortgesetzt werden? (aktuell: fortgesetzt, Fehler werden gesammelt)
