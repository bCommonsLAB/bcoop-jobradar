/**
 * Seed-Script: Dummy-Jobs nach MongoDB exportieren
 *
 * - Nutzt strikt die 3 ENV-Variablen:
 *   - MONGODB_URI
 *   - MONGODB_DATABASE_NAME
 *   - MONGODB_COLLECTION_NAME
 * - Keine Default-/Fallback-Logik.
 * - Idempotent: schreibt per Upsert (Key: `id`), d.h. mehrfaches Ausführen erzeugt keine Duplikate.
 *
 * Ausführung:
 *   pnpm seed:jobs
 */
// Lädt `.env` (nur für lokale Script-Ausführung). Next.js macht das automatisch,
// aber standalone Node-Skripte (tsx) nicht.
import "dotenv/config"

import { dummyJobs } from "@/lib/data/dummy-jobs"
import { readMongoEnvConfig } from "@/lib/mongodb-service"
import type { Job } from "@/lib/job"
import { MongoClient } from "mongodb"

type JobDocument = Job & { _id?: unknown }

async function main() {
  const { uri, databaseName, collectionName } = readMongoEnvConfig()

  console.log(`[seed] Ziel: DB="${databaseName}" Collection="${collectionName}"`)
  console.log(`[seed] Dummy-Jobs: ${dummyJobs.length}`)

  // Wichtig: Für Scripts schließen wir die Verbindung explizit,
  // sonst bleibt der Node-Eventloop aktiv und das Script "hängt".
  const client = new MongoClient(uri)
  await client.connect()

  try {
    const collection = client.db(databaseName).collection<JobDocument>(collectionName)

    const operations = dummyJobs.map((job) => ({
      replaceOne: {
        filter: { id: job.id },
        replacement: job,
        upsert: true,
      },
    }))

    const result = await collection.bulkWrite(operations, { ordered: false })

    console.log("[seed] Fertig.")
    console.log(`[seed] matched:   ${result.matchedCount}`)
    console.log(`[seed] modified:  ${result.modifiedCount}`)
    console.log(`[seed] upserted:  ${result.upsertedCount}`)
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[seed] Fehler: ${message}`)
  process.exitCode = 1
})

