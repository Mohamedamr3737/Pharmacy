"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/app/utils/supabase/server"
import { isAdmin } from "./auth-actions"

export async function getProducts(
  options: {
    category?: string
    search?: string
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  } = {},
) {
  const { category, search, limit = 20, offset = 0, sortBy = "created_at", sortOrder = "desc" } = options

  const supabase =await createClient()

  let query = supabase
    .from("products")
    .select(`
      *,
      categories(name, slug)
    `)
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(offset, offset + limit - 1)

  if (category) {
    const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", category).single()

    if (categoryData) {
      query = query.eq("category_id", categoryData.id)
    }
  }

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], count: 0 }
  }

  return { products: data || [], count }
}

export async function getProductBySlug(slug: string) {
  const supabase =await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name, slug)
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return data
}

export async function getCategories() {
  const supabase =await createClient()

  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data || []
}

export async function createProduct(formData: FormData) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const slug = (formData.get("name") as string)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const stock = Number.parseInt(formData.get("stock") as string)
  const categoryId = Number.parseInt(formData.get("category") as string)
  const isPrescription = formData.get("is_prescription") === "on"
  const dosage = (formData.get("dosage") as string) || null
  const form = (formData.get("form") as string) || null
  const brand = (formData.get("brand") as string) || null
  const imageUrl =
    (formData.get("image_url") as string) || "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(name)

  const supabase =await createClient()

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      price,
      stock,
      category_id: categoryId,
      is_prescription: isPrescription,
      dosage,
      form,
      brand,
      image_url: imageUrl,
      status: stock > 10 ? "active" : stock > 0 ? "low_stock" : "out_of_stock",
    })
    .select()

  if (error) {
    console.error("Error creating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/[category]")

  return { success: true, product: data[0] }
}

export async function updateProduct(id: number, formData: FormData) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { success: false, error: "Unauthorized" }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const stock = Number.parseInt(formData.get("stock") as string)
  const categoryId = Number.parseInt(formData.get("category") as string)
  const isPrescription = formData.get("is_prescription") === "on"
  const dosage = (formData.get("dosage") as string) || null
  const form = (formData.get("form") as string) || null
  const brand = (formData.get("brand") as string) || null

  const supabase =await createClient()

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock,
      category_id: categoryId,
      is_prescription: isPrescription,
      dosage,
      form,
      brand,
      status: stock > 10 ? "active" : stock > 0 ? "low_stock" : "out_of_stock",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/[category]")
  revalidatePath(`/product/${data[0].slug}`)

  return { success: true, product: data[0] }
}

export async function deleteProduct(id: number) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { success: false, error: "Unauthorized" }
  }

  const supabase =await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath("/[category]")

  return { success: true }
}

