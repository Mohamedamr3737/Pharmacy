"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "../supabase"
import { getCurrentUser, isAdmin } from "./auth-actions"
import { clearCart } from "./cart-actions"

export async function createOrder(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "You must be logged in to place an order" }
  }

  const supabase = getSupabaseServerClient()

  // Get cart items
  const { data: cartItems, error: cartError } = await supabase
    .from("cart_items")
    .select(`
      *,
      products(id, price, stock)
    `)
    .eq("user_id", user.id)

  if (cartError) {
    console.error("Error fetching cart:", cartError)
    return { success: false, error: "Failed to fetch cart" }
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: "Your cart is empty" }
  }

  // Check stock availability
  for (const item of cartItems) {
    if (!item.products || item.quantity > item.products.stock) {
      return {
        success: false,
        error: `Not enough stock available for one or more products`,
      }
    }
  }

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    return sum + item.quantity * (item.products?.price || 0)
  }, 0)

  // Get shipping details from form
  const shippingAddress = formData.get("shipping_address") as string
  const shippingMethod = formData.get("shipping_method") as string
  const paymentMethod = formData.get("payment_method") as string

  // Start a transaction
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      shipping_address: shippingAddress,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      status: "pending",
      payment_status: "pending",
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error("Error creating order:", orderError)
    return { success: false, error: "Failed to create order" }
  }

  // Add order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.products?.price || 0,
  }))

  const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems)

  if (orderItemsError) {
    console.error("Error creating order items:", orderItemsError)
    // In a real app, you would roll back the order here
    return { success: false, error: "Failed to create order items" }
  }

  // Update product stock
  for (const item of cartItems) {
    if (item.products) {
      const newStock = item.products.stock - item.quantity

      const { error: stockError } = await supabase
        .from("products")
        .update({
          stock: newStock,
          status: newStock > 10 ? "active" : newStock > 0 ? "low_stock" : "out_of_stock",
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.product_id)

      if (stockError) {
        console.error("Error updating product stock:", stockError)
        // In a real app, you would handle this error more gracefully
      }
    }
  }

  // Clear the cart
  await clearCart()

  revalidatePath("/orders")
  revalidatePath("/admin/orders")

  return { success: true, orderId: order.id }
}

export async function getOrders() {
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return []
  }

  return data || []
}

export async function getOrderById(orderId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const supabase = getSupabaseServerClient()

  // Check if admin or order owner
  const isUserAdmin = await isAdmin()

  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items(
        *,
        products(*)
      )
    `)
    .eq("id", orderId)

  if (!isUserAdmin) {
    // If not admin, only show user's own orders
    query = query.eq("user_id", user.id)
  }

  const { data, error } = await query.single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  return data
}

export async function getAllOrders(
  options: {
    limit?: number
    offset?: number
    status?: string
  } = {},
) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { orders: [], count: 0 }
  }

  const { limit = 20, offset = 0, status } = options

  const supabase = getSupabaseServerClient()

  let query = supabase
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching orders:", error)
    return { orders: [], count: 0 }
  }

  return { orders: data || [], count: count || 0 }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { success: false, error: "Unauthorized" }
  }

  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/orders/${orderId}`)

  return { success: true }
}

export async function updatePaymentStatus(orderId: number, paymentStatus: string) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { success: false, error: "Unauthorized" }
  }

  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)

  if (error) {
    console.error("Error updating payment status:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/orders")
  revalidatePath(`/orders/${orderId}`)

  return { success: true }
}

