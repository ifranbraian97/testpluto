import React from 'react'
import { getOrderDetailByNumber } from '@/app/actions/orders'
import { OrderDetail } from '@/types/order'
import Link from 'next/link'
import SimpleHeader from '@/components/simple-header'
import Footer from '@/components/footer'
import { CheckCircle2, Package, MapPin, DollarSign, Calendar, CreditCard, Download } from 'lucide-react'

interface OrderConfirmationPageProps {
  params: Promise<{
    orderNumber: string
  }>
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params
  
  const { data: order, error } = await getOrderDetailByNumber(orderNumber)

  if (error || !order) {
    return (
      <>
        <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Error</h1>
            <p className="text-gray-600 mb-8">{error || 'No se encontró la orden'}</p>
            <Link href="/">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Volver al Inicio
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SimpleHeader title="Confirmación de Orden" showShoppingBag={true} />
      <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Encabezado de éxito */}
        <div className="bg-white rounded-lg shadow-2xl p-8 text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Compra Completada!</h1>
          <p className="text-xl text-gray-600">
            Gracias por tu compra. Hemos recibido tu orden exitosamente.
          </p>
        </div>

        {/* Número de orden */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm uppercase tracking-wider mb-2">
              Número de Orden
            </p>
            <p className="text-4xl font-bold text-blue-600">{order.order_number}</p>
            <p className="text-gray-600 mt-2">
              Guardamos esta información en tu email:{' '}
              <span className="font-semibold">{order.customer_email}</span>
            </p>
          </div>

          {/* Datos principales */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b-2 border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cliente</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Teléfono</p>
              <p className="text-lg font-semibold text-gray-900">{order.customer_phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha del Pedido</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Monto Total</p>
              <p className="text-2xl font-bold text-green-600">
                ${(order.total / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Pasos siguientes */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Próximos Pasos</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Confirmación Enviada</p>
                  <p className="text-gray-600">
                    Recibirás un email con los detalles de tu compra
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Procesamiento del Pago</p>
                  <p className="text-gray-600">
                    {order.payment_method === 'Contra Entrega'
                      ? 'Pagarás al recibir tu compra'
                      : 'Completarás el pago según el método seleccionado'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Preparación y Envío</p>
                  <p className="text-gray-600">
                    Prepararemos tu pedido y lo enviaremos en breve
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Entrega</p>
                  <p className="text-gray-600">
                    Recibirás tu compra en la dirección indicada. Podrás seguir tu pedido
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de compra */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Productos</h2>

          <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{item.product_name}</p>
                  {item.variant_name && (
                    <p className="text-sm text-gray-600">{item.variant_name}</p>
                  )}
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">${(item.line_subtotal / 100).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <p>Subtotal:</p>
              <p>${(order.subtotal / 100).toFixed(2)}</p>
            </div>

            {/* El envío se cobra aparte, no se muestra en el total */}

            <div className="pt-2 border-t-2 border-gray-200">
              <div className="flex justify-between">
                <p className="font-bold text-gray-900">Total:</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(order.total / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dirección de envío */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Dirección de Envío</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-900 font-semibold">{order.customer_name}</p>
            <p className="text-gray-700 mt-2">{order.shipping_address.street}</p>
            <p className="text-gray-700">
              {order.shipping_address.city}, {order.shipping_address.state}
            </p>
            <p className="text-gray-700">
              {order.shipping_address.postal_code} - {order.shipping_address.country}
            </p>
          </div>

          {/* Estado del envío */}
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="text-sm text-orange-700 font-semibold">🚚 Estado del Envío</p>
            <p className="text-orange-800 mt-2">
              <strong>Por coordinar</strong> - Nos contactaremos pronto via email o teléfono para coordinar los detalles del envío.
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex gap-4 justify-center flex-wrap">
            <a href={`/api/orders/${order.order_number}/pdf?print=1`} target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2">
                <Download className="w-5 h-5" />
                📄 Ver/Descargar PDF
              </button>
            </a>

            <Link href="/">
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                ← Volver al Inicio
              </button>
            </Link>
          </div>
        </div>

        {/* Información de soporte */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8 text-center border border-blue-200">
          <p className="text-gray-700 mb-2">¿Tienes preguntas?</p>
          <p className="text-gray-600">
            Contáctanos en{' '}
            <a href="mailto:contacto@mtienda.com" className="text-blue-600 font-semibold hover:underline">
              contacto@mtienda.com
            </a>{' '}
            o llamanos
          </p>
        </div>
      </div>
      </div>
      <Footer />
    </>
  )
}
