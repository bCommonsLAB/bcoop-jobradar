/**
 * Job Repository - MongoDB Repository for Job Management
 * 
 * Repository für die Verwaltung von Jobs in MongoDB.
 * Handelt CRUD-Operationen für Jobs und Bulk-Operationen für Job-Import.
 */

import { Collection } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import type { Job, JobCreateInput } from '@/lib/job'
import { getConfiguredCollection } from './mongodb-service'

/**
 * Repository für Job-Verwaltung
 */
export class JobRepository {
  private collectionName = 'jobs' // Kann über ENV überschrieben werden, nutzt aber getConfiguredCollection()

  /**
   * Hilfsmethode: Holt die Job-Collection
   */
  private async getJobCollection(): Promise<Collection<Job>> {
    return getConfiguredCollection<Job>()
  }

  /**
   * Erstellt oder aktualisiert mehrere Jobs
   * 
   * Prüft, ob Jobs mit derselben sourceUrl bereits existieren.
   * - Falls vorhanden: Job wird aktualisiert (Update)
   * - Falls nicht vorhanden: Job wird erstellt (Create)
   * 
   * @param jobsData Array von Job-Daten ohne id
   * @returns Array von erstellten/aktualisierten Job-IDs
   */
  async createJobs(jobsData: JobCreateInput[]): Promise<string[]> {
    try {
      const jobCollection = await this.getJobCollection()

      const jobIds: string[] = []
      let createdCount = 0
      let updatedCount = 0

      for (const jobData of jobsData) {
        // Wenn sourceUrl vorhanden ist, prüfe auf existierenden Job
        if (jobData.sourceUrl && jobData.sourceUrl.trim().length > 0) {
          const existingJob = await jobCollection.findOne({
            sourceUrl: jobData.sourceUrl.trim(),
          })

          if (existingJob) {
            // Job aktualisieren (behalte die bestehende ID)
            const updateResult = await jobCollection.updateOne(
              { sourceUrl: jobData.sourceUrl.trim() },
              { $set: { ...jobData, id: existingJob.id } } // ID beibehalten
            )

            if (updateResult.modifiedCount > 0) {
              console.log(`[JobRepository] Job mit sourceUrl "${jobData.sourceUrl}" aktualisiert`)
              jobIds.push(existingJob.id)
              updatedCount++
            } else {
              // Keine Änderungen, aber Job existiert bereits
              console.log(`[JobRepository] Job mit sourceUrl "${jobData.sourceUrl}" existiert bereits, keine Änderungen`)
              jobIds.push(existingJob.id)
            }
            continue
          }
        }

        // Job erstellen (kein existierender Job gefunden oder keine sourceUrl)
        const newJob: Job = {
          ...jobData,
          id: `job-${uuidv4()}`,
        }

        await jobCollection.insertOne(newJob)
        console.log(`[JobRepository] Neuer Job erstellt mit ID: ${newJob.id}`)
        jobIds.push(newJob.id)
        createdCount++
      }

      if (createdCount > 0 || updatedCount > 0) {
        console.log(`[JobRepository] ${createdCount} Jobs erstellt, ${updatedCount} Jobs aktualisiert`)
      }

      return jobIds
    } catch (error) {
      console.error('Fehler beim Erstellen/Aktualisieren der Jobs:', error)
      throw error
    }
  }

  /**
   * Holt alle Jobs
   * 
   * @returns Array von Jobs
   */
  async getJobs(): Promise<Job[]> {
    try {
      const jobCollection = await this.getJobCollection()
      return await jobCollection.find({}).toArray()
    } catch (error) {
      console.error('Fehler beim Abrufen der Jobs:', error)
      throw error
    }
  }

  /**
   * Löscht einen Job anhand der ID
   * 
   * @param jobId ID des zu löschenden Jobs
   * @returns true wenn gelöscht, false wenn nicht gefunden
   */
  async deleteJob(jobId: string): Promise<boolean> {
    try {
      const jobCollection = await this.getJobCollection()
      const result = await jobCollection.deleteOne({ id: jobId })
      return result.deletedCount > 0
    } catch (error) {
      console.error('Fehler beim Löschen des Jobs:', error)
      throw error
    }
  }

  /**
   * Löscht mehrere Jobs anhand ihrer IDs
   * 
   * @param jobIds Array von Job-IDs
   * @returns Anzahl der gelöschten Jobs
   */
  async deleteJobs(jobIds: string[]): Promise<number> {
    try {
      const jobCollection = await this.getJobCollection()
      const result = await jobCollection.deleteMany({ id: { $in: jobIds } })
      return result.deletedCount
    } catch (error) {
      console.error('Fehler beim Löschen der Jobs:', error)
      throw error
    }
  }
}
