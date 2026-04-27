'use client'

import React, { useState, useEffect } from 'react'
import { getOrderDetail, updateOrderStatus, updateOrderPaymentStatus, getCompanyConfig } from '@/app/actions/orders'
import { OrderDetail, OrderStatus, CompanyConfig, PaymentStatus } from '@/types/order'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface OrderDetailPanelProps {
  orderId: number
}

export default function OrderDetailPanel({ orderId }: OrderDetailPanelProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [company, setCompany] = useState<CompanyConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [orderRes, companyRes] = await Promise.all([
        getOrderDetail(orderId),
        getCompanyConfig(),
      ])

      if (orderRes.error) {
        setError(orderRes.error)
        return
      }

      if (orderRes.data) {
        setOrder(orderRes.data)
      }

      if (companyRes.data) {
        setCompany(companyRes.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading order')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return

    setUpdating(true)
    try {
      const { error } = await updateOrderStatus(orderId, newStatus)
      if (error) {
        setError(error)
        return
      }
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating status')
    } finally {
      setUpdating(false)
    }
  }

  const handlePaymentStatusChange = async (newPaymentStatus: PaymentStatus) => {
    if (!order) return

    setUpdating(true)
    try {
      const { error } = await updateOrderPaymentStatus(orderId, newPaymentStatus)
      if (error) {
        setError(error)
        return
      }
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating payment status')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Genera PDF de la orden
   */
  const generatePDF = () => {
    if (!order || !company) {
      alert('Error: No hay datos para generar PDF')
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // ====== ENCABEZADO CON LOGO Y DATOS EMPRESA ======
    // Logo (si existe)
    if (company.company_logo_url) {
      doc.addImage(company.company_logo_url, 'PNG', 15, yPosition, 30, 30)
    }

    // Datos empresa (lado derecho)
    doc.setFontSize(14)
    doc.setFont('bold')
    doc.text(company.company_name, pageWidth - 15, yPosition, { align: 'right' })

    doc.setFontSize(10)
    doc.setFont('normal')
    yPosition += 8
    doc.text(company.company_legal_name || '', pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 5
    doc.text(company.company_email, pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 5
    if (company.company_phone) {
      doc.text(company.company_phone, pageWidth - 15, yPosition, { align: 'right' })
      yPosition += 5
    }

    if (company.address_street) {
      const address = [
        company.address_street,
        company.address_city,
        company.address_state,
        company.address_postal_code,
      ]
        .filter(Boolean)
        .join(', ')
      doc.text(address, pageWidth - 15, yPosition, { align: 'right' })
    }

    yPosition += 15

    // ====== NÚMERO Y ESTADO DE ORDEN ======
    doc.setFontSize(16)
    doc.setFont('bold')
    doc.text(`ORDEN #${order.order_number}`, 15, yPosition)

    yPosition += 10
    doc.setFontSize(11)
    doc.setFont('normal')

    const statusLabels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'PENDIENTE',
      [OrderStatus.CONFIRMED]: 'CONFIRMADA',
      [OrderStatus.SHIPPED]: 'ENVIADA',
      [OrderStatus.DELIVERED]: 'ENTREGADA',
      [OrderStatus.CANCELLED]: 'CANCELADA',
    }

    doc.text(`Estado: ${statusLabels[order.order_status]}`, 15, yPosition)
    yPosition += 5
    doc.text(`Fecha: ${new Date(order.created_at).toLocaleDateString('es-AR')}`, 15, yPosition)

    yPosition += 12

    // ====== DATOS DEL CLIENTE ======
    doc.setFont('bold')
    doc.text('DATOS DEL CLIENTE', 15, yPosition)

    yPosition += 7
    doc.setFont('normal')
    doc.text(`Nombre: ${order.customer_name}`, 15, yPosition)
    yPosition += 5
    doc.text(`Email: ${order.customer_email}`, 15, yPosition)
    yPosition += 5
    doc.text(`Teléfono: ${order.customer_phone}`, 15, yPosition)
    yPosition += 5
    if (order.customer_document_id) {
      doc.text(`Documento: ${order.customer_document_id}`, 15, yPosition)
      yPosition += 5
    }

    yPosition += 7

    // ====== DIRECCIÓN DE ENVÍO ======
    doc.setFont('bold')
    doc.text('DIRECCIÓN DE ENVÍO', 15, yPosition)

    yPosition += 7
    doc.setFont('normal')
    const shippingAddress = [
      order.shipping_address.street,
      order.shipping_address.city,
      order.shipping_address.state,
      order.shipping_address.postal_code,
      order.shipping_address.country,
    ]
      .filter(Boolean)
      .join(', ')

    doc.text(shippingAddress, 15, yPosition, { maxWidth: pageWidth - 30 })

    yPosition = Math.min(yPosition + 15, pageHeight - 120)

    // ====== TABLA DE PRODUCTOS ======
    const tableData = order.items.map((item) => [
      item.product_name,
      item.variant_name || '-',
      item.quantity.toString(),
      `$${(item.unit_price / 100).toFixed(2)}`,
      item.discount_percentage ? `-${item.discount_percentage}%` : '-',
      `$${(item.line_subtotal / 100).toFixed(2)}`,
    ])

    ;(doc as any).autoTable({
      startY: yPosition,
      head: [['Producto', 'Variante', 'Cantidad', 'Precio Unit.', 'Descuento', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        font: 'bold',
      },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 10

    // ====== RESUMEN FINANCIERO ======
    const summaryX = pageWidth - 80
    doc.setFont('normal')
    doc.setFontSize(10)

    doc.text('Subtotal:', summaryX, yPosition)
    doc.text(`$${(order.subtotal / 100).toFixed(2)}`, pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 5
    doc.text('Descuentos:', summaryX, yPosition)
    doc.text(`-$${(order.discount / 100).toFixed(2)}`, pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 5
    doc.text('Envío:', summaryX, yPosition)
    doc.text(`$${(order.shipping_cost / 100).toFixed(2)}`, pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 5
    doc.text('Impuestos:', summaryX, yPosition)
    doc.text(`$${(order.tax / 100).toFixed(2)}`, pageWidth - 15, yPosition, { align: 'right' })

    yPosition += 7
    doc.setFont('bold')
    doc.setFontSize(12)
    doc.text('TOTAL:', summaryX, yPosition)
    doc.text(`$${(order.total / 100).toFixed(2)}`, pageWidth - 15, yPosition, { align: 'right' })

    // ====== INFORMACIÓN ADICIONAL ======
    yPosition += 12
    doc.setFontSize(10)
    doc.setFont('normal')

    if (order.payment_method) {
      doc.text(`Método de Pago: ${order.payment_method}`, 15, yPosition)
      yPosition += 5
    }

    if (order.shipping_method) {
      doc.text(`Método de Envío: ${order.shipping_method}`, 15, yPosition)
      yPosition += 5
    }

    if (order.tracking_number) {
      doc.text(`Número de Seguimiento: ${order.tracking_number}`, 15, yPosition)
      yPosition += 5
    }

    if (order.customer_notes) {
      doc.text('Notas del Cliente:', 15, yPosition)
      yPosition += 3
      doc.text(order.customer_notes, 15, yPosition, { maxWidth: pageWidth - 30 })
    }

    // ====== TÉRMINOS Y POLÍTICAS ======
    if (company.return_policy || company.terms_conditions) {
      yPosition = pageHeight - 30
      doc.setFontSize(8)
      doc.setFont('normal')
      doc.text(
        'Para consultas, contáctanos en ' + company.company_email,
        15,
        yPosition,
        { maxWidth: pageWidth - 30 }
      )
    }

    // Guardar PDF
    doc.save(`ORDEN-${order.order_number}.pdf`)
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">Cargando detalles de la orden...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600 font-semibold">Error: {error || 'Order not found'}</p>
      </div>
    )
  }

  const statusLabels: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'Pendiente',
    [OrderStatus.CONFIRMED]: 'Confirmada',
    [OrderStatus.SHIPPED]: 'Enviada',
    [OrderStatus.DELIVERED]: 'Entregada',
    [OrderStatus.CANCELLED]: 'Cancelada',
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orden #{order.order_number}</h1>
            <p className="text-gray-600 mt-1">
              {new Date(order.created_at).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Botón de PDF */}
          <button
            onClick={generatePDF}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2"
          >
            📄 Descargar PDF
          </button>
        </div>

        {/* Estados */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Estado de la Orden</p>
            <p className="text-lg font-bold text-blue-600">{statusLabels[order.order_status]}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Estado de Pago</p>
            <p className="text-lg font-bold text-green-600">
              {order.payment_status === 'pending' ? 'Pendiente' : 'Pagado'}
            </p>
          </div>
        </div>
      </div>

      {/* Cambiar Estado */}
      {order.order_status !== OrderStatus.CANCELLED && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Cambiar Estado</h2>
          <div className="flex gap-2 flex-wrap">
            {[
              OrderStatus.PENDING,
              OrderStatus.CONFIRMED,
              OrderStatus.SHIPPED,
              OrderStatus.DELIVERED,
              OrderStatus.CANCELLED,
            ].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updating || status === order.order_status}
                className={`px-4 py-2 rounded font-semibold transition ${
                  status === order.order_status
                    ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {statusLabels[status]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cambiar Estado de Pago */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Cambiar Estado de Pago</h2>
        <div className="flex gap-2 flex-wrap">
          {(['pending', 'paid'] as PaymentStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handlePaymentStatusChange(status)}
              disabled={updating || status === order.payment_status}
              className={`px-4 py-2 rounded font-semibold transition ${
                status === order.payment_status
                  ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {status === 'pending' ? 'Pendiente' : 'Pagado'}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Nombre</p>
            <p className="text-lg font-semibold text-gray-900">{order.customer_name}</p>

            <p className="text-sm text-gray-600 mb-1 mt-4">Email</p>
            <p className="text-lg font-semibold text-gray-900">{order.customer_email}</p>

            <p className="text-sm text-gray-600 mb-1 mt-4">Teléfono</p>
            <p className="text-lg font-semibold text-gray-900">{order.customer_phone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Dirección de Envío</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-900 font-semibold">{order.shipping_address.street}</p>
              <p className="text-gray-700">
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
              <p className="text-gray-700">
                {order.shipping_address.postal_code} - {order.shipping_address.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Productos</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{item.product_name}</p>
                {item.variant_name && (
                  <p className="text-sm text-gray-600">Variante: {item.variant_name}</p>
                )}
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${(item.line_subtotal / 100).toFixed(2)}</p>
                {item.discount_percentage && (
                  <p className="text-sm text-red-600">Desc: -{item.discount_percentage}%</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen Financiero</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Subtotal:</p>
            <p className="font-semibold text-gray-900">${(order.subtotal / 100).toFixed(2)}</p>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Descuentos:</p>
              <p className="font-semibold text-red-600">-${(order.discount / 100).toFixed(2)}</p>
            </div>
          )}
          {order.shipping_cost > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Envío:</p>
              <p className="font-semibold text-gray-900">${(order.shipping_cost / 100).toFixed(2)}</p>
            </div>
          )}
          {order.tax > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Impuestos:</p>
              <p className="font-semibold text-gray-900">${(order.tax / 100).toFixed(2)}</p>
            </div>
          )}
          <div className="pt-3 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-900">Total:</p>
              <p className="text-2xl font-bold text-blue-600">${(order.total / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Método de Pago y Envío */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detalles del Envío y Pago</h2>
        <div className="grid grid-cols-2 gap-6">
          {order.payment_method && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Método de Pago</p>
              <p className="text-lg font-semibold text-gray-900">{order.payment_method}</p>
            </div>
          )}
          {order.shipping_method && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Método de Envío</p>
              <p className="text-lg font-semibold text-gray-900">{order.shipping_method}</p>
            </div>
          )}
          {order.tracking_number && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Número de Seguimiento</p>
              <p className="text-lg font-semibold text-gray-900">{order.tracking_number}</p>
            </div>
          )}
        </div>
      </div>

      {/* Notas del Cliente */}
      {order.customer_notes && (
        <div className="bg-yellow-50 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Notas del Cliente</h2>
          <p className="text-gray-700">{order.customer_notes}</p>
        </div>
      )}
    </div>
  )
}
