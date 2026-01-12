/**
 * Konsistente Icon-Größen für die gesamte Anwendung
 */
export const iconSizes = {
  xs: "w-3 h-3",      // 12px
  sm: "w-4 h-4",      // 16px
  md: "w-5 h-5",      // 20px
  lg: "w-6 h-6",      // 24px
  xl: "w-8 h-8",      // 32px
} as const

export type IconSize = keyof typeof iconSizes

