"use client"

import type React from "react"

import { useState, memo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import MobileMenu from "@/components/mobile-menu"
import { useCategories } from "@/hooks/use-categories"
import { slugify } from "@/lib/utils/slugify"
import AnnouncementBar from "@/components/announcement-bar"

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProductsOpen, setIsProductsOpen] = useState(false)
  const { totalItems } = useCart()
  const { categories: dbCategories, loading: categoriesLoading } = useCategories()

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`
      }
    },
    [searchQuery],
  )

  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), [])
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), [])

  return (
    <header className="bg-background">
      <AnnouncementBar />

      {/* Mobile Header - Logo Centered with Menu and Cart */}
      <div className="md:hidden px-4 py-4 flex items-center justify-center relative border-b border-border">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo-usa-import-navidad.webp"
            alt="USA IMPORT"
            width={180}
            height={90}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <div className="absolute right-4">
          <Link href="/carrito">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-secondary relative rounded-full w-10 h-10 transition-all duration-200"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 text-foreground hover:bg-secondary rounded-full w-10 h-10"
          onClick={openMobileMenu}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <nav className="hidden md:block px-4 md:px-8 py-5 border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left - Navigation */}
          <div className="flex items-center gap-1 flex-1">
            <div
              className="relative"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-foreground hover:text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 text-sm font-medium tracking-wide">
                PRODUCTOS
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isProductsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-background border border-border rounded-lg shadow-xl py-2 z-50">
                  <div className="max-h-[400px] overflow-y-auto">
                    {dbCategories.map((category) => {
                      const categorySlug = slugify(category.name)
                      return (
                        <Link
                          key={category.id}
                          href={`/categoria/${categorySlug}`}
                          className="block px-4 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-150 text-sm"
                        >
                          {category.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/faqs"
              className="text-foreground hover:text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 text-sm font-medium tracking-wide"
            >
              IMPORTANTE
            </Link>

            <Link
              href="/contacto"
              className="text-foreground hover:text-primary px-4 py-2 rounded-full hover:bg-secondary transition-all duration-200 text-sm font-medium tracking-wide"
            >
              CONTACTO
            </Link>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex-shrink-0 mx-8">
            <Image
              src="/images/logo-usa-import-navidad.webp"
              alt="USA IMPORT"
              width={180}
              height={90}
              className="h-14 w-auto"
              priority
            />
          </Link>

          {/* Right - Search & Cart */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <form onSubmit={handleSearch} className="flex max-w-xs">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-2.5 bg-secondary text-foreground rounded-full text-sm placeholder-muted-foreground border border-border focus:border-primary/50 focus:bg-background focus:outline-none transition-all duration-200"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            <Link href="/carrito">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary relative rounded-full w-11 h-11 transition-all duration-200"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </header>
  )
}

export default memo(Header)
