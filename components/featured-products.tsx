"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getCategorySlug } from "@/lib/utils/category-slug"
import { useHomepageData } from "@/hooks/use-homepage-data"
import ProductCard from "@/components/product-card"

function FeaturedProducts() {
  const { featuredProducts, loading } = useHomepageData()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView)

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const visibleProducts = useMemo(
    () => featuredProducts.slice(currentIndex, currentIndex + itemsPerView),
    [featuredProducts, currentIndex, itemsPerView],
  )

  if (loading) {
    return (
      <section className="w-full bg-background py-16 sm:py-20 md:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-32 bg-muted rounded mb-12"></div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="aspect-square mb-4 sm:mb-6 bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-background py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12 sm:mb-14 md:mb-16 lg:mb-20">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground tracking-tight">
              Destacados
            </h2>
            <div className="mt-4 sm:mt-6 h-px w-16 sm:w-20 bg-primary" />
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 sm:p-4 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 sm:p-4 rounded-full border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10" suppressHydrationWarning>
          {visibleProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="flex sm:hidden justify-center gap-3 mt-8">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full border border-border text-muted-foreground"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full border border-border text-muted-foreground"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
