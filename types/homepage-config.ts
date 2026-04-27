// Homepage Configuration Types

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_key: string;
  link?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedProductsMapping {
  id: string;
  product_id: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewArrivalsMapping {
  id: string;
  product_id: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GeneralProductsMapping {
  id: string;
  product_id: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// DTOs para crear/actualizar

export interface CreateBannerDTO {
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  image_key: string;
  link?: string;
  position: number;
}

export interface UpdateBannerDTO {
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  image_key?: string;
  link?: string;
  position?: number;
  is_active?: boolean;
}

export interface CreateProductMappingDTO {
  product_id: string;
  position: number;
}

export interface UpdateProductMappingDTO {
  position?: number;
  is_active?: boolean;
}

// Respuestas combinadas (con detalles de producto)

export interface BannerWithProduct extends Banner {
  product?: any;
}

export interface FeaturedProductsWithDetails extends FeaturedProductsMapping {
  product: any;
}

export interface NewArrivalsWithDetails extends NewArrivalsMapping {
  product: any;
}

export interface GeneralProductsWithDetails extends GeneralProductsMapping {
  product: any;
}

// Featured Categories Config
export interface FeaturedCategoryConfig {
  id: string;
  category_name: string;
  category_slug: string;
  image_url: string;
  image_key: string;
  redirect_link?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeaturedCategoryDTO {
  category_name: string;
  category_slug: string;
  image_url: string;
  image_key: string;
  redirect_link?: string;
  position: number;
}

export interface UpdateFeaturedCategoryDTO {
  category_name?: string;
  category_slug?: string;
  image_url?: string;
  image_key?: string;
  redirect_link?: string;
  position?: number;
  is_active?: boolean;
}

// Promo Banner Config
export interface PromoBannerConfig {
  id: string;
  title: string;
  category_slug: string;
  image_url: string;
  image_key: string;
  redirect_link?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePromoBannerDTO {
  title: string;
  category_slug: string;
  image_url: string;
  image_key: string;
  redirect_link?: string;
}

export interface UpdatePromoBannerDTO {
  title?: string;
  category_slug?: string;
  image_url?: string;
  image_key?: string;
  redirect_link?: string;
  is_active?: boolean;
}
