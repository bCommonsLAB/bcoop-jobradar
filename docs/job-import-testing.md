# Job-Import Testing-Anleitung

## Voraussetzungen

### 1. ENV-Variablen setzen

Die folgenden Umgebungsvariablen müssen gesetzt sein:

```bash
# .env.local oder .env
SECRETARY_SERVICE_URL=http://localhost:8000/api  # Oder deine Secretary Service URL
SECRETARY_SERVICE_API_KEY=dein-api-key            # Dein Secretary Service API Key
```

**Wichtig**: Die `SECRETARY_SERVICE_URL` sollte auf den Base-URL des Secretary Services zeigen (ohne `/transformer/template` am Ende, das wird automatisch angehängt).

### 2. MongoDB-Konfiguration

Stelle sicher, dass deine MongoDB-ENV-Variablen gesetzt sind:
- `MONGODB_URI`
- `MONGODB_DATABASE_NAME`
- `MONGODB_COLLECTION_NAME`

### 3. Template-Dateien

Die folgenden Template-Dateien müssen im `templates/` Verzeichnis existieren:
- `templates/ExtractJobDataFromWebsite.md` (für Single Import)
- `templates/ExtractJobListFromWebsite.md` (für Batch Import)

Diese Templates werden automatisch geladen und an den Secretary Service gesendet. Sie müssen **nicht** auf dem Secretary Service existieren.

## Test-Schritte

### Schritt 1: Development Server starten

```bash
npm run dev
```

### Schritt 2: Admin-Import-Seite öffnen

Öffne im Browser:
```
http://localhost:3000/admin/import
```

### Schritt 3: Single Import testen

1. **Tab "Einzelner Job"** auswählen
2. Eine Job-URL eingeben (z.B. eine echte Job-Seite)
3. Auf **"Daten extrahieren"** klicken
4. Warte auf die Vorschau der extrahierten Daten
5. Prüfe die Vorschau auf Vollständigkeit
6. Auf **"Job erstellen"** klicken
7. Prüfe in der MongoDB oder auf `/jobs`, ob der Job erstellt wurde

### Schritt 4: Batch Import testen

1. **Tab "Batch-Import"** auswählen
2. Eine URL einer Job-Liste eingeben
3. Optional: Container-Selector eingeben (falls nötig)
4. Auf **"Job-Liste laden"** klicken
5. Prüfe die Liste der gefundenen Jobs
6. Auf **"X Jobs importieren"** klicken
7. Beobachte den Fortschritt in der Progress-Bar
8. Prüfe die Ergebnisse (erfolgreich/fehlgeschlagen)

## Troubleshooting

### Fehler: "SECRETARY_SERVICE_URL ist nicht definiert"

**Lösung**: Stelle sicher, dass die ENV-Variablen in `.env.local` gesetzt sind und der Server neu gestartet wurde.

### Fehler: "Template konnte nicht geladen werden"

**Lösung**: 
- Prüfe, ob die Template-Dateien `templates/ExtractJobDataFromWebsite.md` und `templates/ExtractJobListFromWebsite.md` existieren
- Falls nicht, erstelle sie basierend auf den Beispielen im `templates/` Verzeichnis
- Prüfe die Dateiberechtigungen und dass der Server Zugriff auf das `templates/` Verzeichnis hat

### Fehler: "locationRegion konnte nicht gemappt werden"

**Lösung**: 
- Der Mapper versucht automatisch, `locationRegion` aus `location` zu erkennen
- Unterstützte Städte: Bolzano, Merano, Bressanone, Brunico, Vipiteno
- Falls deine Stadt nicht unterstützt wird, erweitere `LOCATION_TO_REGION_MAP` in `lib/job-import/mapper.ts`

### Fehler: "jobType konnte nicht erkannt werden"

**Lösung**:
- Der Mapper versucht automatisch, `jobType` aus `title` oder `description` zu erkennen
- Unterstützte Keywords siehe `JOB_TYPE_KEYWORDS` in `lib/job-import/mapper.ts`
- Falls dein Job-Typ nicht erkannt wird, erweitere die Keywords oder gib `jobType` explizit in den structured_data an

### Fehler: "Pflichtfelder fehlen"

**Lösung**:
- Prüfe die Vorschau der extrahierten Daten
- Stelle sicher, dass das Secretary Template alle erforderlichen Felder extrahiert:
  - `title`, `company`, `location`, `employmentType`, `startDate`, `phone`, `email`, `description`
- Passe das Secretary Template an, falls Felder fehlen

## API-Tests (optional)

### Test mit curl

```bash
# Single Import testen
curl -X POST http://localhost:3000/api/secretary/import-from-url \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/job-page",
    "source_language": "en",
    "target_language": "en",
    "template": "ExtractJobDataFromWebsite",
    "use_cache": false
  }'

# Job erstellen testen
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [{
      "title": "Test Job",
      "company": "Test Company",
      "location": "Bolzano",
      "locationRegion": "bolzano",
      "employmentType": "Full-time",
      "startDate": "01.02.2025",
      "jobType": "kitchen",
      "phone": "+39 0471 123456",
      "email": "test@example.com",
      "description": "Test Description",
      "hasAccommodation": false,
      "hasMeals": false
    }]
  }'
```

## Unit-Tests ausführen

```bash
npm run test
```

Dies führt alle Tests aus, inklusive:
- `lib/job-import/parse.test.ts` - Batch-Parser Tests
- `lib/job-import/mapper.test.ts` - Mapping-Logik Tests

## Mock-Testing (ohne Secretary Service)

Falls du keinen Secretary Service zur Verfügung hast, kannst du die API-Route temporär mocken:

1. Erstelle eine Mock-Response in `app/api/secretary/import-from-url/route.ts`
2. Oder verwende ein Tool wie [Mock Service Worker](https://mswjs.io/) für Client-seitiges Mocking

**Beispiel Mock-Response**:
```typescript
// Temporär in route.ts für Testing
if (process.env.NODE_ENV === 'development' && body.url.includes('mock')) {
  return NextResponse.json({
    status: 'success',
    data: {
      structured_data: {
        title: "Mock Job",
        company: "Mock Company",
        location: "Bolzano",
        employmentType: "Full-time",
        startDate: "01.02.2025",
        phone: "+39 0471 123456",
        email: "mock@example.com",
        description: "Mock Description"
      }
    }
  })
}
```

## Checkliste für erfolgreichen Test

- [ ] ENV-Variablen gesetzt
- [ ] Development Server läuft
- [ ] Admin-Seite erreichbar (`/admin/import`)
- [ ] Secretary Service erreichbar (oder Mock aktiv)
- [ ] Templates existieren auf Secretary Service
- [ ] Single Import funktioniert
- [ ] Batch Import funktioniert
- [ ] Jobs werden in MongoDB gespeichert
- [ ] Jobs erscheinen auf `/jobs`
