'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { ApiResponse } from '@/types/admin'

export interface Category {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Obtiene todas las categorías activas desde Supabase
 * @returns Array de categorías
 */
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || [],
    }
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener categorías',
    }
  }
}

/**
 * Obtiene todas las categorías incluyendo las inactivas
 * (Para admin - poder editar categorías inactivas)
 */
export async function getAllCategoriesIncludingInactive(): Promise<ApiResponse<Category[]>> {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error

    return {
      success: true,
      data: data || [],
    }
  } catch (error: any) {
    console.error('Error fetching all categories:', error)
    return {
      success: false,
      error: error.message || 'Error al obtener categorías',
    }
  }
}

/**
 * Crea una nueva categoría
 * @param name Nombre de la categoría
 * @param slug Slug único de la categoría
 */
export async function createCategory(
  name: string,
  slug: string
): Promise<ApiResponse<Category>> {
  try {
    if (!name || !slug) {
      throw new Error('El nombre y slug son requeridos')
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined,
    }
  } catch (error: any) {
    console.error('Error creating category:', error)
    return {
      success: false,
      error: error.message || 'Error al crear categoría',
    }
  }
}

/**
 * Actualiza una categoría existente
 */
export async function updateCategory(
  id: number,
  name?: string,
  slug?: string,
  is_active?: boolean
): Promise<ApiResponse<Category>> {
  try {
    const supabase = await createServerClient()

    const updateData: Partial<Category> = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined,
    }
  } catch (error: any) {
    console.error('Error updating category:', error)
    return {
      success: false,
      error: error.message || 'Error al actualizar categoría',
    }
  }
}

/**
 * Elimina una categoría (soft delete - marca como inactiva)
 */
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  try {
    const supabase = await createServerClient()

    const { error } = await supabase
      .from('categories')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error

    return {
      success: true,
    }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return {
      success: false,
      error: error.message || 'Error al eliminar categoría',
    }
  }
}

/**
 * Activa o desactiva una categoría
 */
export async function toggleCategoryStatus(id: number): Promise<ApiResponse<Category>> {
  try {
    const supabase = await createServerClient()

    // Primero obtener el estado actual
    const { data: current, error: fetchError } = await supabase
      .from('categories')
      .select('is_active')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Toggle el estado
    const newStatus = !current.is_active

    const { data, error } = await supabase
      .from('categories')
      .update({ is_active: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: data || undefined,
    }
  } catch (error: any) {
    console.error('Error toggling category status:', error)
    return {
      success: false,
      error: error.message || 'Error al cambiar estado de categoría',
    }
  }
}
