'use server'

import { createServerClient } from '@/lib/supabase/server'
import { allProducts } from '@/data/all-products'

interface MigrationResult {
  success: boolean
  insertedCount: number
  errorCount: number
  totalProducts: number
  skippedDuplicates: number
  variantErrors: number
  errors?: Array<{ slug: string; error: string }>
  message?: string
}

export async function migrateProductsToSupabase(): Promise<MigrationResult> {
  const supabase = await createServerClient()
  
  const result: MigrationResult = {
    success: true,
    insertedCount: 0,
    errorCount: 0,
    totalProducts: allProducts.length,
    skippedDuplicates: 0,
    variantErrors: 0,
    errors: [],
    message: '',
  }

  try {
    console.log('🚀 Starting product migration...')
    console.log(`📦 Total products to migrate: ${allProducts.length}`)
    
    // Step 1: Get existing products to avoid duplicates
    const { data: existingProducts, error: fetchError } = await supabase
      .from('products')
      .select('slug')
    
    if (fetchError) {
      console.error('❌ Error fetching existing products:', fetchError)
      result.success = false
      result.message = `Failed to fetch existing products: ${fetchError.message}`
      result.errors?.push({ slug: 'system', error: `Fetch error: ${fetchError.message}` })
      return result
    }
    
    const existingSlugs = new Set((existingProducts || []).map((p: any) => p.slug))
    const productsToInsert = allProducts.filter(p => !existingSlugs.has(p.slug))
    
    result.skippedDuplicates = existingSlugs.size
    console.log(`✓ Products to insert: ${productsToInsert.length}`)
    console.log(`⚠️  Skipping duplicates: ${existingSlugs.size}`)

    if (productsToInsert.length === 0) {
      result.message = 'All products already migrated'
      return result
    }
    
    // Step 2: Insert products one by one with variants
    for (const product of productsToInsert) {
      try {
        // Validate required fields
        if (!product.name || !product.slug || !product.price || !product.category) {
          result.errorCount++
          result.errors?.push({ 
            slug: product.slug || 'unknown',
            error: 'Missing required fields: name, slug, price, or category'
          })
          console.warn(`⚠️  Skipping product with missing fields: ${product.slug}`)
          continue
        }

        // Insert product with proper type conversion
        const { data: insertedProduct, error: insertError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            description: product.description ?? null,
            full_description: product.fullDescription ?? null,
            price: Math.floor(Number(product.price)) || 0,
            category: product.category,
            slug: product.slug,
            image: product.image ?? null,
            images: Array.isArray(product.images) ? product.images : [],
            features: Array.isArray(product.features) ? product.features : [],
            stock: validateStock(product.stock) || 'medium',
          })
          .select('id, slug')
          .single()
        
        if (insertError || !insertedProduct) {
          result.errorCount++
          const errorMsg = insertError?.message || 'No product data returned'
          result.errors?.push({ slug: product.slug, error: errorMsg })
          console.error(`❌ Error inserting product ${product.slug}:`, insertError)
          continue
        }

        result.insertedCount++
        console.log(`✓ Inserted: ${product.slug} (id: ${insertedProduct.id})`)
        
      } catch (err) {
        result.errorCount++
        const errorMsg = err instanceof Error ? err.message : String(err)
        result.errors?.push({ slug: product.slug, error: errorMsg })
        console.error(`❌ Unexpected error for product ${product.slug}:`, err)
      }
    }
    
    // Final result
    result.success = result.errorCount === 0
    result.message = `Migration completed. Inserted: ${result.insertedCount}, Errors: ${result.errorCount}, Variant Issues: ${result.variantErrors}`
    
    console.log('✅ Migration Summary:', {
      success: result.success,
      inserted: result.insertedCount,
      errors: result.errorCount,
      variantErrors: result.variantErrors,
      duplicates: result.skippedDuplicates,
      total: result.totalProducts,
    })
    
    return result

  } catch (error) {
    result.success = false
    const errorMsg = error instanceof Error ? error.message : String(error)
    result.message = `Migration failed: ${errorMsg}`
    result.errors?.push({ slug: 'system', error: errorMsg })
    console.error('❌ Migration failed:', error)
    return result
  }
}

/**
 * Validates stock status enum value
 */
function validateStock(stock: any): string {
  const validStatuses = ['out', 'low', 'medium', 'high']
  const normalized = String(stock || 'medium').toLowerCase()
  return validStatuses.includes(normalized) ? normalized : 'medium'
}
