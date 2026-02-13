/**
 * MongoDB Service (server-only)
 *
 * WICHTIG:
 * - Keine Default-/Fallback-Logik für ENV-Werte.
 * - Wenn eine Variable fehlt oder leer ist, wird ein Fehler geworfen.
 * - Dieses Modul darf nur serverseitig genutzt werden (API-Routen / Server Actions).
 */
import { MongoClient, type Collection, type Db, type Document } from "mongodb"

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
}

function getMongoClientPromise(): Promise<MongoClient> {
  const { uri } = readMongoEnvConfig()

  // In Dev/Hot-Reload vermeiden wir pro Reload neue Verbindungen.
  // In Prod (Serverless) ist das ebenfalls unkritisch, da der Prozess wiederverwendet wird.
  if (!globalThis.__jobradarMongoClientPromise) {
    const client = new MongoClient(uri)
    globalThis.__jobradarMongoClientPromise = client.connect()
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

