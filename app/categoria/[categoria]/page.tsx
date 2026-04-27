import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getProductsByCategory, getCategories } from "@/app/actions/product-crud"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PaginatedProductGrid from "@/components/paginated-product-grid"
import { slugify } from "@/lib/utils/slugify"

// Dynamic route with database queries - fetch fresh data
export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{
    categoria: string
  }>
  searchParams: Promise<{
    buscar?: string
    page?: string
  }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoria } = await params
  const { buscar } = await searchParams
  const searchQuery = buscar?.toLowerCase() || ""

  // Get categories from database
  const categoriesResult = await getCategories()
  const dbCategories = categoriesResult.data || []

  const category = dbCategories.find((cat) => {
    const categorySlug = slugify(cat.name)
    return categorySlug === categoria
  })

  if (!category) {
    notFound()
  }

  // Get products from database
  const categoryResult = await getProductsByCategory(category.name)
  let categoryProducts = categoryResult.data || []

  if (searchQuery) {
    categoryProducts = categoryProducts.filter(
      (product: any) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        (product.description?.toLowerCase() || "").includes(searchQuery),
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="min-h-screen bg-white">
        {/* Minimal Breadcrumb */}
        <div className="border-b border-black/5">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm">
              <Link href="/" className="text-black/40 hover:text-black transition-colors">
                Inicio
              </Link>
              <ChevronRight className="h-3 w-3 text-black/30" />
              <span className="text-black/60 truncate">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-16">
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-14">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-black tracking-tight">
              {searchQuery ? `Resultados: "${buscar}"` : category.name}
            </h1>
            <p className="text-black/50 text-sm sm:text-base md:text-lg">
              {searchQuery
                ? `${categoryProducts.length} ${categoryProducts.length === 1 ? "producto encontrado" : "productos encontrados"}`
                : `${categoryProducts.length} productos disponibles`}
            </p>

            {searchQuery && (
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                {allCategories.slice(0, 6).map((cat) => {
                  const catSlug = slugify(cat.name)
                  return (
                    <Link
                      key={catSlug}
                      href={`/categoria/${catSlug}?buscar=${encodeURIComponent(buscar || "")}`}
                      className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 ${
                        catSlug === categoria ? "bg-black text-white" : "bg-gray-100 text-black/70 hover:bg-gray-200"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {categoryProducts.length > 0 ? (
            <PaginatedProductGrid products={categoryProducts} productsPerPage={12} />
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <p className="text-black/50 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                {searchQuery
                  ? `No encontramos productos para "${buscar}" en esta categoria.`
                  : "No hay productos disponibles en esta categoria. Completa la migración de la base de datos para ver productos."}
              </p>
              <Link
                href="/"
                className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-full hover:bg-black/90 transition-colors font-medium text-sm sm:text-base"
              >
                Volver al inicio
              </Link>
            </div>
          )}
        </div>
      </div>
      <WhatsAppButton />
      <Footer />
    </main>
  )
}
