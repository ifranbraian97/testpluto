// ============================================================================
// NUEVOS TIPOS: Sistema de Variantes 100% Personalizable
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

export interface ProductVariant {
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
  attributes?: ProductVariantAttribute[]
  created_at: string
  updated_at: string
}

export interface ProductVariantAttribute {
  type_id: number
  type_name: string
  value_id: number
  value_name: string
  color_hex?: string
}

export interface Product {
  id: number
  name: string
  price: number
  price_offer?: number
  discount_percentage?: number
  image: string
  category: string
  slug: string
  description?: string
  fullDescription?: string
  images?: string[]
  features?: string[]
  stock?: "out" | "low" | "medium" | "high"
  variants?: ProductVariant[]
  created_at?: string
  updated_at?: string
}
