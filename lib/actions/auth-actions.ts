"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "../../app/utils/supabase/server"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const phone = (formData.get("phone") as string) || null

  const supabase =await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Create user profile
  if (data.user) {
    const { error: profileError } = await supabase.from("user_profiles").insert({
      user_id: data.user.id,
      first_name: firstName,
      last_name: lastName,
      phone,
    })

    if (profileError) {
      return { success: false, error: profileError.message }
    }
  }

  return {
    success: true,
    message: "Check your email for the confirmation link.",
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // ✅ This step sets the session cookies (important!)
  await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  })

  return { success: true, user: data.user }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  cookies().delete("supabase-auth-token")
  redirect("/")
}

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  const supabase =await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", user.id).single()

  return {
    ...user,
    profile: profile || null,
  }
}

export async function isAdmin() {
  const user = await getCurrentUser()
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
  console.log(user)
  if (!user) {
    return false
  }

  // In a real app, you would check for admin role in the database
  // For now, we'll use a simple check based on email domain
  return user.email?.endsWith("@meditrack.com") || false
}

