import { notFound } from "next/navigation"
import { getProductBySlug, getProductsByCategory, getCategories } from "@/app/actions/product-crud"
import { slugify } from "@/lib/utils/slugify"
import ProductDetail from "@/components/product-detail"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Dynamic route - fetch fresh data each time
export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{
    categoria: string
    producto: string
  }>
}

export default async function ProductPage({ params }: CategoryPageProps) {
  const { categoria, producto } = await params
  
  console.log("[DETAIL] ProductPage - categoria:", categoria, "producto:", producto)
  
  // Get categories from database
  const categoriesResult = await getCategories()
  const dbCategories = categoriesResult.data || []
  
  // Verify category exists - match by slug
  const category = dbCategories.find((cat) => slugify(cat.name) === categoria)
  console.log("[DETAIL] Found category:", category?.name || "NOT FOUND")
  console.log("[DETAIL] Available categories:", dbCategories.map(c => ({ id: c.id, name: c.name })))
  
  if (!category) {
    console.log("[DETAIL] Category not found, returning 404")
    notFound()
  }
  
  // Get product from database by slug
  const productResult = await getProductBySlug(producto)
  console.log("[DETAIL] Product query result status:", productResult.status)
  
  if (productResult.status === 404 || !productResult.data) {
    console.log("[DETAIL] Product not found in database, returning 404. Error:", productResult.error)
    notFound()
  }
  
  const product = productResult.data.product || productResult.data
  const variants = productResult.data.variants || []
  
  console.log("[DETAIL] Found product from DB:", {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    variants: variants.length,
    expectedCategory: category.name,
    match: product.category.toLowerCase().trim() === category.name.toLowerCase().trim()
  })
  
  // Verify product belongs to the requested category (case-insensitive)
  const productCategoryNormalized = product.category.toLowerCase().trim()
  const categoryNameNormalized = category.name.toLowerCase().trim()
  
  if (productCategoryNormalized !== categoryNameNormalized) {
    console.log("[DETAIL] Product category mismatch. Expected:", categoryNameNormalized, "Got:", productCategoryNormalized)
    notFound()
  }

  // Get related products from the same category
  const { data: categoryProducts } = await getProductsByCategory(category.name)
  const relatedProducts = categoryProducts
    ?.filter((p: any) => p.id !== product.id)
    .slice(0, 4) || []

  // Combinar producto con sus variantes
  const productWithVariants = {
    ...product,
    variants,
  }

  return (
    <>
      <Header />
      <ProductDetail product={productWithVariants} relatedProducts={relatedProducts} />
      <Footer />
    </>
  )
}

// No pre-generation - all pages generated on-demand from database
export async function generateStaticParams() {
  return []
}
