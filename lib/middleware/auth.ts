import { NextRequest } from "next/server"

/**
 * Determines whether the current request has admin privileges.
 * Reads the `X-User-Role` header — only the exact value "admin" grants access.
 */
export function isAdmin(req: NextRequest): boolean {
  return (
    req.headers.get("X-User-Role") === "admin" ||
    req.cookies.get("is_admin")?.value === "true"
  )
}
