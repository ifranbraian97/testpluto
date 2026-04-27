/**
 * API Route para subir imágenes de productos
 * ⚠️ DEPRECATED - Use /api/upload instead (Cloudflare R2)
 * 
 * POST /api/upload-image
 * 
 * Esta ruta usa Supabase Storage (deprecated).
 * Todos los uploads nuevos deben usar /api/upload
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'No productId provided' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Generar nombre de archivo único
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const filename = `product-${productId}-${timestamp}-${random}.${extension}`
    const filepath = `products/${productId}/${filename}`

    // Convertir File a Buffer
    const buffer = await file.arrayBuffer()

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filepath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return NextResponse.json(
        { error: `Error subiendo imagen: ${error.message}` },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filepath)

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error uploading file' },
      { status: 500 }
    )
  }
}
