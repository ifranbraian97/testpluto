'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { CreateProductDTO, UpdateProductDTO } from '@/types/admin'

// GET CATEGORIES FROM DATABASE
export async function getCategories() {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    
    if (error) {
      return { error: error.message, data: null }
    }
    
    return { data: data || [], error: null }
  } catch (error) {
    console.error('Get categories error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null }
  }
}

/**
 * CREATE PRODUCT
 * Crea un nuevo producto con el nuevo sistema de variantes
 */
export async function createProduct(input: CreateProductDTO) {
  const supabase = await createServerClient()
  
  try {
    // Verificar que el slug sea único
    const { data: existing } = await supabase
      .from('products')
      .select('slug')
      .eq('slug', input.slug)
      .single()
    
    if (existing) {
      return { error: 'El producto con este slug ya existe', data: null }
    }
    
    // Crear producto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name: input.name,
        description: input.description || null,
        full_description: input.full_description || null,
        price: input.price,
        price_offer: input.price_offer || null,
        category: input.category,
        slug: input.slug,
        image: input.image || null,
        images: input.images || [],
        features: input.features || [],
        stock: input.stock || 'medium',
      })
      .select()
      .single()
    
    if (productError || !product) {
      return { error: productError?.message || 'No se pudo crear el producto', data: null }
    }
    
    return { data: product, error: null }
  } catch (error) {
    console.error('Create product error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null }
  }
}

/**
 * UPDATE PRODUCT
 * Actualiza un producto existente
 */
export async function updateProduct(productId: number, input: Partial<UpdateProductDTO>) {
  const supabase = await createServerClient()
  
  try {
    const updateData: any = {}
    
    if (input.name) updateData.name = input.name
    if (input.description !== undefined) updateData.description = input.description
    if (input.full_description !== undefined) updateData.full_description = input.full_description
    if (input.price) updateData.price = input.price
    if (input.price_offer !== undefined) updateData.price_offer = input.price_offer
    if (input.category) updateData.category = input.category
    if (input.slug) updateData.slug = input.slug
    if (input.image !== undefined) updateData.image = input.image
    if (input.images) updateData.images = input.images
    if (input.features) updateData.features = input.features
    if (input.stock) updateData.stock = input.stock
    
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single()
    
    if (productError || !product) {
      return { error: productError?.message || 'No se pudo actualizar el producto', data: null }
    }
    
    return { data: product, error: null }
  } catch (error) {
    console.error('Update product error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null }
  }
}

/**
 * DELETE PRODUCT
 * Elimina un producto (cascada elimina variantes)
 */
export async function deleteProduct(productId: number) {
  const supabase = await createServerClient()
  
  try {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
    
    if (deleteError) {
      return { error: deleteError.message }
    }
    
    return { error: null }
  } catch (error) {
    console.error('Delete product error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido' }
  }
}

/**
 * GET PRODUCT
 * Obtiene un producto con todas sus variantes
 */
export async function getProduct(productId: number) {
  const supabase = await createServerClient()
  
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()
    
    if (productError || !product) {
      return { error: 'Producto no encontrado', data: null }
    }
    
    // Obtener variantes
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select(
        `
        *,
        product_variant_values(
          id,
          variant_type_id,
          variant_value_id,
          variant_types(display_name),
          variant_values(value, color_hex)
        )
        `
      )
      .eq('product_id', productId)
      .eq('is_active', true)
    
    return {
      data: {
        ...product,
        variants: variants || [],
      },
      error: null,
    }
  } catch (error) {
    console.error('Get product error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null }
  }
}

/**
 * GET PRODUCT BY SLUG
 * Obtiene un producto por su slug (para el frontend)
 */
export async function getProductBySlug(slug: string) {
  const supabase = await createServerClient()
  
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (productError || !product) {
      return { error: 'Producto no encontrado', data: null, status: 404 }
    }
    
    // Obtener variantes
    const { data: variants } = await supabase
      .from('product_variants')
      .select(
        `
        *,
        product_variant_values(
          variant_type_id,
          variant_value_id,
          variant_types(display_name),
          variant_values(value, color_hex)
        )
        `
      )
      .eq('product_id', product.id)
      .eq('is_active', true)
    
    return {
      data: {
        ...product,
        variants: variants || [],
      },
      error: null,
      status: 200,
    }
  } catch (error) {
    console.error('Get product by slug error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null, status: 500 }
  }
}

/**
 * GET ALL PRODUCTS
 * Obtiene productos con paginación
 */
export async function getAllProducts(
  category?: string,
  limit: number = 20,
  offset: number = 0
) {
  const supabase = await createServerClient()
  
  try {
    let query = supabase
      .from('products')
      .select(
        `
        *,
        product_variants(count)
        `,
        { count: 'exact' }
      )
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error, count } = await query
      .limit(limit)
      .range(offset, offset + limit - 1)
    
    if (error) {
      return { error: error.message, data: null, count: 0 }
    }
    
    return { data: data || [], error: null, count: count || 0 }
  } catch (error) {
    console.error('Get all products error:', error)
    return { error: error instanceof Error ? error.message : 'Error desconocido', data: null, count: 0 }
  }
}

// GET PRODUCTS BY CATEGORY
export async function getProductsByCategory(
  category: string,
  limit?: number,
  offset: number = 0
) {
  const supabase = await createServerClient()
  
  try {
    // Solo traer campos essenciales en listado, NO variants completos
    let query = supabase
      .from('products')
      .select('id, name, price, price_offer, image, category, slug, stock, has_quantity_variants, has_flavor_variants', { count: 'exact' })
      .ilike('category', category)
      .order('name', { ascending: true })
    
    // Si no se especifica limit, trae TODOS (para paginación en cliente)
    // Si se especifica limit, usa paginación en servidor
    if (limit) {
      query = query.limit(limit).range(offset, offset + limit - 1)
    } else {
      query = query.limit(1000) // Máximo seguro para evitar traer demasiados datos
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return { data: null, error: error.message, count: 0 }
    }
    
    return { data: data || [], error: null, count: count || 0 }
  } catch (error) {
    console.error('Get products by category error:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error', count: 0 }
  }
}

// GET PRODUCTS BY CATEGORY WITH FULL DETAILS (para detalle individual)
export async function getProductsByCategoryWithDetails(
  category: string,
  limit: number = 12,
  offset: number = 0
) {
  const supabase = await createServerClient()
  
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select(
        `
        *,
        quantity_variants(*),
        flavor_variants(*)
        `,
        { count: 'exact' }
      )
      .ilike('category', category)
      .order('name', { ascending: true })
      .limit(limit)
      .range(offset, offset + limit - 1)
    
    if (error) {
      return { data: null, error: error.message, count: 0 }
    }
    
    return { data: data || [], error: null, count: count || 0 }
  } catch (error) {
    console.error('Get products by category with details error:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error', count: 0 }
  }
}
