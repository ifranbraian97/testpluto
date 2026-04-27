'use server'

import { createServerClient } from '@/lib/supabase/server'
import type {
  VariantType,
  VariantValue,
  CreateVariantTypeDTO,
  CreateVariantValueDTO,
  CreateProductVariantDTO,
  UpdateProductVariantDTO,
} from '@/types/admin'

// ============================================================================
// TIPOS DE VARIANTES
// ============================================================================

export async function getVariantTypes() {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_types')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantType[], error: null }
  } catch (error) {
    console.error('Error fetching variant types:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function createVariantType(input: CreateVariantTypeDTO) {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_types')
      .insert({
        name: input.name.toLowerCase().replace(/\s+/g, '_'),
        display_name: input.display_name,
        description: input.description || null,
      })
      .select()
      .single()
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantType, error: null }
  } catch (error) {
    console.error('Error creating variant type:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function updateVariantType(
  typeId: number,
  input: Partial<CreateVariantTypeDTO>
) {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_types')
      .update({
        display_name: input.display_name,
        description: input.description,
      })
      .eq('id', typeId)
      .select()
      .single()
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantType, error: null }
  } catch (error) {
    console.error('Error updating variant type:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function deleteVariantType(typeId: number) {
  const supabase = await createServerClient()
  
  try {
    const { error } = await supabase
      .from('variant_types')
      .delete()
      .eq('id', typeId)
    
    if (error) return { error: error.message }
    return { error: null }
  } catch (error) {
    console.error('Error deleting variant type:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// VALORES DE VARIANTES
// ============================================================================

export async function getVariantValues(typeId?: number) {
  const supabase = await createServerClient()
  
  try {
    let query = supabase
      .from('variant_values')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    if (typeId) {
      query = query.eq('variant_type_id', typeId)
    }
    
    const { data, error } = await query
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantValue[], error: null }
  } catch (error) {
    console.error('Error fetching variant values:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function createVariantValue(input: CreateVariantValueDTO) {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_values')
      .insert({
        variant_type_id: input.variant_type_id,
        value: input.value,
        color_hex: input.color_hex || null,
      })
      .select()
      .single()
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantValue, error: null }
  } catch (error) {
    console.error('Error creating variant value:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function updateVariantValue(
  valueId: number,
  input: Partial<CreateVariantValueDTO>
) {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_values')
      .update({
        value: input.value,
        color_hex: input.color_hex,
      })
      .eq('id', valueId)
      .select()
      .single()
    
    if (error) return { error: error.message, data: null }
    return { data: data as VariantValue, error: null }
  } catch (error) {
    console.error('Error updating variant value:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function deleteVariantValue(valueId: number) {
  const supabase = await createServerClient()
  
  try {
    const { error } = await supabase
      .from('variant_values')
      .delete()
      .eq('id', valueId)
    
    if (error) return { error: error.message }
    return { error: null }
  } catch (error) {
    console.error('Error deleting variant value:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// VARIANTES DE PRODUCTOS
// ============================================================================

export async function getProductVariants(productId: number) {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .rpc('get_product_variants_with_attributes', {
        p_product_id: productId,
      })
    
    if (error) return { error: error.message, data: null }
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching product variants:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function createProductVariant(input: CreateProductVariantDTO) {
  const supabase = await createServerClient()
  
  try {
    // 1. Crear la variante del producto
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .insert({
        product_id: input.product_id,
        sku: input.sku || null,
        name: input.name,
        description: input.description || null,
        price: input.price,
        price_offer: input.price_offer || null,
        stock_quantity: input.stock_quantity || 0,
        stock_status: input.stock_status || 'medium',
      })
      .select()
      .single()
    
    if (variantError || !variant) {
      return { error: variantError?.message || 'Failed to create variant', data: null }
    }
    
    // 2. Insertar los atributos (combinación de tipos y valores)
    const attributeInserts = input.attributes.map(attr => ({
      product_variant_id: variant.id,
      variant_type_id: attr.variant_type_id,
      variant_value_id: attr.variant_value_id,
    }))
    
    if (attributeInserts.length > 0) {
      const { error: attrError } = await supabase
        .from('product_variant_values')
        .insert(attributeInserts)
      
      if (attrError) {
        console.error('Error inserting variant attributes:', attrError)
      }
    }
    
    return { data: variant, error: null }
  } catch (error) {
    console.error('Error creating product variant:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function updateProductVariant(
  variantId: number,
  input: Partial<UpdateProductVariantDTO>
) {
  const supabase = await createServerClient()
  
  try {
    const updateData: any = {}
    
    if (input.name) updateData.name = input.name
    if (input.description) updateData.description = input.description
    if (input.price) updateData.price = input.price
    if (input.price_offer !== undefined) updateData.price_offer = input.price_offer
    if (input.stock_quantity !== undefined) updateData.stock_quantity = input.stock_quantity
    if (input.stock_status) updateData.stock_status = input.stock_status
    
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .update(updateData)
      .eq('id', variantId)
      .select()
      .single()
    
    if (variantError || !variant) {
      return { error: variantError?.message || 'Failed to update variant', data: null }
    }
    
    // Actualizar atributos si se proporcionan
    if (input.attributes && input.attributes.length > 0) {
      // Eliminar atributos actuales
      await supabase
        .from('product_variant_values')
        .delete()
        .eq('product_variant_id', variantId)
      
      // Insertar nuevos atributos
      const attributeInserts = input.attributes.map(attr => ({
        product_variant_id: variantId,
        variant_type_id: attr.variant_type_id,
        variant_value_id: attr.variant_value_id,
      }))
      
      const { error: attrError } = await supabase
        .from('product_variant_values')
        .insert(attributeInserts)
      
      if (attrError) {
        console.error('Error updating variant attributes:', attrError)
      }
    }
    
    return { data: variant, error: null }
  } catch (error) {
    console.error('Error updating product variant:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}

export async function deleteProductVariant(variantId: number) {
  const supabase = await createServerClient()
  
  try {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId)
    
    if (error) return { error: error.message }
    return { error: null }
  } catch (error) {
    console.error('Error deleting product variant:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Obtiene todos los tipos y valores de variantes activos
 * Útil para formularios de creación de variantes
 */
export async function getVariantTypesWithValues() {
  const supabase = await createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('variant_types')
      .select(
        `
        id,
        name,
        display_name,
        description,
        order_index,
        variant_values(id, value, color_hex, order_index)
        `
      )
      .eq('is_active', true)
      .order('order_index', { ascending: true })
    
    if (error) return { error: error.message, data: null }
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching variant types with values:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error', data: null }
  }
}
