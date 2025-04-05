import { type NextRequest } from "next/server"
import { updateSession } from "@/app/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/orders/:path*", "/admin/:path*"],
}

