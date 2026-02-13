import { defineConfig } from "vitest/config"

// Minimaler Test-Runner für reine Utility-Tests (ohne DOM).
// Das hält die Abhängigkeiten klein und ist für unsere Mapping-Logik ausreichend.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
})

