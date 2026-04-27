'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface ProductWithVariants {
  id: number
  name: string
  description?: string
  full_description?: string
  price: number
  category: string
  slug: string
  image?: string
  images?: string[]
  features?: string[]
  stock?: 'out' | 'low' | 'medium' | 'high'
  has_quantity_variants?: boolean
  has_flavor_variants?: boolean
  created_at?: string
  updated_at?: string
  quantity_variants?: Array<{
    id: number
    product_id: number
    min_quantity: number
    max_quantity?: number
    price: number
    created_at?: string
    updated_at?: string
  }>
  flavor_variants?: Array<{
    id: number
    product_id: number
    name: string
    stock?: 'out' | 'low' | 'medium' | 'high'
    created_at?: string
    updated_at?: string
  }>
}

export function useProductsRealtime(category?: string) {
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  let channel: RealtimeChannel | null = null
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let query = supabase
          .from('products')
          .select('id, name, price, image, category, slug, stock')
          .limit(100)
        
        if (category) {
          query = query.eq('category', category)
        }
        
        const { data, error: fetchError } = await query
        
        if (fetchError) {
          setError(fetchError.message)
          return
        }
        
        setProducts(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
    
    // Subscribe to realtime changes
    channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev: ProductWithVariants[]) => [...prev, payload.new as ProductWithVariants])
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev: ProductWithVariants[]) =>
              prev.map((p: ProductWithVariants) => (p.id === payload.new.id ? (payload.new as ProductWithVariants) : p))
            )
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev: ProductWithVariants[]) => prev.filter((p: ProductWithVariants) => p.id !== payload.old.id))
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quantity_variants' },
        (payload: any) => {
          const productId = payload.new?.product_id || payload.old?.product_id
          
          setProducts((prev: ProductWithVariants[]) =>
            prev.map((p: ProductWithVariants) => {
              if (p.id === productId) {
                // Refetch variants for this product
                return {
                  ...p,
                  quantity_variants: undefined, // Will be refetched on next render
                }
              }
              return p
            })
          )
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'flavor_variants' },
        (payload: any) => {
          const productId = payload.new?.product_id || payload.old?.product_id
          
          setProducts((prev: ProductWithVariants[]) =>
            prev.map((p: ProductWithVariants) => {
              if (p.id === productId) {
                // Refetch variants for this product
                return {
                  ...p,
                  flavor_variants: undefined, // Will be refetched on next render
                }
              }
              return p
            })
          )
        }
      )
      .subscribe()
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [category])
  
  return { products, loading, error }
}

export function useProductRealtime(productId: number) {
  const [product, setProduct] = useState<ProductWithVariants | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  let channel: RealtimeChannel | null = null
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(
            `
            *,
            quantity_variants(*),
            flavor_variants(*)
            `
          )
          .eq('id', productId)
          .single()
        
        if (fetchError) {
          setError(fetchError.message)
          return
        }
        
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
    
    // Subscribe to realtime changes for this specific product
    channel = supabase
      .channel(`product-${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProduct(payload.new as ProductWithVariants)
          } else if (payload.eventType === 'DELETE') {
            setProduct(null)
          }
        }
      )
      .subscribe()
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [productId])
  
  return { product, loading, error }
}
