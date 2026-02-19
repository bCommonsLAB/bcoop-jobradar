/**
 * MongoDB Service (server-only)
 *
 * WICHTIG:
 * - Keine Default-/Fallback-Logik für ENV-Werte.
 * - Wenn eine Variable fehlt oder leer ist, wird ein Fehler geworfen.
 * - Dieses Modul darf nur serverseitig genutzt werden (API-Routen / Server Actions).
 */
import { MongoClient, type Collection, type Db, type Document } from "mongodb"
import dns from "dns/promises"

export type MongoEnvConfig = {
  uri: string
  databaseName: string
  collectionName: string
}

function requireEnv(name: "MONGODB_URI" | "MONGODB_DATABASE_NAME" | "MONGODB_COLLECTION_NAME"): string {
  const value = process.env[name]
  if (!value || value.trim().length === 0) {
    // Kurze, eindeutige Fehlermeldung – ohne Fallback.
    throw new Error(`${name} ist nicht definiert oder leer.`)
  }
  return value
}

/**
 * Liest die Mongo-Konfiguration strikt aus ENV (ohne Defaults).
 * Diese Funktion ist klein und gut testbar.
 */
export function readMongoEnvConfig(): MongoEnvConfig {
  return {
    uri: requireEnv("MONGODB_URI"),
    databaseName: requireEnv("MONGODB_DATABASE_NAME"),
    collectionName: requireEnv("MONGODB_COLLECTION_NAME"),
  }
}

declare global {
  var __jobradarMongoClientPromise: Promise<MongoClient> | undefined
  var __jobradarMongoUri: string | undefined
}

/**
 * Setzt die MongoDB-Verbindung zurück (nützlich für Tests oder nach Fehlern)
 */
export function resetMongoConnection(): void {
  globalThis.__jobradarMongoClientPromise = undefined
  globalThis.__jobradarMongoUri = undefined
}

/**
 * Konvertiert eine mongodb+srv URI in eine Standard-mongodb URI mit direkten Hostnamen.
 * Dies ist ein Workaround für DNS-Probleme, wenn SRV-Records nicht aufgelöst werden können.
 */
