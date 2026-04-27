/**
 * Tipos para el módulo de administración
 * Sistema completamente refactorizado con variantes 100% personalizables
 */

// ============================================================================
// NUEVOS TIPOS: Sistema de Variantes Personalizable
// ============================================================================

export interface VariantType {
  id: number
  name: string
  display_name: string
  description?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface VariantValue {
  id: number
  variant_type_id: number
  value: string
  color_hex?: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminProductVariant {
  id: number
  product_id: number
  sku?: string
  name: string
  description?: string
  price: number
  price_offer?: number
  discount_percentage?: number
  stock_quantity: number
  stock_status: "out" | "low" | "medium" | "high"
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AdminProductVariantWithAttributes extends AdminProductVariant {
  attributes: VariantAttributeMap[]
}

export interface VariantAttributeMap {
  type_id: number
  type_name: string
  value_id: number
  value_name: string
  color_hex?: string
}

// ============================================================================
// TIPOS PARA PRODUCTOS
// ============================================================================

export interface AdminProduct {
  id: number
  name: string
  description?: string
  full_description?: string
  price: number
  price_offer?: number
  discount_percentage?: number
  category: string
  slug: string
  image?: string | null
  images?: string[] | null
  features?: string[] | null
  stock?: "out" | "low" | "medium" | "high"
  is_active?: boolean
  // Nuevos campos para variantes
  has_quantity_variants?: boolean
  has_flavor_variants?: boolean
  created_at?: string
  updated_at?: string
}

export interface AdminProductWithVariants extends AdminProduct {
  variants?: AdminProductVariantWithAttributes[]
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateProductDTO {
  name: string
  description?: string
  full_description?: string
  price: number
  price_offer?: number
  category: string
  slug: string
  image?: string
  images?: string[]
  features?: string[]
  stock?: "out" | "low" | "medium" | "high"
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: number
}

export interface CreateVariantTypeDTO {
  name: string
  display_name: string
  description?: string
}

export interface CreateVariantValueDTO {
  variant_type_id: number
  value: string
  color_hex?: string
}

export interface CreateProductVariantDTO {
  product_id: number
  sku?: string
  name: string
  description?: string
  price: number
  price_offer?: number
  stock_quantity?: number
  stock_status?: "out" | "low" | "medium" | "high"
  attributes: {
    variant_type_id: number
    variant_value_id: number
  }[]
}

export interface UpdateProductVariantDTO extends Partial<CreateProductVariantDTO> {
  id: number
}

// ============================================================================
// RESPUESTAS DE API
// ============================================================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasMore: boolean
}

export interface AdminProductsResponse
  extends ApiResponse<PaginatedResponse<AdminProductWithVariants>> {}

// ============================================================================
// CONSTANTES
// ============================================================================

export const ADMIN_STOCK_OPTIONS = [
  { value: "out", label: "Sin Stock" },
  { value: "low", label: "Stock Bajo" },
  { value: "medium", label: "Stock Medio" },
  { value: "high", label: "Stock Alto" },
] as const

export const PRODUCTS_PER_PAGE = 20

// ============================================================================
// CATEGORÍAS (OBSOLETO - Se obtienen dinámicamente)
// ============================================================================

export interface Category {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// ============================================================================
// VARIANTES LEGACY (para compatibilidad con código existente)
// ============================================================================

export interface QuantityVariant {
  id: number
  product_id: number
  min_quantity: number
  max_quantity?: number
  price: number
  price_offer?: number
  discount_percentage?: number
  stock?: 'out' | 'low' | 'medium' | 'high'
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface FlavorVariant {
  id: number
  product_id: number
  name: string
  description?: string
  price: number
  price_offer?: number
  discount_percentage?: number
  stock?: 'out' | 'low' | 'medium' | 'high'
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// Extender AdminProductWithVariants para incluir variantes legacy
export interface AdminProductWithVariants extends AdminProduct {
  variants?: AdminProductVariantWithAttributes[]
  quantity_variants?: QuantityVariant[]
  flavor_variants?: FlavorVariant[]
}
