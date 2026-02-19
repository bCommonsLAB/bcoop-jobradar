"use client"

import { Card } from "@/components/ui/card"
import type { StructuredJobData } from "@/lib/job-import/mapper"

interface JobPreviewProps {
  data: StructuredJobData
}

/**
 * Vorschau-Komponente für extrahierte Job-Daten
 * 
 * Zeigt die wichtigsten Felder aus structured_data an.
 */
export default function JobPreview({ data }: JobPreviewProps) {
  return (
    <Card className="p-4 bg-gray-50 rounded-lg border">
      <h4 className="font-medium mb-3 text-gray-900">Extrahierte Job-Daten:</h4>
      <div className="space-y-3 text-sm">
        {data.title && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Titel:</span>
            <span className="col-span-2 text-gray-900">{data.title}</span>
          </div>
        )}
        {data.company && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Firma:</span>
            <span className="col-span-2 text-gray-900">{data.company}</span>
          </div>
        )}
        {data.location && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Ort:</span>
            <span className="col-span-2 text-gray-900">{data.location}</span>
          </div>
        )}
        {data.employmentType && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Arbeitszeit:</span>
            <span className="col-span-2 text-gray-900">{data.employmentType}</span>
          </div>
        )}
        {data.startDate && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Startdatum:</span>
            <span className="col-span-2 text-gray-900">{data.startDate}</span>
          </div>
        )}
        {data.jobType && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Job-Typ:</span>
            <span className="col-span-2 text-gray-900">{data.jobType}</span>
          </div>
        )}
        {data.phone && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">Telefon:</span>
            <span className="col-span-2 text-gray-900">{data.phone}</span>
          </div>
        )}
        {data.email && (
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-gray-700">E-Mail:</span>
            <span className="col-span-2 text-gray-900">{data.email}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
