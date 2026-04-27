/**
 * ⚠️ DEPRECATED - Funciones para manejo de almacenamiento en Supabase
 * 
 * NOTA: Esta lógica ha sido reemplazada por Cloudflare R2
 * 
 * Úsalo SOLO si necesitas compatibilidad con código antiguo.
 * Para nuevos uploads: usa /api/upload (Cloudflare R2)
 * 
 * Funciones antiguas:
 * - uploadProductImage() → Usar /api/upload
 * - deleteProductImage() → No implementado en R2 (usar console.log)
 */

import { createServerClient } from './server'

const BUCKET_NAME = 'product-images'

/**
 * Sube una imagen a Supabase Storage
 * @param file - El archivo a subir
 * @param productId - ID del producto (para organización)
 * @returns URL pública de la imagen
 */
export async function uploadProductImage(file: File, productId: number): Promise<string> {
  const supabase = await createServerClient()

  // Generar nombre de archivo único
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const extension = file.name.split('.').pop()
  const filename = `product-${productId}-${timestamp}-${random}.${extension}`
  const filepath = `products/${productId}/${filename}`

  // Subir archivo
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filepath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`)
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filepath)

  return publicUrlData.publicUrl
}

/**
 * Elimina una imagen de Supabase Storage
 * @param imageUrl - URL pública de la imagen
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  const supabase = await createServerClient()

  // Extraer el path del URL
  const urlParts = imageUrl.split(`/${BUCKET_NAME}/`)
  if (urlParts.length < 2) {
    throw new Error('URL de imagen inválida')
  }

  const filepath = urlParts[1]

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filepath])

  if (error) {
    throw new Error(`Error eliminando imagen: ${error.message}`)
  }
}

/**
 * Elimina todas las imágenes de un producto
 * @param productId - ID del producto
 */
export async function deleteProductImages(productId: number): Promise<void> {
  const supabase = await createServerClient()

  // Listar todos los archivos del producto
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`products/${productId}`)

  if (listError) {
    throw new Error(`Error listando imágenes: ${listError.message}`)
  }

  if (!files || files.length === 0) {
    return
  }

  // Eliminar todos los archivos
  const filePaths = files.map((f: any) => `products/${productId}/${f.name}`)

  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filePaths)

  if (deleteError) {
    throw new Error(`Error eliminando imágenes: ${deleteError.message}`)
  }
}
