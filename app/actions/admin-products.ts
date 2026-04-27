/**
 * Server Actions para administración de productos
 * Contiene toda la lógica de acceso a base de datos
 * Server-side ONLY - ejecuta en servidor
 */

'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getCategories } from '@/app/actions/categories'
import type {
  AdminProduct,
  AdminProductWithVariants,
  CreateProductDTO,
  UpdateProductDTO,
  PaginatedResponse,
  Category,
} from '@/types/admin'
import type { Product } from '@/types/product'
import { PRODUCTS_PER_PAGE } from '@/types/admin'

/**
 * Normaliza y valida el nombre de categoría contra la BD
 * Busca por nombre exacto en la tabla de categorías
 */
async function normalizeCategoryName(categoryValue: string): Promise<string> {
  if (!categoryValue) return categoryValue

  // Obtener categorías de la BD
  const response = await getCategories()
  if (!response.success || !response.data) {
    // Si falla, devolver el valor original
    return categoryValue
  }

  const dbCategories = response.data
  const normalized = categoryValue.toLowerCase().trim()

  // Buscar por nombre exacto (case-insensitive)
  const found = dbCategories.find(cat => cat.name.toLowerCase() === normalized)
  if (found) return found.name

  // Mapeo explícito de valores antiguos para compatibilidad
  const oldToNewMap: Record<string, string> = {
    'accesorios-celular': 'Accesorios para celular',
    'accesorios celular': 'Accesorios para celular',
  }

  if (oldToNewMap[normalized]) {
    return oldToNewMap[normalized]
  }

  // Si no se encuentra, devolver el valor original
  // (probablemente ya sea una categoría válida)
  return categoryValue
}

// ============================================================================
// LECTURA DE PRODUCTOS
// ============================================================================

/**
 * Obtiene todos los productos con paginación
 * @param page Número de página (1-indexed)
 * @param pageSize Cantidad de productos por página
 * @param search Búsqueda por nombre o descripción
 * @param category Filtrar por categoría
 */
export async function getProducts(
  page: number = 1,
  pageSize: number = PRODUCTS_PER_PAGE,
  search?: string,
  category?: string
): Promise<PaginatedResponse<AdminProductWithVariants>> {
  const supabase = await createServerClient()

  const offset = (page - 1) * pageSize

  // Contamos primero para saber el total
  let countQuery = supabase
    .from('products')
    .select('id', { count: 'exact', head: true })

  if (search) {
    countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (category) {
    countQuery = countQuery.ilike('category', category)
  }

  const { count, error: countError } = await countQuery

  if (countError) {
    throw new Error(`Error contando productos: ${countError.message}`)
  }

  // Obtenemos los datos con solo campos esenciales (sin variants completos en listado)
  let dataQuery = supabase
    .from('products')
    .select(
      'id, name, price, price_offer, image, category, slug, stock, has_quantity_variants, has_flavor_variants, created_at'
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (search) {
    dataQuery = dataQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (category) {
    dataQuery = dataQuery.ilike('category', category)
  }

  const { data, error: dataError } = await dataQuery

  if (dataError) {
    throw new Error(`Error obteniendo productos: ${dataError.message}`)
  }

  const products = (data || []) as AdminProductWithVariants[]
  
  console.log('[GET_PRODUCTS] Productos traídos:', {
    count: products.length,
    sampleProduct: products[0] ? {
      id: products[0].id,
      name: products[0].name,
    } : null,
  })

  const total = count || 0
  const totalPages = Math.ceil(total / pageSize)

  return {
    items: products,
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  }
}

/**
 * Obtiene TODOS los productos (sin paginación) - Para selectores
 * Solo devuelve campos básicos
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image, category, slug')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error al obtener todos los productos:', error)
    return []
  }

  return (data || []) as Product[]
}

/**
 * Obtiene un producto por ID con sus variantes
 */
export async function getProductById(id: number): Promise<AdminProductWithVariants | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('products')
    .select(
      `*,
      product_variants(*,
        product_variant_values(
          variant_type_id,
          variant_types!inner(id, name, display_name),
          variant_value_id,
          variant_values!inner(id, value, color_hex)
        )
      )`
    )
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // No encontrado
    }
    throw new Error(`Error obteniendo producto: ${error.message}`)
  }

  return data as AdminProductWithVariants
}

