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
   * Erstellt mehrere Jobs
   * 
   * @param jobsData Array von Job-Daten ohne id
   * @returns Array von erstellten Job-IDs
   */
  async createJobs(jobsData: JobCreateInput[]): Promise<string[]> {
    try {
      const jobCollection = await this.getJobCollection()

      const now = new Date()
      const jobs: Job[] = jobsData.map(jobData => ({
        ...jobData,
        id: `job-${uuidv4()}`,
      }))

      await jobCollection.insertMany(jobs)

      return jobs.map(j => j.id)
    } catch (error) {
      console.error('Fehler beim Erstellen der Jobs:', error)
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
}
