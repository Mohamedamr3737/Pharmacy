import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { use } from "react"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log(user)
  const path = request.nextUrl.pathname
  const isProtectedRoute = ["/buy", "/sell"].some((route) => path.startsWith(route))
  const isAdminRoute = ["/admin", "/admin/products", "/admin/orders", "/admin/customers"].some(
    (route) => path.startsWith(route)
  )

  if (!user && (isAdminRoute || isProtectedRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user && isAdminRoute) {
    const isAdmin = user.email?.endsWith("@meditrack.com")
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}
