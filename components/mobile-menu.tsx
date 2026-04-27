"use client"

import type React from "react"

import Link from "next/link"
import { Search, X, ChevronRight, Tag, HelpCircle, Phone, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { slugify } from "@/lib/utils/slugify"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { categories: dbCategories } = useCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-background z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <span className="text-foreground font-serif font-medium text-lg tracking-wide">Menú</span>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-2 -mr-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3.5 bg-secondary text-foreground rounded-lg text-sm placeholder-muted-foreground border border-border focus:border-primary/50 focus:outline-none transition-all"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md w-8 h-8"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="space-y-1 mb-8">
            <Link
              href="/como-comprar"
              className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover:bg-secondary transition-all py-3.5 px-4 rounded-lg font-medium"
              onClick={onClose}
            >
              <ShoppingBag className="w-5 h-5" />
              Cómo Comprar
            </Link>
            <Link
              href="/faqs"
              className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover:bg-secondary transition-all py-3.5 px-4 rounded-lg font-medium"
              onClick={onClose}
            >
              <HelpCircle className="w-5 h-5" />
              FAQs
            </Link>
            <Link
              href="/contacto"
              className="flex items-center gap-3 text-foreground/80 hover:text-foreground hover:bg-secondary transition-all py-3.5 px-4 rounded-lg font-medium"
              onClick={onClose}
            >
              <Phone className="w-5 h-5" />
              Contacto
            </Link>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-muted-foreground font-medium mb-4 text-xs uppercase tracking-widest px-4">Productos</h3>
            <div className="space-y-0.5">
              {dbCategories.map((category) => {
                const categorySlug = slugify(category.name)
                return (
                  <Link
                    key={category.id}
                    href={`/categoria/${categorySlug}`}
                    className="flex items-center justify-between text-foreground/70 hover:text-foreground hover:bg-secondary transition-all py-3.5 px-4 rounded-lg group"
                    onClick={onClose}
                  >
                    <span className="text-sm">{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
