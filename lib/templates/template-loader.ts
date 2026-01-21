/**
 * Template Loader - Lädt Templates aus dem Dateisystem
 * 
 * Lädt Secretary-Templates aus dem templates/ Verzeichnis
 * und gibt sie als String zurück.
 */

import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Verfügbare Template-Namen
 */
export type TemplateName = 
  | 'ExtractJobDataFromWebsite'
  | 'ExtractJobListFromWebsite'
  | 'ExtractSessionDataFromWebsite'
  | 'ExtractSessionListFromWebsite'

/**
 * Lädt ein Template aus dem Dateisystem
 * 
 * @param templateName Name des Templates (ohne .md Extension)
 * @returns Template-Inhalt als String
 * @throws Error wenn Template nicht gefunden wird
 */
export function loadTemplate(templateName: TemplateName): string {
  try {
    // Templates liegen im templates/ Verzeichnis im Projekt-Root
    const templatePath = join(process.cwd(), 'templates', `${templateName}.md`)
    const templateContent = readFileSync(templatePath, 'utf-8')
    return templateContent
  } catch (error) {
    throw new Error(
      `Template "${templateName}" konnte nicht geladen werden: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Lädt das ExtractJobDataFromWebsite Template
 */
export function loadJobDataTemplate(): string {
  return loadTemplate('ExtractJobDataFromWebsite')
}

/**
 * Lädt das ExtractJobListFromWebsite Template
 */
export function loadJobListTemplate(): string {
  return loadTemplate('ExtractJobListFromWebsite')
}
