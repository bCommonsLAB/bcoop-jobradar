## Ziel
In der UI sollen **Arbeitsbereiche (Job-Typen)** wie „Küche“, „Geschirrspüler“, „Reinigung“, „Helfer“ und „Service“ jeweils einen **eigenen, wiedererkennbaren Farbton** bekommen. Hintergrund: Aktuell sind die Chips/Badges visuell fast identisch (Primary→Cyan), wodurch „Arbeitsbereich“ als Kategorie weniger schnell erfassbar ist.

## Beobachtung (Ist-Zustand)
- **Quelle der Arbeitsbereich-Chips**: `components/job-filters.tsx` (`jobTypeOptions`) rendert Buttons, die unabhängig vom Typ denselben Gradient verwenden.
- **Aktive Filter-Chips**: `components/active-filters.tsx` rendert Badges ebenfalls in Primary/Cyan, ohne Bezug zum konkreten Job-Typ.
- **Wichtig für Tailwind**: Tailwind (JIT) erkennt nur Klassen, die als **statische Strings** im Code stehen. Dynamisch zusammengesetzte Klassennamen riskieren fehlende Styles im Build.

## Anforderungen / Constraints
1. **Konsistenz**: gleicher Job-Typ → gleicher Farbton in Filter-Buttons und aktiven Filter-Badges.
2. **Robustheit**: unbekannte/Custom-Jobtypen (`custom-*`) brauchen einen sicheren Fallback (Primary).
3. **Minimal-invasiv**: so wenig Codeänderungen wie möglich, ohne Layout/Interaction zu brechen.
4. **Barrierefreiheit**: bei „selected“ müssen Kontrast und Erkennbarkeit erhalten bleiben.

## Lösungsvarianten (3 Optionen)
### Variante A – Statisches Mapping (empfohlen)
- **Idee**: eine kleine Utility `lib/job-type-colors.ts` mit einem `Record<jobType, classStrings>`.
- **Pro**: Tailwind-sicher (statische Strings), minimaler Eingriff, leicht wartbar.
- **Contra**: Klassenstrings sind etwas lang, aber klar zentralisiert.

### Variante B – CSS-Variablen + Design Tokens
- **Idee**: pro Job-Typ CSS-Variablen (z. B. `--jobtype-accent`) und Utility-Klassen in `globals.css`.
- **Pro**: sehr theming-freundlich (Dark/Light, Design System).
- **Contra**: größere Umstellung, mehr CSS-Setup, höheres Risiko für Side-Effects.

### Variante C – Datengetriebene Farben aus Translations/Config
- **Idee**: Farbe in einer zentralen Config/Translation definieren und im UI konsumieren.
- **Pro**: Konfigurierbar ohne Codeänderung.
- **Contra**: Tailwind/JIT-Problematik (dynamische Klassen), benötigt zusätzliche Safelist/Build-Konfiguration.

## Entscheidung
Wir wählen **Variante A**: statisches Mapping in einer Utility-Datei und verwenden die Styles in:
- `components/job-filters.tsx` (Arbeitsbereich-Buttons)
- `components/active-filters.tsx` (Arbeitsbereich-Badges)

## Testplan (manuell + automatisiert)
- **Manuell**: Seite öffnen → Arbeitsbereich auswählen → jeder Typ hat eigenen Farbton (selected + unselected Icon/Border). Aktive Filter anzeigen → Badge-Farbe passt zum Typ.
- **Automatisiert**: Unit-Test für die Utility (Mapping + Fallback) und `pnpm lint`.

