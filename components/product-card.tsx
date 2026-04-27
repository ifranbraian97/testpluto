"use client"

import type React from "react"

import { useState, memo, useCallback } from "react"
import Link from "next/link"
import type { Product } from "@/data/featured-products"
import { getCategorySlug } from "@/lib/utils/category-slug"

interface ProductCardProps {
  product: Product
}

function getStockBadge(stock?: "out" | "low" | "medium" | "high") {
  if (!stock || stock === "high") return null

  const variants = {
    out: { label: "Agotado", className: "bg-foreground text-background" },
    low: { label: "Últimas unidades", className: "bg-primary text-primary-foreground" },
    medium: { label: "Stock limitado", className: "bg-accent text-accent-foreground" },
  }

  const config = variants[stock]
  return (
    <span className={`${config.className} text-[10px] font-medium px-2.5 py-1 rounded-sm tracking-wide uppercase`}>
      {config.label}
    </span>
  )
}

function calculateDiscount(price: number, priceOffer?: number): number {
  if (!priceOffer || priceOffer <= 0 || priceOffer >= price) return 0
  return Math.round(((price - priceOffer) / price) * 100)
}

function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("")
  const [currentPrice, setCurrentPrice] = useState<number>(product.price || 0)
  const [currentPriceOffer, setCurrentPriceOffer] = useState<number | null>(product.price_offer || null)

  const handleVariantChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const variantId = e.target.value
      setSelectedVariantId(variantId)

      const selectedVariant = product.variants?.find((v) => v.id === variantId)
      if (selectedVariant) {
        setCurrentPrice(selectedVariant.price)
        setCurrentPriceOffer(selectedVariant.price_offer || null)
      } else {
        setCurrentPrice(product.price)
        setCurrentPriceOffer(product.price_offer || null)
      }
    },
    [product.variants, product.price, product.price_offer],
  )

  const discount = calculateDiscount(currentPrice, currentPriceOffer)
  const categorySlug = getCategorySlug(product.category)

  // Calcular rango de precios si hay variantes
  const hasVariants = product.variants && product.variants.length > 0
  let minPrice = product.price
  let maxPrice = product.price
  let minPriceOffer = product.price_offer || null
  let maxPriceOffer = product.price_offer || null
  let maxDiscountAvailable = discount

  if (hasVariants) {
    // Calcular precios de todas las variantes + modelo base
    const allPrices = [product.price, ...product.variants.map(v => v.price)]
    minPrice = Math.min(...allPrices)
    maxPrice = Math.max(...allPrices)
    
    // Calcular precios con oferta
    const allPriceOffers = product.price_offer && product.price_offer > 0 ? [product.price_offer] : []
    product.variants.forEach(v => {
      if (v.price_offer && v.price_offer > 0) {
        allPriceOffers.push(v.price_offer)
      }
    })
    
    if (allPriceOffers.length > 0) {
      minPriceOffer = Math.min(...allPriceOffers)
      maxPriceOffer = Math.max(...allPriceOffers)
    }

    // Calcular el máximo descuento disponible
    if (hasVariants) {
      const allDiscounts = [
        calculateDiscount(product.price, product.price_offer),
        ...product.variants.map(v => calculateDiscount(v.price, v.price_offer))
      ]
      maxDiscountAvailable = Math.max(...allDiscounts)
    }
  }

  // Mostrar siempre el descuento actual de la selección (variante o base)
  const displayDiscount = discount

  return (
    <Link href={`/categoria/${categorySlug}/${product.slug}`} prefetch={false} className="group block">
      <div className="bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-border">
        {/* Image container */}
        <div className="aspect-square relative overflow-hidden bg-secondary">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Stock Badge */}
          {product.stock && product.stock !== "high" && (
            <div className="absolute top-3 left-3 z-10">{getStockBadge(product.stock)}</div>
          )}

          {/* Discount Badge - mostrar el descuento máximo disponible */}
          {displayDiscount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow-lg">
              -{displayDiscount}%
            </div>
          )}
          
          {/* Variants Badge */}
          {hasVariants && (
            <div className="absolute bottom-3 right-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              +{product.variants.length - 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-xs sm:text-sm font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
            {product.name}
          </h3>

          {hasVariants && product.variants.some((v) => v.price) && (
            <div className="mb-4" onClick={(e) => e.preventDefault()}>
              <select
                value={selectedVariantId}
                onChange={handleVariantChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
              >
                <option value="">Modelo base</option>
                {product.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.name}
                    {variant.price_offer && variant.price_offer > 0
                      ? ` - $${variant.price_offer.toLocaleString("es-AR")} (Oferta)`
                      : variant.price ? ` - $${variant.price.toLocaleString("es-AR")}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Display - Mostrar precio de oferta como precio principal */}
          <div className="space-y-1">
            {currentPriceOffer && currentPriceOffer > 0 ? (
              <>
                <p className="text-lg sm:text-xl font-bold text-red-600">
                  ${currentPriceOffer.toLocaleString("es-AR")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs line-through text-gray-400">
                    ${currentPrice.toLocaleString("es-AR")}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-lg sm:text-xl font-semibold text-foreground">
                ${currentPrice.toLocaleString("es-AR")}
              </p>
            )}
            
            {/* Mostrar rango de precios si hay variantes y estamos viendo el modelo base - priorizar precios de oferta */}
            {hasVariants && !selectedVariantId && (
              <p className="text-xs text-gray-500 mt-2 font-medium">
                {minPriceOffer && maxPriceOffer && minPriceOffer !== maxPriceOffer
                  ? `Desde $${minPriceOffer.toLocaleString("es-AR")}`
                  : minPriceOffer && minPriceOffer > 0
                  ? `Desde $${minPriceOffer.toLocaleString("es-AR")}`
                  : minPrice !== maxPrice
                  ? `Desde $${minPrice.toLocaleString("es-AR")}`
                  : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default memo(ProductCard)
