import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

/**
 * ESLint Flat Config (ESLint v9+)
 *
 * Kontext:
 * - Im Projekt existierte `pnpm lint`, aber ESLint war zunächst nicht lauffähig.
 * - Wir halten die Konfiguration bewusst schlank: JS/TS + React + React Hooks.
 * - Next-spezifische Regeln (core-web-vitals) lassen wir weg, um Tooling-Probleme
 *   und unnötige Abhängigkeiten zu vermeiden.
 */

export default [
  // `Vorlage/` enthält eine kopierte Template-App und soll nicht in die Lint-Qualität
  // der eigentlichen Anwendung hineinspielen.
  { ignores: [".next/**", "node_modules/**", "Vorlage/**"] },

  js.configs.recommended,

  // TypeScript (inkl. TSX) – „recommended“ ist ein guter Baseline-Start.
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React Hooks Regeln sind sehr wertvoll und verhindern echte Bugs.
      ...reactHooks.configs.recommended.rules,

      // Diese beiden Regeln sind (Stand 2026) für typische Next/React-Patterns oft zu streng:
      // - `setState` in Effects ist in dieser App bewusst genutzt (z.B. initialFilters, Loading-Skeleton).
      // - `purity` verbietet u.a. `Math.random()` auch in `useMemo`, was für UI-Skeletons ok ist.
      // Wir schalten sie aus, um echte Probleme von Style/Pattern-Debatten zu trennen.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
]

