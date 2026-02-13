import { NextRequest, NextResponse } from "next/server"
import { getConfiguredCollection } from "@/lib/mongodb-service"
import { normalizeJobDocument, type Job, type JobCreateInput, type JobCreateRequest } from "@/lib/job"
import { JobRepository } from "@/lib/job-repository"

// Der MongoDB Node-Driver läuft nicht in der Edge-Runtime.
export const runtime = "nodejs"

// Next.js Route Segment Config: Kein Caching für Jobs
export const dynamic = 'force-dynamic'
export const revalidate = 0

type JobDocument = Job & { _id?: unknown }

const repository = new JobRepository()

/**
 * GET /api/jobs
 * Gibt eine Liste von Jobs zurück
 */
export async function GET() {
  try {
    const collection = await getConfiguredCollection<JobDocument>()
    const docs = await collection.find({}).toArray()
    const jobs = docs.map(normalizeJobDocument)

    return NextResponse.json(
      { jobs },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * POST /api/jobs
 * Erstellt neue Jobs
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JobCreateRequest

    console.log('[API] POST /api/jobs - Request Body:', JSON.stringify(body, null, 2))

    // Validierung der Eingabedaten
    if (!body.jobs || !Array.isArray(body.jobs) || body.jobs.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Keine gültigen Jobs angegeben' },
        { status: 400 }
      )
    }

    // Validierung der einzelnen Job-Felder
    // Pflichtfelder: title, company, location, locationRegion, employmentType, startDate, jobType, phone, email, description
    const requiredFields: (keyof JobCreateInput)[] = [
      'title',
      'company',
      'location',
      'locationRegion',
      'employmentType',
      'startDate',
      'jobType',
      'phone',
      'email',
      'description',
    ]

    for (let i = 0; i < body.jobs.length; i++) {
      const job = body.jobs[i]

      // Prüfung der Pflichtfelder
      for (const field of requiredFields) {
        const value = job[field]
        if (
          value === undefined ||
          value === null ||
          (typeof value === 'string' && value.trim().length === 0)
        ) {
          return NextResponse.json(
            {
              status: 'error',
              message: `Job ${i + 1}: Erforderliches Feld '${field}' fehlt oder ist leer`,
              details: { jobIndex: i, missingField: field, jobData: job },
            },
            { status: 400 }
          )
        }
      }

      // Validierung von jobType (muss gültiger JobType sein)
      if (
        !['dishwasher', 'kitchen', 'housekeeping', 'helper', 'service'].includes(
          job.jobType
        )
      ) {
        return NextResponse.json(
          {
            status: 'error',
            message: `Job ${i + 1}: 'jobType' muss einer der folgenden Werte sein: dishwasher, kitchen, housekeeping, helper, service`,
            details: { jobIndex: i, jobType: job.jobType },
          },
          { status: 400 }
        )
      }

      // Validierung von Arrays (falls vorhanden)
      const arrayFields: (keyof JobCreateInput)[] = [
        'requirements',
        'benefits',
        'languages',
        'certifications',
        'tasks',
        'offers',
      ]

      for (const field of arrayFields) {
        const value = job[field]
        if (value !== undefined && !Array.isArray(value)) {
          return NextResponse.json(
            {
              status: 'error',
              message: `Job ${i + 1}: '${field}' muss ein Array sein (falls angegeben)`,
              details: { jobIndex: i, field, value },
            },
            { status: 400 }
          )
        }
      }
    }

    // Jobs erstellen oder aktualisieren
    const jobIds = await repository.createJobs(body.jobs)

    console.log('[API] POST /api/jobs - Jobs verarbeitet:', jobIds)

    return NextResponse.json(
      {
        status: 'success',
        message: `${jobIds.length} Jobs erfolgreich verarbeitet`,
        data: { jobIds },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Fehler beim Erstellen der Jobs:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: `Fehler beim Erstellen der Jobs: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/jobs
 * Löscht einen oder mehrere Jobs
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')
    const body = await request.json().catch(() => ({}))
    const jobIds = body.jobIds || (jobId ? [jobId] : [])

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Keine Job-IDs angegeben' },
        { status: 400 }
      )
    }

    // Validierung: Alle IDs müssen Strings sein
    for (const id of jobIds) {
      if (typeof id !== 'string' || id.trim().length === 0) {
        return NextResponse.json(
          { status: 'error', message: 'Ungültige Job-ID gefunden' },
          { status: 400 }
        )
      }
    }

    // Jobs löschen
    const deletedCount = await repository.deleteJobs(jobIds)

    console.log(`[API] DELETE /api/jobs - ${deletedCount} Jobs gelöscht`)

    return NextResponse.json(
      {
        status: 'success',
        message: `${deletedCount} Jobs erfolgreich gelöscht`,
        data: { deletedCount },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fehler beim Löschen der Jobs:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: `Fehler beim Löschen der Jobs: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
      },
      { status: 500 }
    )
  }
}