/**
 * Verifica si un slug ya existe (para evitar duplicados)
 */
export async function slugExists(slug: string, excludeId?: number): Promise<boolean> {
  const supabase = await createServerClient()

  let query = supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { count, error } = await query

  if (error) {
    throw new Error(`Error verificando slug: ${error.message}`)
  }

  return (count || 0) > 0
}

// ============================================================================
// CREACIÓN DE PRODUCTOS
// ============================================================================

/**
 * Crea un nuevo producto
 */
export async function createProduct(
  productData: CreateProductDTO
): Promise<AdminProductWithVariants> {
  const supabase = await createServerClient()

  console.log('[CREATE_PRODUCT] Recibido:', {
    product: productData.name,
  })

  // Validar slug único
  const exists = await slugExists(productData.slug)
  if (exists) {
    throw new Error('Ya existe un producto con este slug')
  }

  // Normalizar categoría usando la nueva función
  const normalizedCategory = await normalizeCategoryName(productData.category)

  const dataToInsert = {
    ...productData,
    category: normalizedCategory,
  }

  // Crear producto
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert([dataToInsert])
    .select()
    .single()

  if (productError) {
    throw new Error(`Error creando producto: ${productError.message}`)
  }

  return product as AdminProductWithVariants
}

// ============================================================================
// ACTUALIZACIÓN DE PRODUCTOS
// ============================================================================

/**
 * Actualiza un producto existente
 */
export async function updateProduct(data: UpdateProductDTO): Promise<AdminProductWithVariants> {
  const supabase = await createServerClient()

  const { id, ...updates } = data

  // Si se cambió el slug, validar unicidad
  if (updates.slug) {
    const exists = await slugExists(updates.slug, id)
    if (exists) {
      throw new Error('Ya existe un producto con este slug')
    }
  }

  // Normalizar categoría si está presente
  const normalizedUpdates = {
    ...updates,
    ...(updates.category && {
      category: await normalizeCategoryName(updates.category),
    }),
  }

  const { data: updated, error } = await supabase
    .from('products')
    .update(normalizedUpdates)
    .eq('id', id)
    .select(
      `*,
      product_variants(*,
        product_variant_values(
          variant_type_id,
          variant_types!inner(id, name, display_name),
          variant_value_id,
          variant_values!inner(id, value, color_hex)
        )
      )`
    )
    .single()

  if (error) {
    throw new Error(`Error actualizando producto: ${error.message}`)
  }

  return updated as AdminProductWithVariants
}

// ============================================================================
// ELIMINACIÓN DE PRODUCTOS
// ============================================================================

/**
 * Elimina un producto y todas sus variantes en cascada
 */
export async function deleteProduct(id: number): Promise<void> {
  const supabase = await createServerClient()

  // Las variantes se eliminan automáticamente por FK CASCADE
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Error eliminando producto: ${error.message}`)
  }
}

// ============================================================================
// MANEJO DE IMÁGENES
// ============================================================================

/**
 * Sube una imagen de producto a Supabase Storage
 */
export async function uploadProductImageAction(
  file: File,
  productId: number
): Promise<string> {
  const supabase = await createServerClient()

  // Generar nombre de archivo único
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  const extension = file.name.split('.').pop()
  const filename = `product-${productId}-${timestamp}-${random}.${extension}`
  const filepath = `products/${productId}/${filename}`

  // Subir archivo
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filepath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`)
  }

  // Obtener URL pública
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filepath)

  return publicUrlData.publicUrl
}

// ============================================================================
// GESTIÓN DE VARIANT_TYPES (Tipos de Variantes)
// ============================================================================

/**
 * Obtiene todos los tipos de variantes activos
 */
