import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching product:", error)
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    const productData = await request.json()

    // Remove id from the update data
    const { id: _, ...updateData } = productData

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating product:", error)
      return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
