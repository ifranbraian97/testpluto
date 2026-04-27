"use client"

import type React from "react"
import { useState, useEffect, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { contactConfig } from "@/lib/contact-config"
import { ArrowLeft, User, MapPin, CreditCard, MessageSquare, ShoppingBag, Lock, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { createOrderFromCart, getCompanyConfig } from "@/app/actions/orders"
import { CompanyConfig, PaymentMethodConfig } from "@/types/order"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>([
    { name: "Transferencia Bancaria", description: "" },
    { name: "Efectivo", description: "" }
  ])
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    metodoPago: "Transferencia Bancaria",
    notas: "",
  })

  useEffect(() => {
    loadCompanyConfig()
  }, [])

  const loadCompanyConfig = async () => {
    try {
      const { data, error } = await getCompanyConfig()
      if (data) {
        setCompanyConfig(data)
        // Cargar métodos de pago desde config
        if (data.payment_methods && Array.isArray(data.payment_methods)) {
          setPaymentMethods(data.payment_methods)
          setFormData(prev => ({
            ...prev,
            metodoPago: data.payment_methods[0]?.name || "Transferencia Bancaria"
          }))
        }
      }
    } catch (err) {
      console.error('Error loading company config:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoading && items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-black/5 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-black/30" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-black mb-3">Tu carrito está vacío</h1>
            <p className="text-black/60 mb-8">Por favor, agrega productos antes de continuar</p>
            <Button
              onClick={() => router.push("/carrito")}
              className="bg-black hover:bg-black/90 text-white px-8 py-3 rounded-xl font-medium"
            >
              Volver al carrito
            </Button>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </>
    )
  }

  const validateOnlyLetters = (value: string) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)
  }

  const validateOnlyNumbers = (value: string) => {
    return /^[0-9]*$/.test(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (
      (name === "nombre" || name === "apellido" || name === "ciudad" || name === "provincia") &&
      !validateOnlyLetters(value)
    ) {
      return
    }

    if ((name === "telefono" || name === "codigoPostal" || name === "dni") && !validateOnlyNumbers(value)) {
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Convertir items del carrito al formato de la orden
      const cartItems = items.map((item: any) => {
        // El product_id puede venir como "3" o "3-ll" (product_id-variant)
        let productId = item.id
        let variantId = null
        
        if (typeof item.id === 'string' && item.id.includes('-')) {
          const parts = item.id.split('-')
          productId = parseInt(parts[0], 10)
          variantId = parts[1] ? (parts.slice(1).join('-')) : null
        } else if (typeof item.id === 'string') {
          productId = parseInt(item.id, 10)
        }
        
        // Validar precios
        const basePrice = item.price && item.price > 0 ? item.price : 0
        const offerPrice = item.price_offer && item.price_offer > 0 ? item.price_offer : null
        
        // El unit_price debe ser el precio que se cobra (puede ser la oferta si es válida)
        // Si no hay oferta válida o la oferta es mayor que el precio base, usar el precio base
        const unitPrice = (offerPrice && offerPrice < basePrice) ? offerPrice : basePrice
        
        return {
          product_id: productId,
          product_variant_id: variantId || item.variant_id || null,
          name: item.name,
          sku: item.sku || null,
          variant_name: item.variant || null,
          unit_price: unitPrice,
          unit_price_offer: null,
          discount_percentage: null,
          quantity: item.quantity,
        }
      })

      // Preparar datos del cliente
      const customerData = {
        first_name: formData.nombre,
        last_name: formData.apellido,
        email: formData.email,
        phone: formData.telefono,
        document_id: formData.dni,
        address_street: formData.direccion,
        address_number: "",
        address_city: formData.ciudad,
        address_state: formData.provincia,
        address_postal_code: formData.codigoPostal,
        address_country: "Argentina",
      }

      // Llamar a la acción del servidor
      const result = await createOrderFromCart({
        customer_data: customerData,
        cart_items: cartItems,
        payment_method: formData.metodoPago,
        customer_notes: formData.notas || undefined,
      })

      if (result.error) {
        setError(result.error)
        console.error("Error creando orden:", result.error)
        return
      }

      if (result.data) {
        // Éxito - limpiar carrito y redirigir
        clearCart()
        router.push(`/checkout/confirmation/${result.data.order_number}`)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMsg)
      console.error("Error en handleSubmit:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white py-6 md:py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <Link
              href="/carrito"
              className="inline-flex items-center gap-2 text-black/50 hover:text-black transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Volver al carrito</span>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-black">Finalizar compra</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-black/[0.02] rounded-2xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-black">Información personal</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre" className="text-black/70 text-sm font-medium">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        minLength={2}
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido" className="text-black/70 text-sm font-medium">
                        Apellido
                      </Label>
                      <Input
                        id="apellido"
                        name="apellido"
                        type="text"
                        required
                        minLength={2}
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                        placeholder="Tu apellido"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dni" className="text-black/70 text-sm font-medium">
                        DNI
                      </Label>
                      <Input
                        id="dni"
                        name="dni"
                        type="text"
                        required
                        minLength={7}
                        maxLength={8}
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono" className="text-black/70 text-sm font-medium">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        minLength={8}
                        maxLength={15}
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email" className="text-black/70 text-sm font-medium">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-black/[0.02] rounded-2xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-black">Dirección de envío</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="direccion" className="text-black/70 text-sm font-medium">
                        Dirección
                      </Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        type="text"
                        required
                        minLength={5}
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                        placeholder="Calle y número"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="ciudad" className="text-black/70 text-sm font-medium">
                          Ciudad
                        </Label>
                        <Input
                          id="ciudad"
                          name="ciudad"
                          type="text"
                          required
                          minLength={2}
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                          placeholder="Ciudad"
                        />
                      </div>
                      <div>
                        <Label htmlFor="provincia" className="text-black/70 text-sm font-medium">
                          Provincia
                        </Label>
                        <Input
                          id="provincia"
                          name="provincia"
                          type="text"
                          required
                          minLength={2}
                          value={formData.provincia}
                          onChange={handleInputChange}
                          className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                          placeholder="Provincia"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoPostal" className="text-black/70 text-sm font-medium">
                          Código Postal
                        </Label>
                        <Input
                          id="codigoPostal"
                          name="codigoPostal"
                          type="text"
                          required
                          minLength={4}
                          maxLength={8}
                          value={formData.codigoPostal}
                          onChange={handleInputChange}
                          className="mt-1.5 text-black bg-white border-black/10 focus:border-black/30 rounded-xl h-11"
                          placeholder="4000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-black/[0.02] rounded-2xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-black">Método de pago</h2>
                  </div>

                  <div>
                    <Label htmlFor="metodoPago" className="text-black/70 text-sm font-medium">
                      Selecciona tu método de pago
                    </Label>
                    <select
                      id="metodoPago"
                      name="metodoPago"
                      required
                      value={formData.metodoPago}
                      onChange={handleInputChange}
                      className="mt-1.5 w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-black bg-white h-11 text-sm"
                    >
                      <option value="">Seleccionar...</option>
                      {paymentMethods.map((method) => (
                        <option key={method.name} value={method.name}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-black/[0.02] rounded-2xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-black/60" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-black">Notas adicionales</h2>
                      <p className="text-xs text-black/50">Opcional</p>
                    </div>
                  </div>

                  <textarea
                    id="notas"
                    name="notas"
                    rows={3}
                    value={formData.notas}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-black bg-white text-sm resize-none"
                    placeholder="Información adicional sobre tu pedido..."
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="lg:hidden">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-semibold rounded-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                        Creando orden...
                      </>
                    ) : (
                      'Finalizar compra'
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-2 mt-3 text-black/40 text-xs">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Compra segura</span>
                  </div>
                </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-black rounded-2xl p-6 lg:sticky lg:top-6">
                <h2 className="text-lg font-bold text-white mb-6">Resumen del pedido</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id
                    return (
                      <div key={itemKey} className="flex gap-3">
                        <div className="relative w-14 h-14 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{item.name}</p>
                          {item.variant && <p className="text-xs text-white/50 truncate">{item.variant}</p>}
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-white/50">x{item.quantity}</p>
                            <p className="text-sm font-semibold text-white">
                              ${(item.price * item.quantity).toLocaleString("es-AR")}
                            </p>
                          </div>
                        </div>
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

                {error && (
                  <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-xl mb-4">
                    <p className="font-semibold">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="hidden lg:block">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-semibold rounded-xl disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2 inline" />
                        Creando orden...
                      </>
                    ) : (
                      'Finalizar compra'
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-4 mt-4 text-white/40 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Compra segura</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Datos protegidos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
