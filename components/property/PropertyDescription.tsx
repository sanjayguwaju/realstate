"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PropertyDescriptionProps {
  description: string
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
