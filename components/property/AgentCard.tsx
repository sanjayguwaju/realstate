"use client"

import { Phone, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { PropertyDetail } from "@/lib/utils/listings"

interface AgentCardProps {
  agent: PropertyDetail["agent"]
}

const getInitials = (name: string): string =>
  name.split(" ").map((n) => n.at(0)).join("")

export function AgentCard({ agent }: AgentCardProps) {
  if (!agent) return null

  const initials = getInitials(agent.name)

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Listing Agent</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-6 text-center">
        <Avatar size="lg" className="mb-3">
          <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="font-heading text-base font-semibold">{agent.name}</div>
        <Separator className="my-4" />
        <div className="w-full space-y-2 text-sm text-muted-foreground">
          {agent.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-3.5" />
              {agent.phone}
            </div>
          )}
          {agent.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-3.5" />
              {agent.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
