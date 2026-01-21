import { describe, expect, it } from "vitest"
import { parseBatchJobList, type JobLink } from "./parse"

describe("parseBatchJobList", () => {
  it("parsed direktes Array von Job-Links", () => {
    const data = [
      { name: "Job 1", url: "https://example.com/job1" },
      { name: "Job 2", url: "https://example.com/job2" },
    ]

    const result = parseBatchJobList(data)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: "Job 1",
      url: "https://example.com/job1",
      metadata: {},
    })
    expect(result[1]).toEqual({
      name: "Job 2",
      url: "https://example.com/job2",
      metadata: {},
    })
  })

  it("parsed Objekt mit items-Array", () => {
    const data = {
      items: [
        { name: "Job 1", url: "https://example.com/job1" },
        { title: "Job 2", link: "https://example.com/job2" },
      ],
    }

    const result = parseBatchJobList(data)

    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe("Job 1")
    expect(result[1]?.name).toBe("Job 2")
  })

  it("parsed Objekt mit jobs-Array", () => {
    const data = {
      jobs: [
        { name: "Job 1", url: "https://example.com/job1" },
        { job: "Job 2", href: "https://example.com/job2" },
      ],
    }

    const result = parseBatchJobList(data)

    expect(result).toHaveLength(2)
    expect(result[0]?.name).toBe("Job 1")
    expect(result[1]?.name).toBe("Job 2")
  })

  it("parsed Objekt mit sessions-Array (Rückwärtskompatibilität)", () => {
    const data = {
      sessions: [
        { name: "Job 1", url: "https://example.com/job1" },
      ],
    }

    const result = parseBatchJobList(data)

    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe("Job 1")
  })

  it("behält Metadaten aus Items", () => {
    const data = [
      {
        name: "Job 1",
        url: "https://example.com/job1",
        location: "Bolzano",
        type: "Full-time",
      },
    ]

    const result = parseBatchJobList(data)

    expect(result[0]?.metadata).toEqual({
      location: "Bolzano",
      type: "Full-time",
    })
  })

  it("wirft Fehler bei ungültigem Format", () => {
    const data = { invalid: "format" }

    expect(() => parseBatchJobList(data)).toThrow("Keine gültige Job-Liste gefunden")
  })

  it("handelt leere Arrays", () => {
    const data: unknown[] = []

    const result = parseBatchJobList(data)

    expect(result).toHaveLength(0)
  })

  it("handelt Items ohne URL (leere URL)", () => {
    const data = [
      { name: "Job ohne URL" },
    ]

    const result = parseBatchJobList(data)

    expect(result[0]?.url).toBe("")
    expect(result[0]?.name).toBe("Job ohne URL")
  })
})
