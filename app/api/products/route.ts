// app/api/products/route.js
import { NextResponse } from "next/server"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/actions/product-actions"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""
  const data = await getProducts({ search, category: category || undefined })
  return NextResponse.json(data)
}

export async function POST(request) {
  const formData = await request.formData()
  const result = await createProduct(formData)
  return NextResponse.json(result)
}

export async function PUT(request) {
  const formData = await request.formData()
  const id = formData.get("id")
  const result = await updateProduct(Number(id), formData)
  return NextResponse.json(result)
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const result = await deleteProduct(Number(id))
  return NextResponse.json(result)
}
