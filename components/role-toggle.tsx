"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function RoleToggle() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const isServerAdmin = document.cookie.includes("is_admin=true")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAdmin(isServerAdmin)
  }, [])

  const handleToggle = (checked: boolean) => {
    setIsAdmin(checked)
    document.cookie = `is_admin=${checked}; path=/`
    // Force a hard reload to ensure data is refetched with new cookie
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        id="admin-mode"
        checked={isAdmin}
        onCheckedChange={handleToggle}
      />
      <Label
        htmlFor="admin-mode"
        className="cursor-pointer text-sm font-medium"
      >
        Admin
      </Label>
    </div>
  )
}
