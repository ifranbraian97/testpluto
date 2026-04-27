/**
 * API Route para subir imágenes a Cloudflare R2
 * POST /api/upload
 * 
 * Migración de Supabase Storage → Cloudflare R2
 */

import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Validar variables de entorno
const requiredEnvVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY', 'R2_SECRET_KEY', 'R2_BUCKET', 'R2_PUBLIC_URL']
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v])

if (missingEnvVars.length > 0) {
  console.warn(`⚠️ Missing required environment variables: ${missingEnvVars.join(', ')}`)
}

// Inicializar cliente S3 para Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY || '',
    secretAccessKey: process.env.R2_SECRET_KEY || '',
  },
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
})

export async function POST(request: NextRequest) {
  try {
    // Validar que las variables de entorno estén configuradas
    if (missingEnvVars.length > 0) {
      console.error('Missing R2 environment variables:', missingEnvVars)
      return NextResponse.json(
        { error: 'R2 storage not configured. Missing: ' + missingEnvVars.join(', ') },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Validar tamaño máximo (5 MB)
    const maxFileSize = 5 * 1024 * 1024
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum of 5MB' },
        { status: 400 }
      )
    }

    // Generar ruta del archivo: products/<timestamp>-<filename>
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${timestamp}-${file.name.replace(/[^a-z0-9.-]/gi, '_')}`
    const key = `products/${filename}`

    // Convertir File a Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Subir a Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET || 'product-images',
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Cache control: 1 day - reduces egress while allowing updates
      CacheControl: 'public, max-age=86400',
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    })

    await s3Client.send(command)

    // Construir URL pública
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        key: key,
      },
      {
        status: 200,
      }
    )
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Error uploading file',
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