export async function getVariantTypes(): Promise<VariantType[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('variant_types')
    .select('*')
    .eq('is_active', true)
    .order('order_index')

  if (error) {
    throw new Error(`Error obteniendo tipos de variantes: ${error.message}`)
  }

  return data as VariantType[]
}

/**
 * Crea un nuevo tipo de variante
 */
export async function createVariantType(data: {
  name: string
  display_name: string
  description?: string
  order_index?: number
}): Promise<VariantType> {
  const supabase = await createServerClient()

  const { data: result, error } = await supabase
    .from('variant_types')
    .insert([data])
    .select()
    .single()

  if (error) {
    throw new Error(`Error creando tipo de variante: ${error.message}`)
  }

  return result as VariantType
}

/**
 * Actualiza un tipo de variante
 */
export async function updateVariantType(
  id: number,
  data: Partial<{
    name: string
    display_name: string
    description: string
    order_index: number
    is_active: boolean
  }>
): Promise<VariantType> {
  const supabase = await createServerClient()

  const { data: result, error } = await supabase
    .from('variant_types')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error actualizando tipo de variante: ${error.message}`)
  }

  return result as VariantType
}

/**
 * Elimina un tipo de variante (soft delete)
 */
export async function deleteVariantType(id: number): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('variant_types')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    throw new Error(`Error eliminando tipo de variante: ${error.message}`)
  }
}

// ============================================================================
// GESTIÓN DE VARIANT_VALUES (Valores de Variantes)
// ============================================================================

/**
 * Obtiene los valores de un tipo de variante
 */
export async function getVariantValues(variantTypeId: number): Promise<VariantValue[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('variant_values')
    .select('*')
    .eq('variant_type_id', variantTypeId)
    .eq('is_active', true)
    .order('order_index')

  if (error) {
    throw new Error(`Error obteniendo valores de variante: ${error.message}`)
  }

  return data as VariantValue[]
}

/**
 * Crea un nuevo valor de variante
 */
export async function createVariantValue(data: {
  variant_type_id: number
  value: string
  color_hex?: string
  order_index?: number
}): Promise<VariantValue> {
  const supabase = await createServerClient()

  const { data: result, error } = await supabase
    .from('variant_values')
    .insert([data])
    .select()
    .single()

  if (error) {
    throw new Error(`Error creando valor de variante: ${error.message}`)
  }

  return result as VariantValue
}

/**
 * Actualiza un valor de variante
 */
export async function updateVariantValue(
  id: number,
  data: Partial<{
    value: string
    color_hex: string
    order_index: number
    is_active: boolean
  }>
): Promise<VariantValue> {
  const supabase = await createServerClient()

  const { data: result, error } = await supabase
    .from('variant_values')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Error actualizando valor de variante: ${error.message}`)
  }

  return result as VariantValue
}

/**
 * Elimina un valor de variante (soft delete)
 */
export async function deleteVariantValue(id: number): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('variant_values')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    throw new Error(`Error eliminando valor de variante: ${error.message}`)
  }
}

// ============================================================================
// GESTIÓN DE PRODUCT_VARIANTS (Variantes de Productos)
// ============================================================================

/**
 * Obtiene las variantes de un producto
 */
export async function getProductVariants(productId: number): Promise<ProductVariantWithDetails[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .eq('is_active', true)

  if (error) {
    throw new Error(`Error obteniendo variantes de producto: ${error.message}`)
  }

  return data as ProductVariantWithDetails[]
}

/**
 * Crea una variante de producto
 */
