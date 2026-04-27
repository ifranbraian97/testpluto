"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { allProducts } from "@/data/all-products"
import { getCategorySlug } from "@/lib/utils/category-slug"

function getProductUrl(slug: string) {
  const product = allProducts.find(p => p.slug === slug)
  if (product) {
    return `/categoria/${getCategorySlug(product.category)}/${slug}`
  }
  return `/categoria/tecnologia/${slug}`
}

function CartContent() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const router = useRouter()
  const searchParams = useSearchParams()

  const fromUrl = searchParams.get("from") || "/"

  const handleGoBack = () => {
    router.back()
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-black/5 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-black/30" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">Tu carrito está vacío</h1>
          <p className="text-black/60 mb-8">Agrega productos para comenzar tu compra</p>
          <Link href="/">
            <Button className="bg-black hover:bg-black/90 text-white px-8 py-3 rounded-xl font-medium">
              Ver productos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-6 md:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <div>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-black/50 hover:text-black transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Seguir comprando</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-black">
              Carrito ({items.length} {items.length === 1 ? "producto" : "productos"})
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
              return (
                <div
                  key={itemKey}
                  className="group bg-black/[0.02] hover:bg-black/[0.04] rounded-2xl p-4 md:p-5 transition-all duration-200"
                >
                  <div className="flex gap-4 md:gap-5">
                    <Link href={getProductUrl(item.slug)} className="flex-shrink-0">
                      <div className="relative w-24 h-24 md:w-28 md:h-28 bg-white rounded-xl overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 96px, 112px"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <Link href={getProductUrl(item.slug)}>
                              <h3 className="font-semibold text-black hover:text-black/70 transition-colors line-clamp-2 text-sm md:text-base">
                                {item.name}
                              </h3>
                            </Link>
                            {item.variant && <p className="text-xs md:text-sm text-black/50 mt-1">{item.variant}</p>}
                          </div>
                          <button
                            onClick={() => removeItem(itemKey)}
                            className="text-black/30 hover:text-red-500 p-2 -mr-2 transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-black/5 rounded-full p-1">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-black transition-all"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center text-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white text-black transition-all"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-lg md:text-xl font-bold text-black">
                          ${(item.price * item.quantity).toLocaleString("es-AR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-black rounded-2xl p-6 lg:sticky lg:top-6">
              <h2 className="text-lg font-bold text-white mb-6">Resumen del pedido</h2>

              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
                {items.map((item) => {
                  const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                  return (
                    <div key={itemKey} className="flex justify-between items-center text-sm">
                      <span className="text-white/60 truncate pr-3 flex-1">
                        {item.name} <span className="text-white/40">x{item.quantity}</span>
                      </span>
                      <span className="text-white font-medium flex-shrink-0">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Total</span>
                  <span className="text-2xl font-bold text-white">${totalPrice.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <Button
                onClick={() => router.push("/checkout")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-base font-semibold rounded-xl transition-all"
              >
                Finalizar compra
              </Button>

              <Button
                onClick={() => router.back()}
                className="w-full bg-white hover:bg-white/90 text-black py-4 text-base font-semibold rounded-xl transition-all mt-3"
              >
                Seguir comprando
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>}>
      <CartContent />
    </Suspense>
  )
}

export default function CartPage() {
  return (
    <>
      <Header />
      <CartPageWrapper />
      <Footer />
      <WhatsAppButton />
    </>
  )
}
