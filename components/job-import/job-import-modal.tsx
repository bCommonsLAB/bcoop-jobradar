"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Link, FileStack } from "lucide-react"
import SingleImportTab from "./single-import-tab"
import BatchImportTab from "./batch-import-tab"

interface JobImportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJobsImported?: (jobData: unknown) => void
}

/**
 * Haupt-Modal für Job-Import
 * 
 * Bietet zwei Tabs:
 * - Single Import: Einzelner Job von einer URL
 * - Batch Import: Mehrere Jobs von einer Liste
 */
export default function JobImportModal({
  open,
  onOpenChange,
  onJobsImported,
}: JobImportModalProps) {
  const [activeTab, setActiveTab] = useState("single")

  // Modal zurücksetzen beim Schließen
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Job importieren
          </DialogTitle>
          <DialogDescription>
            Importieren Sie Jobs einzeln oder als Batch von einer Website.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Einzelner Job
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <FileStack className="w-4 h-4" />
              Batch-Import
            </TabsTrigger>
          </TabsList>

          {/* Single Import Tab */}
          <TabsContent value="single" className="flex-1 overflow-y-auto space-y-6 mt-6">
            <SingleImportTab onJobCreated={onJobsImported} />
          </TabsContent>

          {/* Batch Import Tab */}
          <TabsContent value="batch" className="flex-1 flex flex-col mt-6 overflow-hidden">
            <BatchImportTab onJobsCreated={onJobsImported} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
