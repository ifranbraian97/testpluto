'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase/server';
import {
  Banner,
  FeaturedProductsMapping,
  NewArrivalsMapping,
  GeneralProductsMapping,
  CreateBannerDTO,
  UpdateBannerDTO,
  CreateProductMappingDTO,
  UpdateProductMappingDTO,
  FeaturedCategoryConfig,
  CreateFeaturedCategoryDTO,
  UpdateFeaturedCategoryDTO,
  PromoBannerConfig,
  CreatePromoBannerDTO,
  UpdatePromoBannerDTO,
} from '@/types/homepage-config';
import { ApiResponse, PaginatedResponse } from '@/types/admin';

// ============================================
// BANNERS - CRUD Operations
// ============================================

export async function getBanners(): Promise<ApiResponse<Banner[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener banners',
    };
  }
}

export async function getAllBanners(): Promise<ApiResponse<Banner[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching all banners:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener banners',
    };
  }
}

export async function createBanner(input: CreateBannerDTO): Promise<ApiResponse<Banner>> {
  try {
    const supabase = await createServerClient();

    // Revalidate homepage cache after making changes
    revalidatePath('/');
    const { data: existingBanners } = await supabase
      .from('banners')
      .select('id')
      .eq('is_active', true);

    if ((existingBanners?.length || 0) >= 3) {
      return {
        success: false,
        error: 'No se pueden agregar más de 3 banners activos',
      };
    }

    const { data, error } = await supabase
      .from('banners')
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return {
      success: false,
      error: error.message || 'Error al crear banner',
    };
  }
}

export async function updateBanner(id: string, input: UpdateBannerDTO): Promise<ApiResponse<Banner>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('banners')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar banner',
    };
  }
}

export async function deleteBanner(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('banners').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar banner',
    };
  }
}

// ============================================
// FEATURED PRODUCTS - CRUD Operations
// ============================================

export async function getFeaturedProducts(): Promise<ApiResponse<FeaturedProductsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_products_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching featured products:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener productos destacados',
    };
  }
}

export async function getAllFeaturedProducts(): Promise<ApiResponse<FeaturedProductsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_products_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching all featured products:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener productos destacados',
    };
  }
}

export async function addFeaturedProduct(input: CreateProductMappingDTO): Promise<ApiResponse<FeaturedProductsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    // Validar que no haya más de 8 productos destacados activos
    const { data: existingProducts } = await supabase
      .from('featured_products_mapping')
      .select('id')
      .eq('is_active', true);

    if ((existingProducts?.length || 0) >= 8) {
      return {
        success: false,
        error: 'No se pueden agregar más de 8 productos destacados',
      };
    }

    const { data, error } = await supabase
      .from('featured_products_mapping')
      .insert([{ ...input, is_active: true }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error adding featured product:', error);
    return {
      success: false,
      error: error.message || 'Error al agregar producto destacado',
    };
  }
}

export async function updateFeaturedProduct(
  id: string,
  input: UpdateProductMappingDTO,
): Promise<ApiResponse<FeaturedProductsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_products_mapping')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating featured product:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar producto destacado',
    };
  }
}

export async function removeFeaturedProduct(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('featured_products_mapping').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error removing featured product:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar producto destacado',
    };
  }
}

// ============================================
// NEW ARRIVALS - CRUD Operations
// ============================================

export async function getNewArrivals(): Promise<ApiResponse<NewArrivalsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('new_arrivals_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching new arrivals:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener nuevos ingresos',
    };
  }
}

export async function getAllNewArrivals(): Promise<ApiResponse<NewArrivalsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('new_arrivals_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching all new arrivals:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener nuevos ingresos',
    };
  }
}

export async function addNewArrival(input: CreateProductMappingDTO): Promise<ApiResponse<NewArrivalsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    // Validar que no haya más de 8 nuevos ingresos activos
    const { data: existingProducts } = await supabase
      .from('new_arrivals_mapping')
      .select('id')
      .eq('is_active', true);

    if ((existingProducts?.length || 0) >= 8) {
      return {
        success: false,
        error: 'No se pueden agregar más de 8 nuevos ingresos',
      };
    }

    const { data, error } = await supabase
      .from('new_arrivals_mapping')
      .insert([{ ...input, is_active: true }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error adding new arrival:', error);
    return {
      success: false,
      error: error.message || 'Error al agregar nuevo ingreso',
    };
  }
}

export async function updateNewArrival(
  id: string,
  input: UpdateProductMappingDTO,
): Promise<ApiResponse<NewArrivalsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('new_arrivals_mapping')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating new arrival:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar nuevo ingreso',
    };
  }
}

export async function removeNewArrival(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('new_arrivals_mapping').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error removing new arrival:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar nuevo ingreso',
    };
  }
}

// ============================================
// GENERAL PRODUCTS - CRUD Operations
// ============================================

