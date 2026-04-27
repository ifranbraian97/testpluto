"use client"

import { useState } from "react"
import { useHomepageData } from "@/hooks/use-homepage-data"
import ProductCard from "@/components/product-card"

function AllProductsSection() {
  const { generalProducts, loading } = useHomepageData()

  if (loading) {
    return (
      <section className="w-full bg-neutral-50 py-10 sm:py-12 md:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 bg-muted rounded mb-12"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-square mb-3 sm:mb-4 bg-muted rounded-xl sm:rounded-2xl"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (generalProducts.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-neutral-50 py-10 sm:py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight">
            Nuestros Productos
          </h2>
          <div className="mt-3 sm:mt-4 h-1 w-12 sm:w-16 bg-primary" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8" suppressHydrationWarning>
          {generalProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  )
}

export default AllProductsSection

