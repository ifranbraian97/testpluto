import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/app/actions/product-crud"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import PaginatedProductGrid from "@/components/paginated-product-grid"
import { slugify } from "@/lib/utils/slugify"
import { createServerClient } from "@/lib/supabase/server"

// Search page needs dynamic content but can cache results for 1 minute
export const revalidate = 60

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const searchQuery = q?.toLowerCase() || ""

  // Get categories from database
  const categoriesResult = await getCategories()
  const dbCategories = categoriesResult.data || []

  // Search across ALL products from Supabase
  let searchResults: any[] = []

  if (searchQuery) {
    try {
      const supabase = await createServerClient()
      const { data, error } = await supabase
        .from('products')
        .select(
          'id, name, price, image, category, slug, stock'
        )
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) {
        console.error('[SEARCH] Error fetching products:', error)
      } else if (data) {
        console.log(`[SEARCH] Found ${data.length} results for "${searchQuery}"`)
        if (data.length > 0) {
          console.log('[SEARCH] Sample product:', { 
            id: data[0].id,
            name: data[0].name,
            slug: data[0].slug,
            category: data[0].category,
            image: data[0].image ? 'exists' : 'null'
          })
        }
        searchResults = data
      }
    } catch (err) {
      console.error('[SEARCH] Exception:', err)
    }
  }

  // Group results by category for filtering
  const categoriesWithResults = dbCategories.filter((cat) =>
    searchResults.some((product) => product.category.toLowerCase() === cat.name.toLowerCase()),
  )

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
              <span className="text-black/60 truncate">Búsqueda</span>
            </nav>
          </div>
        </div>

        {/* Search Results Header */}
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 md:py-10 lg:py-16">
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-14">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-black tracking-tight">
              {searchQuery ? `Resultados: "${q}"` : "Buscar productos"}
            </h1>
            <p className="text-black/50 text-sm sm:text-base md:text-lg">
              {searchQuery
                ? `${searchResults.length} ${searchResults.length === 1 ? "producto encontrado" : "productos encontrados"}`
                : "Ingresa un término de búsqueda"}
            </p>

            {/* Category filters */}
            {searchQuery && categoriesWithResults.length > 0 && (
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/buscar?q=${encodeURIComponent(q || "")}`}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 bg-black text-white"
                >
                  Todos ({searchResults.length})
                </Link>
                {categoriesWithResults.map((cat) => {
                  const catSlug = slugify(cat.name)
                  const countInCategory = searchResults.filter(
                    (p) => p.category.toLowerCase() === cat.name.toLowerCase(),
                  ).length
                  return (
                    <Link
                      key={catSlug}
                      href={`/categoria/${catSlug}?buscar=${encodeURIComponent(q || "")}`}
                      className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 bg-gray-100 text-black/70 hover:bg-gray-200"
                    >
                      {cat.name} ({countInCategory})
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <PaginatedProductGrid 
              products={searchResults} 
              productsPerPage={12} 
              showCategory={true}
            />
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <p className="text-black/50 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                {searchQuery
                  ? `No encontramos productos para "${q}".`
                  : "Ingresa un término en el buscador para encontrar productos."}
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
