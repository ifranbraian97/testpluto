import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import Image from "next/image"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Cómo Comprar - Guía de Compra Fácil y Segura",
  description:
    "Aprende cómo comprar en USA Import en 3 simples pasos. Proceso fácil, sencillo y práctico con coordinación personalizada por WhatsApp.",
}

export default function ComoComprarPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section className="px-4 md:px-8 py-12 md:py-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance">¿Cómo Comprar en USA Import?</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 text-pretty">Fácil, sencillo y práctico</p>
          <p className="text-lg text-blue-400 font-medium">Por eso muchos eligen USA IMPORT</p>
        </div>

        {/* Steps Section */}
        <div className="space-y-20">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold">
                1
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Seleccioná tus productos</h2>
            </div>
            <p className="text-center text-gray-300 mb-8 max-w-2xl">
              Explorá nuestro catálogo y elegí los productos que más te gusten. Podés navegar por categorías o buscar
              productos específicos.
            </p>

            {/* Desktop Image */}
            <div className="hidden md:block w-full max-w-5xl rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-desktop-1.webp"
                alt="Paso 1: Seleccionar productos - Vista Desktop"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full max-w-sm rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-mobile-1.webp"
                alt="Paso 1: Seleccionar productos - Vista Mobile"
                width={720}
                height={1560}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold">
                2
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Elegí continuar con la compra o seguir comprando
              </h2>
            </div>
            <p className="text-center text-gray-300 mb-8 max-w-2xl">
              Revisá tu carrito de compras. Podés continuar agregando más productos o proceder con tu pedido cuando
              estés listo.
            </p>

            {/* Desktop Image */}
            <div className="hidden md:block w-full max-w-5xl rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-desktop-2.webp"
                alt="Paso 2: Carrito de compras - Vista Desktop"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full max-w-sm rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-mobile-2.webp"
                alt="Paso 2: Carrito de compras - Vista Mobile"
                width={720}
                height={1560}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold">
                3
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Finalizá tu compra</h2>
            </div>
            <p className="text-center text-gray-300 mb-8 max-w-2xl">
              Completá tus datos personales, dirección de envío y seleccioná tu método de pago preferido. Toda tu orden
              se enviará directamente a nuestro WhatsApp para coordinar pagos y envíos de manera personalizada.
            </p>

            {/* Desktop Image */}
            <div className="hidden md:block w-full max-w-5xl rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-desktop-3.webp"
                alt="Paso 3: Finalizar compra - Vista Desktop"
                width={1920}
                height={1080}
                className="w-full h-auto"
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden w-full max-w-sm rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <Image
                src="/como-comprar-mobile-3.webp"
                alt="Paso 3: Finalizar compra - Vista Mobile"
                width={720}
                height={1560}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-xl p-12 border border-blue-700">
          <h3 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar?</h3>
          <p className="text-gray-300 mb-8 text-lg">
            Empezá a comprar ahora y disfrutá de la mejor experiencia de compra online
          </p>
          <a
            href="/categoria/celulares"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition text-lg"
          >
            Ver categorías
          </a>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  )
}
