import { describe, expect, it } from "vitest"
import { mapStructuredDataToJob, type StructuredJobData } from "./mapper"

describe("mapStructuredDataToJob", () => {
  const validJobData: StructuredJobData = {
    title: "Koch (m/f/d)",
    company: "Restaurant Test",
    location: "Bolzano",
    employmentType: "Full-time",
    startDate: "01.02.2025",
    phone: "+39 0471 123456",
    email: "jobs@restaurant-test.it",
  }

  it("mappt gültige Job-Daten erfolgreich", () => {
    const result = mapStructuredDataToJob(validJobData)

    expect(result.title).toBe("Koch (m/f/d)")
    expect(result.company).toBe("Restaurant Test")
    expect(result.location).toBe("Bolzano")
    expect(result.locationRegion).toBe("bolzano") // Automatisch gemappt
    expect(result.employmentType).toBe("Full-time")
    expect(result.startDate).toBe("01.02.2025")
    expect(result.phone).toBe("+39 0471 123456")
    expect(result.email).toBe("jobs@restaurant-test.it")
    expect(result.jobType).toBeDefined() // Sollte automatisch erkannt werden
    expect(result.hasAccommodation).toBe(false) // Default
    expect(result.hasMeals).toBe(false) // Default
  })

  it("erkennt jobType aus title", () => {
    const data: StructuredJobData = {
      ...validJobData,
      title: "Aiuto cuoco",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.jobType).toBe("kitchen")
  })

  it("erkennt jobType aus title mit Keywords", () => {
    const data: StructuredJobData = {
      ...validJobData,
      title: "Lavapiatti",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.jobType).toBe("dishwasher")
  })

  it("mappt locationRegion automatisch aus location", () => {
    const testCases = [
      { location: "Bolzano", expected: "bolzano" },
      { location: "Merano", expected: "merano" },
      { location: "Bressanone", expected: "bressanone" },
      { location: "Brunico", expected: "brunico" },
      { location: "Vipiteno", expected: "vipiteno" },
    ]

    for (const testCase of testCases) {
      const data: StructuredJobData = {
        ...validJobData,
        location: testCase.location,
      }

      const result = mapStructuredDataToJob(data)

      expect(result.locationRegion).toBe(testCase.expected)
    }
  })

  it("akzeptiert explizites locationRegion", () => {
    const data: StructuredJobData = {
      ...validJobData,
      locationRegion: "merano",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.locationRegion).toBe("merano")
  })

  it("akzeptiert explizites jobType", () => {
    const data: StructuredJobData = {
      ...validJobData,
      jobType: "service",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.jobType).toBe("service")
  })

  it("konvertiert boolean-Felder korrekt", () => {
    const data: StructuredJobData = {
      ...validJobData,
      hasAccommodation: true,
      hasMeals: "yes",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.hasAccommodation).toBe(true)
    expect(result.hasMeals).toBe(true)
  })

  it("konvertiert Array-Felder korrekt", () => {
    const data: StructuredJobData = {
      ...validJobData,
      requirements: ["Erfahrung", "Sprachkenntnisse"],
      benefits: "Urlaub, Bonus",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.requirements).toEqual(["Erfahrung", "Sprachkenntnisse"])
    expect(result.benefits).toEqual(["Urlaub", "Bonus"])
  })

  it("konvertiert numerische Felder korrekt", () => {
    const data: StructuredJobData = {
      ...validJobData,
      salaryMin: "1500",
      salaryMax: 2000,
      numberOfPositions: "2",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.salaryMin).toBe(1500)
    expect(result.salaryMax).toBe(2000)
    expect(result.numberOfPositions).toBe(2)
  })

  it("wirft Fehler bei fehlenden Pflichtfeldern", () => {
    const data: StructuredJobData = {
      title: "Test Job",
      // company fehlt
    }

    expect(() => mapStructuredDataToJob(data)).toThrow("Fehlende oder ungültige Pflichtfelder")
  })

  it("wirft Fehler wenn locationRegion nicht gemappt werden kann", () => {
    const data: StructuredJobData = {
      ...validJobData,
      location: "Unbekannte Stadt",
    }

    expect(() => mapStructuredDataToJob(data)).toThrow("locationRegion konnte nicht")
  })

  it("wirft Fehler wenn jobType nicht erkannt werden kann", () => {
    const data: StructuredJobData = {
      ...validJobData,
      title: "Unbekannter Job-Typ XYZ",
      title: "Unbekannter Job Titel",
    }

    expect(() => mapStructuredDataToJob(data)).toThrow("jobType konnte nicht")
  })

  it("entfernt leere Arrays aus dem Ergebnis", () => {
    const data: StructuredJobData = {
      ...validJobData,
      requirements: [],
      benefits: "",
    }

    const result = mapStructuredDataToJob(data)

    expect(result.requirements).toBeUndefined()
    expect(result.benefits).toBeUndefined()
  })
})
