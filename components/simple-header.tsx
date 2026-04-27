import Image from "next/image"
import Link from "next/link"
import { Home, ShoppingBag } from "lucide-react"

interface SimpleHeaderProps {
  title?: string
  showShoppingBag?: boolean
}

export default function SimpleHeader({ title, showShoppingBag = true }: SimpleHeaderProps) {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/images/logo-usa-import-navidad.webp"
              alt="USA IMPORT"
              width={180}
              height={90}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Title (center) */}
          {title && (
            <h1 className="hidden md:block text-lg font-semibold text-foreground">{title}</h1>
          )}

          {/* Navigation links (right) */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Inicio</span>
            </Link>

            {showShoppingBag && (
              <Link
                href="/carrito"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Carrito</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
