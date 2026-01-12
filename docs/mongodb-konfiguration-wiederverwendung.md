# MongoDB-Zugriff wiederverwenden (ENV-gesteuert)

## Kontext & Ziel

In diesem Projekt wird MongoDB serverseitig über eine kleine Service-Schicht angebunden. **Die Verbindung (URI + DB-Name) kommt aus Umgebungsvariablen**, und **die konkrete Collection wird als String an die Service-Funktion übergeben**. Dadurch kann dieselbe Logik grundsätzlich in einer zweiten Anwendung genutzt werden – solange diese Anwendung ihre eigenen ENV-Werte setzt und konsequent die richtigen Collection-Namen verwendet.

Wichtig ist dabei: In diesem Repo existieren **zwei Muster** für den Collection-Namen (ENV-gesteuert vs. hart codierte Konstante). Wenn die zweite Anwendung **eine andere Collection** als `wiki` nutzen soll, muss sie das ENV-gesteuerte Muster verwenden (oder die Konstante in ihrem Code anpassen). Diese Doku fasst den Ist-Stand zusammen und zeigt drei Wege, wie man das sauber wiederverwendet.

## Ist-Stand im Code (bcoop-notion2wiki)

- **MongoDB-Service**: `src/lib/mongodb-service.ts`
  - `connectToDatabase()` liest:
    - `MONGODB_URI` (Pflicht)
    - `MONGODB_DATABASE_NAME` (Pflicht)
  - `getCollection<T>(collectionName: string)`:
    - verbindet sich via `connectToDatabase()`
    - gibt `db.collection<T>(collectionName)` zurück

- **Server-Konfig**: `src/lib/config.ts`
  - `serverConfig.MONGODB.wikiCollection` liest:
    - `MONGODB_COLLECTION_NAME` (Default: `wiki`)
  - `serverConfig.MONGODB.projectStatusCollection` liest:
    - `MONGODB_PROJECT_STATUS_COLLECTION` (Default: `project_status_config`)

- **Hart codierte Collection-Konstante (Achtung)**: `src/lib/models/WikiEntry.ts`
  - `WIKI_ENTRIES_COLLECTION = 'wiki'`
  - Das ist **nicht ENV-gesteuert**. Server-Routen, die diese Konstante verwenden, landen immer in der Collection `wiki`.

## Benötigte Umgebungsvariablen

In `.env.local` (lokal) oder als Deployment-ENV (Prod):

```env
# Pflicht
MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/<optional-db>?retryWrites=true&w=majority"
MONGODB_DATABASE_NAME="bcoopwiki"

# Optional (Defaults siehe src/lib/config.ts)
MONGODB_COLLECTION_NAME="wiki"
MONGODB_PROJECT_STATUS_COLLECTION="project_status_config"
```

Hinweis: Diese Variablen sind **serverseitig**. In Next.js dürfen sie **nicht** mit `NEXT_PUBLIC_` prefixiert werden.

## Nutzungsmuster in API-Routen (empfohlen)

Wenn die zweite App eine **andere Collection** nutzt, sollte sie **den Collection-Namen aus der Server-Konfiguration** nehmen:

```ts
import { getCollection } from '@/lib/mongodb-service';
import { serverConfig } from '@/lib/config';

// Beispiel: “Wiki”-Daten in der Collection, die per ENV gesetzt wurde
const collection = await getCollection<MyDocument>(serverConfig.MONGODB.wikiCollection);
```

Damit ist das Verhalten pro App nur über ENV steuerbar, ohne Code-Anpassungen an jeder Stelle.

## Drei Varianten zur Wiederverwendung in einer zweiten Anwendung

### Variante A — Copy & Paste der kleinen Service-Schicht (schnell, pragmatisch)

- Kopiere nach App B:
  - `src/lib/mongodb-service.ts`
  - `src/lib/config.ts` (oder mindestens den MongoDB-Teil daraus)
- Stelle sicher, dass `mongodb` als Dependency vorhanden ist.
- Setze in App B die ENV-Werte (`MONGODB_URI`, `MONGODB_DATABASE_NAME`, `MONGODB_COLLECTION_NAME`, …).
- Verwende in App B **konsequent** `serverConfig.MONGODB.wikiCollection` (oder einen eigenen Konfig-Key), statt hart codierter Collection-Konstanten.

**Vorteil**: Minimaler Aufwand.  
**Nachteil**: Änderungen müssen in zwei Repos synchron gehalten werden.

### Variante B — Gemeinsames internes Paket (monorepo/workspace oder private npm)

Extrahiere die Dateien in ein kleines Paket, z.B. `@bcoop/mongodb`:

- Exportiert:
  - `connectToDatabase()`, `getCollection()`
  - optional: `createServerConfigFromEnv()` oder ein kleines `mongoConfigFromEnv()`
- Beide Apps hängen davon ab und konfigurieren **nur per ENV**.

**Vorteil**: Eine Quelle der Wahrheit, saubere Wiederverwendung.  
**Nachteil**: Initialer Setup-Aufwand (Packaging/Versioning/Release).

### Variante C — Factory statt `process.env` (am testbarsten, flexibel)

Wenn App B mehrere Datenbanken/Collections parallel braucht oder ihr Unit-Tests ohne ENV-Mocking wollt:

- Baut eine Factory wie `createMongoService({ uri, dbName })`
- Diese gibt `getCollection(name)` zurück und kapselt den Client.

**Vorteil**: Sehr gut testbar, keine globale ENV-Abhängigkeit.  
**Nachteil**: Etwas mehr Code/Architektur als A/B.

## Smoke-Test (Konfiguration verifizieren)

Ohne „große“ Tests ist der schnellste Nachweis: eine serverseitige Route/Funktion, die einmal connectet und z.B. `findOne()` macht.

Beispiel (App B):  
- Setze ENV korrekt.
- Rufe eine API-Route auf, die `await getCollection(serverConfig.MONGODB.wikiCollection).findOne({})` ausführt.

Wenn dabei ein „Missing ENV“ Fehler kommt:
- `MONGODB_URI ist nicht definiert` → ENV fehlt/ist nicht im Server-Prozess verfügbar.
- `MONGODB_DATABASE_NAME ist nicht definiert` → DB-Name fehlt.

## Typische Stolpersteine

- **Hart codierte Collection-Namen**: `WIKI_ENTRIES_COLLECTION = 'wiki'` ist nicht ENV-gesteuert.
  - Für App B mit anderer Collection: verwende `serverConfig.MONGODB.wikiCollection` (oder eine App-B-spezifische Konstante), nicht `WIKI_ENTRIES_COLLECTION`.
- **Edge Runtime**: Der `mongodb` Node-Client funktioniert nicht in Edge-Routen. Diese Service-Schicht ist für Node.js-Server-Routen gedacht.
- **Deployment-ENV**: In Next.js muss die ENV im Deployment korrekt gesetzt sein; lokal reicht `.env.local`.

