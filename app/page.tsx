import type { Metadata } from "next"
import Header from "@/components/header"
import Banner from "@/components/banner"
import WholesaleBanner from "@/components/wholesale-banner"
import WhatsAppButton from "@/components/whatsapp-button"
import FeaturedProducts from "@/components/featured-products"
import NewArrivalsSection from "@/components/new-arrivals-section"
import AllProductsSection from "@/components/all-products-section"
import FeaturedCategories from "@/components/featured-categories"
import PromoBanner from "@/components/promo-banner"
import BrandsSection from "@/components/brands-section"
import Footer from "@/components/footer"

// ISR - Cache homepage for 3 hours to reduce Vercel function invocations
// Vercel will serve cached version to all users, revalidate only every 10800 seconds
export const revalidate = 10800

export const metadata: Metadata = {
  title: "USA Import - Importador Directo de Productos Americanos | Tucumán",
  description:
    "USA Import es tu importador directo de productos americanos en Tucumán, Argentina. Tecnología, belleza, accesorios, vapers y más. Envíos a toda la región.",
  openGraph: {
    title: "USA Import - Importador Directo de Productos Americanos | Tucumán",
    description:
      "Desde el mundo para vos. Importador directo de productos americanos de primera calidad en Tucumán, Argentina.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "USA Import - Desde el mundo para vos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "USA Import - Importador Directo | Tucumán",
    description: "Desde el mundo para vos. Productos americanos de calidad premium.",
    images: ["/og-image.jpg"],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Banner />
      <WholesaleBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <NewArrivalsSection />
      <AllProductsSection />
      <PromoBanner />
      <BrandsSection />
      <WhatsAppButton />
      <Footer />
    </main>
  )
}
