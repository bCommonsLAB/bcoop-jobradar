# Problem: Nur 7 Jobs statt 29 angezeigt

## Ursache

Die Anwendung speichert Filter-Einstellungen im **localStorage** des Browsers. Wenn Sie Filter gesetzt haben (z.B. bestimmte Job-Typen, Standorte oder Zeiträume), werden diese beim Neuladen der Seite automatisch wieder angewendet.

**Ihre Version**: Zeigt 7 Jobs (mit aktiven Filtern)
**b*commonslab Version**: Zeigt 29 Jobs (wahrscheinlich ohne Filter oder mit anderen Filtern)

## Lösung: Filter zurücksetzen

### Option 1: Über die Benutzeroberfläche

1. Gehen Sie zur Job-Seite (`/jobs`)
2. Klicken Sie auf **"Modifica filtri"** (Filter bearbeiten)
3. Stellen Sie sicher, dass:
   - **Job-Typen**: "Alle" ausgewählt ist
   - **Standorte**: "Alle" ausgewählt ist
   - **Zeitraum**: "Alle" ausgewählt ist
   - **Qualifikation**: Nicht aktiviert
4. Klicken Sie auf **"Weiter"** oder **"Anwenden"**

### Option 2: Browser localStorage löschen

1. Öffnen Sie die Browser-Entwicklertools (F12)
2. Gehen Sie zum Tab **"Application"** (Chrome) oder **"Storage"** (Firefox)
3. Erweitern Sie **"Local Storage"**
4. Wählen Sie `http://localhost:3000` aus
5. Suchen Sie nach folgenden Schlüsseln und löschen Sie sie:
   - `job-radar-filters`
   - `job-radar-has-used-app` (optional)
6. Laden Sie die Seite neu (F5)

### Option 3: JavaScript-Konsole verwenden

1. Öffnen Sie die Browser-Entwicklertools (F12)
2. Gehen Sie zum Tab **"Console"**
3. Führen Sie folgenden Code aus:

```javascript
// Filter zurücksetzen
localStorage.removeItem('job-radar-filters');
localStorage.removeItem('job-radar-has-used-app');
location.reload();
```

## Überprüfung

Nach dem Zurücksetzen der Filter sollten Sie **29 Jobs** sehen, genau wie auf der b*commonslab Version.

## Warum werden Filter gespeichert?

Die Filter werden gespeichert, damit:
- Ihre Einstellungen beim nächsten Besuch erhalten bleiben
- Sie nicht jedes Mal die Filter neu setzen müssen
- Die Benutzererfahrung verbessert wird

## API-Test

Um zu überprüfen, wie viele Jobs tatsächlich in der Datenbank sind:

```powershell
curl.exe http://localhost:3000/api/jobs | ConvertFrom-Json | Select-Object -ExpandProperty jobs | Measure-Object | Select-Object -ExpandProperty Count
```

Dies sollte **29** zurückgeben, unabhängig von den Filtern.
