"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "../supabase"
import { getCurrentUser } from "./auth-actions"

export async function getCart() {
  const user = await getCurrentUser()

  if (!user) {
    return { items: [], total: 0 }
  }

  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products(*)
    `)
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching cart:", error)
    return { items: [], total: 0 }
  }

  const items = data || []
  const total = items.reduce((sum, item) => {
    return sum + item.quantity * (item.products?.price || 0)
  }, 0)

  return { items, total }
}

export async function addToCart(productId: number, quantity = 1) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to add items to your cart" }
  }

  const supabase = getSupabaseServerClient()

  // Check if product exists and has enough stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, stock")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.stock < quantity) {
    return { success: false, error: "Not enough stock available" }
  }

  // Check if item already exists in cart
  const { data: existingItem, error: existingItemError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single()

  if (existingItemError && existingItemError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error checking cart:", existingItemError)
    return { success: false, error: "Failed to check cart" }
  }

  let result

  if (existingItem) {
    // Update existing item
    const newQuantity = existingItem.quantity + quantity

    if (newQuantity > product.stock) {
      return { success: false, error: "Not enough stock available" }
    }

    result = await supabase
      .from("cart_items")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingItem.id)
  } else {
    // Add new item
    result = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    })
  }

  if (result.error) {
    console.error("Error updating cart:", result.error)
    return { success: false, error: "Failed to update cart" }
  }

  revalidatePath("/cart")

  return { success: true }
}

export async function updateCartItemQuantity(itemId: number, quantity: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to update your cart" }
  }

  if (quantity < 1) {
    return { success: false, error: "Quantity must be at least 1" }
  }

  const supabase = getSupabaseServerClient()

  // Get the cart item to check ownership and product
  const { data: cartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select("id, product_id, user_id")
    .eq("id", itemId)
    .single()

  if (cartItemError || !cartItem) {
    return { success: false, error: "Cart item not found" }
  }

  if (cartItem.user_id !== user.id) {
    return { success: false, error: "Unauthorized" }
  }

  // Check product stock
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", cartItem.product_id)
    .single()

  if (productError || !product) {
    return { success: false, error: "Product not found" }
  }

  if (product.stock < quantity) {
    return { success: false, error: "Not enough stock available" }
  }

  // Update the cart item
  const { error } = await supabase
    .from("cart_items")
    .update({
      quantity,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)

  if (error) {
    console.error("Error updating cart item:", error)
    return { success: false, error: "Failed to update cart item" }
  }

  revalidatePath("/cart")

  return { success: true }
}

export async function removeFromCart(itemId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to remove items from your cart" }
  }

  const supabase = getSupabaseServerClient()

  // Get the cart item to check ownership
  const { data: cartItem, error: cartItemError } = await supabase
    .from("cart_items")
    .select("user_id")
    .eq("id", itemId)
    .single()

  if (cartItemError || !cartItem) {
    return { success: false, error: "Cart item not found" }
  }

  if (cartItem.user_id !== user.id) {
    return { success: false, error: "Unauthorized" }
  }

  // Remove the cart item
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

  if (error) {
    console.error("Error removing cart item:", error)
    return { success: false, error: "Failed to remove cart item" }
  }

  revalidatePath("/cart")

  return { success: true }
}

export async function clearCart() {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to clear your cart" }
  }

  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

  if (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: "Failed to clear cart" }
  }

  revalidatePath("/cart")

  return { success: true }
}

