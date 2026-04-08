"use client"

import { ShieldAlert } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface InternalNotesProps {
  notes: string
}

export function InternalNotes({ notes }: InternalNotesProps) {
  return (
    <Alert className="border-amber-500/30 bg-amber-500/5">
      <ShieldAlert className="size-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-400">
        Internal Notes (Admin)
      </AlertTitle>
      <AlertDescription className="text-amber-600/80 dark:text-amber-400/70">
        {notes}
      </AlertDescription>
    </Alert>
  )
}
