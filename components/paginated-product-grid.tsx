"use client"

import { useMemo } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import ProductCard from "@/components/product-card"

interface Product {
  id: string | number
  name: string
  slug: string
  price: number
  price_offer?: number
  image: string
  category: string
  description?: string
  stock?: "out" | "low" | "medium" | "high"
  variants?: any[]
}

interface PaginatedProductGridProps {
  products: Product[]
  productsPerPage?: number
  showCategory?: boolean
}

export default function PaginatedProductGrid({
  products,
  productsPerPage = 12,
  showCategory = false,
}: PaginatedProductGridProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  // Get current page from URL, default to 1
  const currentPage = Number(searchParams.get("page")) || 1

  const totalPages = Math.ceil(products.length / productsPerPage)
  
  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)

  const paginatedProducts = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * productsPerPage
    const endIndex = startIndex + productsPerPage
    return products.slice(startIndex, endIndex)
  }, [products, validCurrentPage, productsPerPage])

  // Create URL with page parameter while preserving other params
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete("page")
    } else {
      params.set("page", page.toString())
    }
    const queryString = params.toString()
    return queryString ? `${pathname}?${queryString}` : pathname
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    
    if (totalPages <= 5) {
      // Show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (validCurrentPage > 3) {
        pages.push("ellipsis")
      }
      
      // Show pages around current page
      const start = Math.max(2, validCurrentPage - 1)
      const end = Math.min(totalPages - 1, validCurrentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (validCurrentPage < totalPages - 2) {
        pages.push("ellipsis")
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 sm:mt-10 md:mt-12">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href={validCurrentPage > 1 ? createPageUrl(validCurrentPage - 1) : "#"}
                  className={validCurrentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  aria-label="Pagina anterior"
                />
              </PaginationItem>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href={createPageUrl(page)}
                      isActive={validCurrentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href={validCurrentPage < totalPages ? createPageUrl(validCurrentPage + 1) : "#"}
                  className={validCurrentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  aria-label="Pagina siguiente"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          {/* Page Info */}
          <p className="text-center text-black/40 text-xs sm:text-sm mt-4">
            Mostrando {((validCurrentPage - 1) * productsPerPage) + 1} - {Math.min(validCurrentPage * productsPerPage, products.length)} de {products.length} productos
          </p>
        </div>
      )}
    </div>
  )
}
