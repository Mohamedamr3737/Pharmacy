"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function getSupabaseServerClient() {
    const cookieStore = await cookies() // ✅ Await here!
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get: (key) => cookieStore.get(key)?.value,
        set: (key, value, options) => {
          cookieStore.set({ name: key, value, ...options })
        },
        remove: (key, options) => {
          cookieStore.set({ name: key, value: '', ...options })
        },
      },
    })
  }
  