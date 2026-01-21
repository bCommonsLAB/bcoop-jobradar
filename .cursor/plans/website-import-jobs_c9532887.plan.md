---
name: website-import-jobs
overview: |-
  Wir übernehmen den Website-Import als generisches Modul (Variante B) und integrieren ihn in eine neue Admin‑Import‑Seite. Der Fokus liegt auf einem stabilen Secretary‑Proxy, klaren Mapping‑Regeln für minimale Pflichtfelder und einer kleinen, testbaren Mapping‑Schicht.

  Bevor wir Code ändern, dokumentieren wir die Analyse (Optionen, Risiken, Annahmen zu Template‑Namen und Pflichtfeldern) in `docs/`. Danach implementieren wir den technischen Fluss in klar getrennten, kleinen Dateien (UI/Mapping/API/Secretary‑Adapter) und sichern die Kernlogik mit Unit‑Tests ab.
todos:
  - id: doc-analysis
    content: Analyse/Entscheidung in docs/ dokumentieren
    status: pending
  - id: secretary-core
    content: Secretary-Proxy + Client + Timeout-Utils ergänzen
    status: pending
  - id: job-mapping
    content: Mapping + Parser + Typen für Job-Import bauen
    status: pending
  - id: api-jobs-post
    content: POST /api/jobs implementieren (Validierung/Insert)
    status: pending
  - id: admin-ui
    content: Admin-Import-UI in kleine Komponenten bauen
    status: pending
  - id: tests
    content: Unit-Tests für Parser/Mapper schreiben
    status: pending
  - id: quality-checks
    content: Lint + Tests ausführen und berichten
    status: pending
---

## Überlegungen

Wir müssen den bestehenden Job‑Datenvertrag respektieren: UI und Filter erwarten Pflichtfelder wie `jobType`, `locationRegion`, `employmentType`, `startDate`, `phone`, `email` und `description`. Ein Import mit „minimalen Feldern“ darf diese Anforderungen nicht unterlaufen, sonst brechen UI und Filterlogik. Daher braucht der Import klare Defaults oder eine einfache Validierung/Ergänzung vor dem Speichern.

Da es noch keine Secretary‑Integration im Repo gibt, bauen wir eine schlanke, fokussierte Version (URL‑Import + Fehlerklassen + Timeout). So vermeiden wir Overhead aus dem Beispielprojekt. Die Admin‑Import‑Seite wird getrennt vom Benutzer‑Flow bleiben und dient als kontrollierter Entry‑Point.

Die Template‑Namen sind Annahmen. Wir dokumentieren sie explizit und kapseln sie in einer Konfigurationsstelle, damit spätere Anpassungen lokal bleiben. Tests decken Parsing + Mapping ab, weil dort die meisten Fehler und Seiteneffekte entstehen.

## Vorgehen

- Dokumentation der Entscheidung und Risiken in `docs/` schreiben (Variante B, Template‑Annahmen, Pflichtfelder, Fallbacks). Ausgangspunkt: [`docs/Job Scraper/website-import-session-feature-map.md`](docs/Job%20Scraper/website-import-session-feature-map.md).
- Secretary‑Integration hinzufügen (minimal):
- Neue env‑Helper `getSecretaryConfig()` in [`lib/env.ts`](lib/env.ts).
- Timeout‑Fetch und Fehlerklassen in [`lib/utils/fetch-with-timeout.ts`](lib/utils/fetch-with-timeout.ts).
- Minimaler Adapter `callTemplateExtractFromUrl()` in [`lib/secretary/adapter.ts`](lib/secretary/adapter.ts).
- Client‑Funktion `importJobFromUrl()` + `SecretaryServiceError` in [`lib/secretary/client.ts`](lib/secretary/client.ts).
- API‑Proxy [`app/api/secretary/import-from-url/route.ts`](app/api/secretary/import-from-url/route.ts) (Form‑encoded → Secretary Service).
- Job‑Import‑Mapping implementieren:
- Neues Mapping‑Modul (z.B. [`lib/job-import/mapper.ts`](lib/job-import/mapper.ts)), das `structured_data` in ein `JobCreateInput` mappt, Pflichtfelder validiert und Defaults dokumentiert.
- Parser für Batch‑Listen (Array, `{ items }`, `{ jobs }`/`{ sessions }`) in [`lib/job-import/parse.ts`](lib/job-import/parse.ts).
- Job‑Create‑Typ ergänzen (z.B. `JobCreateRequest` in [`lib/job.ts`](lib/job.ts)), ohne bestehende Typen zu destabilisieren.
- Jobs API erweitern:
- [`app/api/jobs/route.ts`](app/api/jobs/route.ts) um `POST` erweitern (Validierung, Bulk‑Insert, Rückgabe). Option: kleines Repository [`lib/job-repository.ts`](lib/job-repository.ts) analog zu Session‑Repo, aber schlank.
- Admin‑Import‑UI bauen:
- Neue Admin‑Seite [`app/admin/import/page.tsx`](app/admin/import/page.tsx) mit Button/Modal.
- UI als kleine Komponenten unter [`components/job-import/`](components/job-import/) (Single‑Import, Batch‑Import, Statusliste). Größe pro Datei <200 Zeilen.
- UI zeigt Extrakt‑Vorschau und blockiert Speichern, wenn Pflichtfelder fehlen; ermöglicht einfache Korrektur.
- Tests:
- Unit‑Tests für Mapping + Batch‑Parser (z.B. [`lib/job-import/mapper.test.ts`](lib/job-import/mapper.test.ts) und [`lib/job-import/parse.test.ts`](lib/job-import/parse.test.ts)), inkl. Pflichtfeld‑Validierung und Default‑Fallbacks.
- Qualitätssicherung:
- Lint‑Check der geänderten Dateien, danach Tests laufen lassen und Ergebnisse berichten.