async function convertSrvToDirectUri(srvUri: string): Promise<string> {
  // Extrahiere die Komponenten aus der mongodb+srv URI
  // Verwende URL-Kodierung für Benutzername und Passwort, falls sie Sonderzeichen enthalten
  const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)(\?.*)?$/)
  if (!match) {
    throw new Error(`Ungültige mongodb+srv URI: ${srvUri}`)
  }

  const [, username, password, hostname, database, queryString] = match
  
  // Benutzername und Passwort sind bereits in der URI korrekt kodiert, verwende sie direkt

  // Versuche SRV-Records mit alternativen DNS-Servern aufzulösen
  const srvRecord = `_mongodb._tcp.${hostname}`
  
  try {
    // Verwende Google DNS als Fallback
    const resolver = new dns.Resolver()
    resolver.setServers(['8.8.8.8', '8.8.4.4'])
    
    const records = await resolver.resolveSrv(srvRecord)
    
    if (records.length === 0) {
      throw new Error(`Keine SRV-Records gefunden für ${srvRecord}`)
    }

    // Erstelle eine direkte mongodb URI mit allen gefundenen Hosts
    // Wichtig: Bei mongodb+srv wird TLS automatisch verwendet, daher müssen wir tls=true hinzufügen
    const hosts = records.map(record => `${record.name}:${record.port}`).join(',')
    
    // Parse bestehende Query-Parameter
    const existingParams = new URLSearchParams(queryString ? queryString.substring(1) : '')
    existingParams.set('tls', 'true') // TLS ist für MongoDB Atlas erforderlich
    existingParams.set('retryWrites', 'true') // Behalte retryWrites bei
    existingParams.set('w', 'majority') // Behalte write concern bei
    // Für MongoDB Atlas: Authentifizierungsdatenbank ist normalerweise 'admin' oder die angegebene Datenbank
    // Bei mongodb+srv wird die Authentifizierung automatisch gehandhabt, bei direkter Verbindung müssen wir sie explizit angeben
    if (!existingParams.has('authSource')) {
      existingParams.set('authSource', 'admin') // Standard-Auth-Datenbank für MongoDB Atlas
    }
    
    const directUri = `mongodb://${username}:${password}@${hosts}/${database}?${existingParams.toString()}`
    
    console.log(`[MongoDB] SRV-Records erfolgreich aufgelöst, verwende direkte Verbindung mit TLS`)
    return directUri
  } catch (error) {
    console.error(`[MongoDB] SRV-Auflösung fehlgeschlagen:`, error instanceof Error ? error.message : String(error))
    throw new Error(
      `DNS-Auflösung fehlgeschlagen. Bitte überprüfen Sie Ihre DNS-Einstellungen oder verwenden Sie eine direkte mongodb:// URI. ` +
      `Ursprünglicher Fehler: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

async function getResolvedUri(): Promise<string> {
  const { uri } = readMongoEnvConfig()
  
  // Wenn die URI bereits aufgelöst wurde, verwende sie
  if (globalThis.__jobradarMongoUri) {
    return globalThis.__jobradarMongoUri
  }
  
  let connectionUri = uri
  
  // Wenn es eine mongodb+srv URI ist, versuche sie zu konvertieren
  if (uri.startsWith('mongodb+srv://')) {
    try {
      console.log('[MongoDB] Versuche SRV-Records mit alternativem DNS aufzulösen...')
      connectionUri = await convertSrvToDirectUri(uri)
      console.log('[MongoDB] Konvertierung erfolgreich, verwende direkte Verbindung')
      // Speichere die konvertierte URI für zukünftige Verwendung
      globalThis.__jobradarMongoUri = connectionUri
    } catch (error) {
      console.error('[MongoDB] Fehler bei SRV-Konvertierung:', error)
      // Verwende die ursprüngliche URI und lasse MongoDB es selbst versuchen
      // Der Fehler wird dann beim connect() auftreten
    }
  } else {
    globalThis.__jobradarMongoUri = connectionUri
  }
  
  return connectionUri
}

function getMongoClientPromise(): Promise<MongoClient> {
  // In Dev/Hot-Reload vermeiden wir pro Reload neue Verbindungen.
  // In Prod (Serverless) ist das ebenfalls unkritisch, da der Prozess wiederverwendet wird.
  if (!globalThis.__jobradarMongoClientPromise) {
    // Verbindungsoptionen für robustere Verbindung
    const clientOptions = {
      serverSelectionTimeoutMS: 10000, // 10 Sekunden Timeout für Server-Auswahl (reduziert von 30s)
      connectTimeoutMS: 10000, // 10 Sekunden Timeout für Verbindungsaufbau (reduziert von 30s)
      socketTimeoutMS: 15000, // 15 Sekunden Timeout für Socket-Operationen (reduziert von 45s)
      retryWrites: true,
      retryReads: true,
    }

    // Erstelle den Client mit automatischer SRV-Konvertierung bei Bedarf
    globalThis.__jobradarMongoClientPromise = (async () => {
      const connectionUri = await getResolvedUri()
      const client = new MongoClient(connectionUri, clientOptions)
      try {
        return await client.connect()
      } catch (error) {
        // Bei Verbindungsfehler die globale Variable zurücksetzen
        globalThis.__jobradarMongoClientPromise = undefined
        globalThis.__jobradarMongoUri = undefined
        throw error
      }
    })()
  }

  return globalThis.__jobradarMongoClientPromise
}

export async function getMongoDb(): Promise<Db> {
  const { databaseName } = readMongoEnvConfig()
  const client = await getMongoClientPromise()
  return client.db(databaseName)
}

export async function getConfiguredCollection<TDocument extends Document = Document>(): Promise<Collection<TDocument>> {
  const { collectionName } = readMongoEnvConfig()
  const db = await getMongoDb()
  return db.collection<TDocument>(collectionName)
}

