import { describe, expect, it } from "vitest"
import { getJobTypeTone } from "./job-type-colors"

describe("getJobTypeTone", () => {
  it("liefert für bekannte Job-Typen spezifische Klassen", () => {
    const kitchen = getJobTypeTone("kitchen")
    expect(kitchen.buttonSelected).toContain("from-amber-")
    expect(kitchen.badge).toContain("border-amber-")
  })

  it("fällt für unbekannte Typen auf den Default-Ton zurück", () => {
    const unknown = getJobTypeTone("custom-123")
    expect(unknown.buttonSelected).toContain("from-primary")
    expect(unknown.badge).toContain("border-primary")
  })
})