export async function createProductVariant(data: {
  product_id: number
  sku?: string
  name: string
  description?: string
  price: number
  price_offer?: number
  stock_quantity?: number
  stock_status?: 'out' | 'low' | 'medium' | 'high'
  attributes: { variant_type_id: number; variant_value_id: number }[]
}): Promise<ProductVariantWithDetails> {
  const supabase = await createServerClient()

  // Extraer atributos y datos de variante
  const { attributes, ...variantData } = data

  // Insertar variante con todos los campos explícitos
  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .insert([{
      product_id: variantData.product_id,
      sku: variantData.sku || null,
      name: variantData.name,
      description: variantData.description || null,
      price: variantData.price,
      price_offer: variantData.price_offer || null,
      stock_quantity: variantData.stock_quantity || 0,
      stock_status: variantData.stock_status || 'high',
      is_active: true,
    }])
    .select()
    .single()

  if (variantError) {
    throw new Error(`Error creando variante: ${variantError.message}`)
  }

  // Insertar atributos
  if (attributes.length > 0) {
    const attributeRecords = attributes.map((attr) => ({
      product_variant_id: variant.id,
      variant_type_id: attr.variant_type_id,
      variant_value_id: attr.variant_value_id,
    }))

    const { error: attrError } = await supabase
      .from('product_variant_values')
      .insert(attributeRecords)

    if (attrError) {
      // Rollback: eliminar variante creada
      await supabase.from('product_variants').delete().eq('id', variant.id)
      throw new Error(`Error creando atributos: ${attrError.message}`)
    }
  }

  // Obtener variante completa
  return getProductVariantById(variant.id) as Promise<ProductVariantWithDetails>
}

/**
 * Obtiene una variante por ID
 */
export async function getProductVariantById(id: number): Promise<ProductVariantWithDetails | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(`Error obteniendo variante: ${error.message}`)
  }

  // Obtener atributos
  const { data: attributes } = await supabase
    .from('product_variant_values')
    .select('*, variant_type:variant_types(*), variant_value:variant_values(*)')
    .eq('product_variant_id', id)

  return {
    ...data,
    attributes: attributes || [],
  } as ProductVariantWithDetails
}

/**
 * Actualiza una variante de producto
 */
export async function updateProductVariant(
  id: number,
  data: Partial<{
    sku: string
    name: string
    description: string
    price: number
    price_offer: number
    stock_quantity: number
    stock_status: 'out' | 'low' | 'medium' | 'high'
    is_active: boolean
    attributes: { variant_type_id: number; variant_value_id: number }[]
  }>
): Promise<ProductVariantWithDetails> {
  const supabase = await createServerClient()

  const { attributes, ...variantData } = data

  // Actualizar variante
  const { data: variant, error: variantError } = await supabase
    .from('product_variants')
    .update({ ...variantData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (variantError) {
    throw new Error(`Error actualizando variante: ${variantError.message}`)
  }

  // Actualizar atributos si se proporcionaron
  if (attributes) {
    // Eliminar atributos existentes
    await supabase.from('product_variant_values').delete().eq('product_variant_id', id)

    // Insertar nuevos atributos
    if (attributes.length > 0) {
      const attributeRecords = attributes.map((attr) => ({
        product_variant_id: id,
        variant_type_id: attr.variant_type_id,
        variant_value_id: attr.variant_value_id,
      }))

      const { error: attrError } = await supabase
        .from('product_variant_values')
        .insert(attributeRecords)

      if (attrError) {
        throw new Error(`Error actualizando atributos: ${attrError.message}`)
      }
    }
  }

  return getProductVariantById(id) as Promise<ProductVariantWithDetails>
}

/**
 * Elimina una variante de producto
 */
export async function deleteProductVariant(id: number): Promise<void> {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('product_variants')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    throw new Error(`Error eliminando variante: ${error.message}`)
  }
}

// ============================================================================
// TIPOS AUXILIARES
// ============================================================================

interface VariantType {
  id: number
  name: string
  display_name: string
  description?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface VariantValue {
  id: number
  variant_type_id: number
  value: string
  color_hex?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ProductVariantWithDetails {
  id: number
  product_id: number
  sku?: string
  name: string
  description?: string
  price: number
  price_offer?: number
  discount_percentage?: number
  stock_quantity: number
  stock_status: 'out' | 'low' | 'medium' | 'high'
  is_active: boolean
  created_at: string
  updated_at: string
  attributes?: {
    variant_type_id: number
    variant_type?: VariantType
    variant_value_id: number
    variant_value?: VariantValue
  }[]
}
