# Qualifikationsfilter deaktivieren - Schnelllösung

## Problem
Der Filter "Solo lavori senza qualificazione" ist aktiv und zeigt nur 7 von 29 Jobs.

## Lösung über Browser-Konsole

1. Öffnen Sie die Browser-Entwicklertools (F12)
2. Gehen Sie zum Tab **"Console"**
3. Führen Sie folgenden Code aus:

```javascript
// Filter aus localStorage laden
const filters = JSON.parse(localStorage.getItem('job-radar-filters') || '{}');

// Qualifikationsfilter deaktivieren
filters.noQualificationRequired = false;

// Filter speichern
localStorage.setItem('job-radar-filters', JSON.stringify(filters));

// Seite neu laden
location.reload();
```

Nach dem Neuladen sollten Sie **alle 29 Jobs** sehen.

## Alternative: Alle Filter zurücksetzen

Wenn Sie alle Filter zurücksetzen möchten:

```javascript
localStorage.removeItem('job-radar-filters');
location.reload();
```

## Überprüfung

Nach dem Deaktivieren sollten Sie auf der Job-Seite **29 offerte trovate** sehen statt 7.