export async function getGeneralProducts(): Promise<ApiResponse<GeneralProductsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('general_products_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching general products:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener productos en general',
    };
  }
}

export async function getAllGeneralProducts(): Promise<ApiResponse<GeneralProductsMapping[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('general_products_mapping')
      .select(`id, product_id, position, is_active, created_at, updated_at, product:products(id, name, price, image, category, slug)`)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching all general products:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener productos en general',
    };
  }
}

export async function addGeneralProduct(input: CreateProductMappingDTO): Promise<ApiResponse<GeneralProductsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    // Validar que no haya más de 12 productos generales activos
    const { data: existingProducts } = await supabase
      .from('general_products_mapping')
      .select('id')
      .eq('is_active', true);

    if ((existingProducts?.length || 0) >= 12) {
      return {
        success: false,
        error: 'No se pueden agregar más de 12 productos en general',
      };
    }

    const { data, error } = await supabase
      .from('general_products_mapping')
      .insert([{ ...input, is_active: true }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error adding general product:', error);
    return {
      success: false,
      error: error.message || 'Error al agregar producto en general',
    };
  }
}

export async function updateGeneralProduct(
  id: string,
  input: UpdateProductMappingDTO,
): Promise<ApiResponse<GeneralProductsMapping>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('general_products_mapping')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating general product:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar producto en general',
    };
  }
}

export async function removeGeneralProduct(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('general_products_mapping').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error removing general product:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar producto en general',
    };
  }
}

// ============================================
// FEATURED CATEGORIES CONFIG - CRUD Operations
// ============================================

export async function getFeaturedCategories(): Promise<ApiResponse<FeaturedCategoryConfig[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_categories_config')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching featured categories:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener categorías destacadas',
    };
  }
}

export async function getAllFeaturedCategories(): Promise<ApiResponse<FeaturedCategoryConfig[]>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_categories_config')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  } catch (error: any) {
    console.error('Error fetching all featured categories:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener categorías destacadas',
    };
  }
}

export async function upsertFeaturedCategory(
  input: CreateFeaturedCategoryDTO,
  position: number,
): Promise<ApiResponse<FeaturedCategoryConfig>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    // Obtener categoría existente en esa posición
    const { data: existing } = await supabase
      .from('featured_categories_config')
      .select('id')
      .eq('position', position)
      .single();

    let result;
    if (existing) {
      // Actualizar
      const { data, error } = await supabase
        .from('featured_categories_config')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Crear
      const { data, error } = await supabase
        .from('featured_categories_config')
        .insert([{ ...input, position, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Error upserting featured category:', error);
    return {
      success: false,
      error: error.message || 'Error al guardar categoría destacada',
    };
  }
}

export async function updateFeaturedCategory(
  id: string,
  input: UpdateFeaturedCategoryDTO,
): Promise<ApiResponse<FeaturedCategoryConfig>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('featured_categories_config')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating featured category:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar categoría destacada',
    };
  }
}

export async function deleteFeaturedCategory(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('featured_categories_config').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error deleting featured category:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar categoría destacada',
    };
  }
}

// ============================================
// PROMO BANNER CONFIG - CRUD Operations
// ============================================

export async function getPromoBanner(): Promise<ApiResponse<PromoBannerConfig>> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('promo_banner_config')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error('Error fetching promo banner:', error);
    return {
      success: false,
      error: error.message || 'Error al obtener banner promo',
    };
  }
}

export async function upsertPromoBanner(input: CreatePromoBannerDTO): Promise<ApiResponse<PromoBannerConfig>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    // Obtener si existe alguno
    const { data: existing } = await supabase
      .from('promo_banner_config')
      .select('id')
      .eq('is_active', true)
      .single();

    let result;
    if (existing) {
      // Actualizar
      const { data, error } = await supabase
        .from('promo_banner_config')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Crear
      const { data, error } = await supabase
        .from('promo_banner_config')
        .insert([{ ...input, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Error upserting promo banner:', error);
    return {
      success: false,
      error: error.message || 'Error al guardar banner promo',
    };
  }
}

export async function updatePromoBanner(
  id: string,
  input: UpdatePromoBannerDTO,
): Promise<ApiResponse<PromoBannerConfig>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('promo_banner_config')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('Error updating promo banner:', error);
    return {
      success: false,
      error: error.message || 'Error al actualizar banner promo',
    };
  }
}

export async function deletePromoBanner(id: string): Promise<ApiResponse<void>> {
  revalidatePath('/');
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.from('promo_banner_config').delete().eq('id', id);

    if (error) throw error;

    return {
      success: true,
      data: undefined,
    };
  } catch (error: any) {
    console.error('Error deleting promo banner:', error);
    return {
      success: false,
      error: error.message || 'Error al eliminar banner promo',
    };
  }
}
