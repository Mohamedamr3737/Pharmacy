"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useAuth } from "./auth-context"

type CartItem = {
  id: number
  product_id: number
  quantity: number
  products: {
    id: number
    name: string
    price: number
    image_url: string
    stock: number
    form?: string | null
    dosage?: string | null
  }
}

type CartContextType = {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  addToCart: (productId: number, quantity: number) => Promise<{ success: boolean; error?: string }>
  updateQuantity: (itemId: number, quantity: number) => Promise<{ success: boolean; error?: string }>
  removeItem: (itemId: number) => Promise<{ success: boolean; error?: string }>
  clearCart: () => Promise<{ success: boolean; error?: string }>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const fetchCart = async () => {
    if (!user) {
      setItems([])
      setTotal(0)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          *,
          products(*)
        `)
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching cart:", error)
        return
      }

      setItems(data || [])

      const cartTotal = (data || []).reduce((sum, item) => {
        return sum + item.quantity * (item.products?.price || 0)
      }, 0)

      setTotal(cartTotal)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addToCart = async (productId: number, quantity = 1) => {
    if (!user) {
      return { success: false, error: "You must be logged in to add items to your cart" }
    }

    try {
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
      const existingItemIndex = items.findIndex((item) => item.product_id === productId)

      if (existingItemIndex >= 0) {
        // Update existing item
        const existingItem = items[existingItemIndex]
        const newQuantity = existingItem.quantity + quantity

        if (newQuantity > product.stock) {
          return { success: false, error: "Not enough stock available" }
        }

        const { error } = await supabase
          .from("cart_items")
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingItem.id)

        if (error) {
          console.error("Error updating cart:", error)
          return { success: false, error: "Failed to update cart" }
        }
      } else {
        // Add new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })

        if (error) {
          console.error("Error adding to cart:", error)
          return { success: false, error: "Failed to add to cart" }
        }
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error("Error adding to cart:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!user) {
      return { success: false, error: "You must be logged in to update your cart" }
    }

    if (quantity < 1) {
      return { success: false, error: "Quantity must be at least 1" }
    }

    try {
      // Find the item in the local state
      const itemIndex = items.findIndex((item) => item.id === itemId)

      if (itemIndex === -1) {
        return { success: false, error: "Item not found in cart" }
      }

      const item = items[itemIndex]

      // Check product stock
      if (item.products.stock < quantity) {
        return { success: false, error: "Not enough stock available" }
      }

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

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error("Error updating cart item:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const removeItem = async (itemId: number) => {
    if (!user) {
      return { success: false, error: "You must be logged in to remove items from your cart" }
    }

    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", itemId)

      if (error) {
        console.error("Error removing cart item:", error)
        return { success: false, error: "Failed to remove cart item" }
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error("Error removing cart item:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const clearCart = async () => {
    if (!user) {
      return { success: false, error: "You must be logged in to clear your cart" }
    }

    try {
      const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error clearing cart:", error)
        return { success: false, error: "Failed to clear cart" }
      }

      setItems([])
      setTotal(0)
      return { success: true }
    } catch (error) {
      console.error("Error clearing cart:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount: items.reduce((count, item) => count + item.quantity, 0),
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

