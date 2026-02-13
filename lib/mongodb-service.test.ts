import { describe, expect, it, vi, afterEach } from "vitest"
import { readMongoEnvConfig } from "./mongodb-service"

describe("readMongoEnvConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("wirft, wenn MONGODB_URI fehlt", () => {
    vi.stubEnv("MONGODB_URI", "")
    vi.stubEnv("MONGODB_DATABASE_NAME", "db")
    vi.stubEnv("MONGODB_COLLECTION_NAME", "jobs")

    expect(() => readMongoEnvConfig()).toThrow(/MONGODB_URI/i)
  })

  it("wirft, wenn MONGODB_DATABASE_NAME fehlt", () => {
    vi.stubEnv("MONGODB_URI", "mongodb://example")
    vi.stubEnv("MONGODB_DATABASE_NAME", "")
    vi.stubEnv("MONGODB_COLLECTION_NAME", "jobs")

    expect(() => readMongoEnvConfig()).toThrow(/MONGODB_DATABASE_NAME/i)
  })

  it("wirft, wenn MONGODB_COLLECTION_NAME fehlt", () => {
    vi.stubEnv("MONGODB_URI", "mongodb://example")
    vi.stubEnv("MONGODB_DATABASE_NAME", "db")
    vi.stubEnv("MONGODB_COLLECTION_NAME", "")

    expect(() => readMongoEnvConfig()).toThrow(/MONGODB_COLLECTION_NAME/i)
  })

  it("liefert die Werte aus ENV ohne Defaults", () => {
    vi.stubEnv("MONGODB_URI", "mongodb://example")
    vi.stubEnv("MONGODB_DATABASE_NAME", "jobradar")
    vi.stubEnv("MONGODB_COLLECTION_NAME", "jobs")

    expect(readMongoEnvConfig()).toEqual({
      uri: "mongodb://example",
      databaseName: "jobradar",
      collectionName: "jobs",
    })
  })
})

