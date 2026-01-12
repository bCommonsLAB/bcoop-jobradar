import { NextResponse } from "next/server"
import { getConfiguredCollection } from "@/lib/mongodb-service"
import { normalizeJobDocument, type Job } from "@/lib/job"

// Der MongoDB Node-Driver läuft nicht in der Edge-Runtime.
export const runtime = "nodejs"

type JobDocument = Job & { _id?: unknown }

export async function GET() {
  try {
    const collection = await getConfiguredCollection<JobDocument>()
    const docs = await collection.find({}).toArray()
    const jobs = docs.map(normalizeJobDocument)

    return NextResponse.json({ jobs })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

