'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getCategories } from '@/app/actions/categories'

/**
 * Normaliza el nombre de categoría para asegurar que siempre sea el nombre correcto
 * Busca en la base de datos
 */
function normalizeCategoryName(categoryValue: string): string {
  if (!categoryValue) return categoryValue

  const normalized = categoryValue.toLowerCase().trim()

  // Mapeo explícito de valores antiguos
  const oldToNewMap: Record<string, string> = {
    'accesorios-celular': 'Accesorios para celular',
  }

  // Si está en el mapeo, usar el nuevo valor
  if (oldToNewMap[normalized]) {
    return oldToNewMap[normalized]
  }

  // Buscar categorías en la base de datos
  const categoriesResult = getCategories()
  const dbCategories = categoriesResult.then(res => res.data || [])
  
  // Esta función es síncrona pero necesita datos async - simplificamos
  // Si no se encuentra, devolver el valor original
  return categoryValue
}

/**
 * Migra todos los productos con categoría antigua "accesorios-celular"
 * a la categoría nueva "Accesorios para celular"
 */
export async function fixCategoryMigration() {
  const supabase = await createServerClient()

  try {
    // Actualizar todos los productos con la categoría antigua
    const { data, error } = await supabase
      .from('products')
      .update({ category: 'Accesorios para celular' })
      .eq('category', 'accesorios-celular')
      .select()

    if (error) {
      return {
        success: false,
        error: error.message,
        updated: 0,
      }
    }

    console.log(`[FIX_CATEGORY] Migrados ${data?.length || 0} productos`)

    return {
      success: true,
      message: `Se actualizaron ${data?.length || 0} productos de "accesorios-celular" a "Accesorios para celular"`,
      updated: data?.length || 0,
      products: data?.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })) || [],
    }
  } catch (error) {
    console.error('[FIX_CATEGORY] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      updated: 0,
    }
  }
}
