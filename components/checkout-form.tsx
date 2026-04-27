'use client'

import React, { useState, useCallback } from 'react'
import { createOrderFromCart } from '@/app/actions/orders'
import { CreateOrderFromCartInput, PaymentMethod } from '@/types/order'
import { useRouter } from 'next/navigation'

interface CheckoutFormProps {
  cartItems: any[]
  onSuccess?: (orderNumber: string) => void
}

export default function CheckoutForm({ cartItems, onSuccess }: CheckoutFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Datos del cliente
  const [customerData, setCustomerData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    document_id: '',
    address_street: '',
    address_number: '',
    address_city: '',
    address_state: '',
    address_postal_code: '',
    address_country: 'Argentina',
  })

  // Datos de la compra
  const [paymentMethod, setPaymentMethod] = useState<string>('Transferencia Bancaria')
  const [shippingMethod, setShippingMethod] = useState<string>('Standard')
  const [customerNotes, setCustomerNotes] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Validar formulario
  const validateForm = (): boolean => {
    if (
      !customerData.first_name ||
      !customerData.last_name ||
      !customerData.email ||
      !customerData.phone ||
      !customerData.address_street ||
      !customerData.address_city ||
      !customerData.address_postal_code
    ) {
      setError('Por favor completa todos los campos obligatorios')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerData.email)) {
      setError('Email inválido')
      return false
    }

    if (!agreedToTerms) {
      setError('Debes aceptar los términos y condiciones')
      return false
    }

    return true
  }

  // Enviar formulario
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validateForm()) return

      setLoading(true)
      setError(null)

      try {
        const orderInput: CreateOrderFromCartInput = {
          customer_data: customerData,
          cart_items: cartItems,
          payment_method: paymentMethod,
          shipping_method: shippingMethod,
          customer_notes: customerNotes || undefined,
        }

        const { data, error: orderError } = await createOrderFromCart(orderInput)

        if (orderError) {
          setError(orderError)
          return
        }

        if (data) {
          // Éxito
          if (onSuccess) {
            onSuccess(data.order_number)
          }

          // Redirigir a página de confirmación
          router.push(`/order-confirmation/${data.order_number}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error creating order')
      } finally {
        setLoading(false)
      }
    },
    [customerData, cartItems, paymentMethod, shippingMethod, customerNotes, agreedToTerms, router]
  )

  // Calcular totales
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.unit_price * item.quantity),
      0
    )
    const shippingCost = shippingMethod === 'Express' ? 10000 : 5000 // Ejemplo: $100 o $50
    return { subtotal, shippingCost, total: subtotal + shippingCost }
  }

  const { subtotal, shippingCost, total } = calculateTotals()

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">🛒 Finalizar Compra</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULARIO - Columna izquierda */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* ====== DATOS DEL CLIENTE ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">👤 Datos Personales</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre *"
                value={customerData.first_name}
                onChange={(e) =>
                  setCustomerData({ ...customerData, first_name: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Apellido *"
                value={customerData.last_name}
                onChange={(e) =>
                  setCustomerData({ ...customerData, last_name: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="email"
                placeholder="Email *"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="tel"
                placeholder="Teléfono *"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Documento (DNI, RUT, etc.)"
                value={customerData.document_id}
                onChange={(e) =>
                  setCustomerData({ ...customerData, document_id: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
              />
            </div>
          </div>

          {/* ====== DIRECCIÓN DE ENVÍO ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📍 Dirección de Envío</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Calle *"
                value={customerData.address_street}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_street: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Número"
                value={customerData.address_number}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_number: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Ciudad *"
                value={customerData.address_city}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_city: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="text"
                placeholder="Provincia/Estado"
                value={customerData.address_state}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_state: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Código Postal *"
                value={customerData.address_postal_code}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_postal_code: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              <select
                value={customerData.address_country}
                onChange={(e) =>
                  setCustomerData({ ...customerData, address_country: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Brasil">Brasil</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          {/* ====== MÉTODO DE ENVÍO ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚚 Método de Envío</h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="shipping"
                  value="Standard"
                  checked={shippingMethod === 'Standard'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Envío Estándar</p>
                  <p className="text-gray-600">5-7 días hábiles</p>
                </div>
                <p className="ml-auto font-bold text-gray-900">$500</p>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="shipping"
                  value="Express"
                  checked={shippingMethod === 'Express'}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Envío Express</p>
                  <p className="text-gray-600">2-3 días hábiles</p>
                </div>
                <p className="ml-auto font-bold text-gray-900">$1000</p>
              </label>
            </div>
          </div>

          {/* ====== MÉTODO DE PAGO ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💳 Método de Pago</h2>

            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="Transferencia Bancaria"
                  checked={paymentMethod === 'Transferencia Bancaria'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Transferencia Bancaria</p>
                  <p className="text-gray-600">Transfiere el dinero a nuestro banco</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="Mercado Pago"
                  checked={paymentMethod === 'Mercado Pago'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Tarjeta de Crédito/Débito</p>
                  <p className="text-gray-600">Via Mercado Pago</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="payment"
                  value="Contra Entrega"
                  checked={paymentMethod === 'Contra Entrega'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Contra Entrega</p>
                  <p className="text-gray-600">Paga cuando recibas tu compra</p>
                </div>
              </label>
            </div>
          </div>

          {/* ====== NOTAS ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📝 Notas Adicionales</h2>

            <textarea
              placeholder="Deja una nota opcional para nosotros... (ej: horario de entrega preferido, instrucciones)"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>

          {/* ====== TÉRMINOS Y CONDICIONES ====== */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 mt-1"
                required
              />
              <span className="text-gray-700">
                Acepto los <strong>términos y condiciones</strong> y la{' '}
                <strong>política de privacidad</strong>
              </span>
            </label>
          </div>

          {/* ====== BOTÓN ENVIAR ====== */}
          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${
              loading || cartItems.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? '⏳ Procesando...' : '✅ Completar Compra'}
          </button>
        </form>

        {/* RESUMEN - Columna derecha */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Resumen</h2>

            {/* Productos */}
            <div className="mb-6 pb-6 border-b-2 border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3">Productos ({cartItems.length})</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-900 font-semibold">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-gray-600 text-xs">{item.variant_name}</p>
                      )}
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <p>Subtotal:</p>
                <p className="font-semibold">${(subtotal / 100).toFixed(2)}</p>
              </div>

              <div className="flex justify-between text-gray-700">
                <p>Envío:</p>
                <p className="font-semibold">${(shippingCost / 100).toFixed(2)}</p>
              </div>

              <div className="pt-3 border-t-2 border-gray-200">
                <div className="flex justify-between">
                  <p className="text-lg font-bold text-gray-900">Total:</p>
                  <p className="text-2xl font-bold text-blue-600">${(total / 100).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Seguridad */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200 text-center text-sm text-gray-600">
              <p>🔒 Compra segura</p>
              <p>Tus datos están protegidos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
