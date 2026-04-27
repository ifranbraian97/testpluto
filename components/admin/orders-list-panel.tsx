'use client'

import React, { useState, useCallback } from 'react'
import { getAllOrders, updateOrderStatus } from '@/app/actions/orders'
import { OrderStatus, OrderSummary, OrdersPaginatedResponse } from '@/types/order'
import Link from 'next/link'

export default function OrdersListPanel() {
  // Estado de órdenes
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  // Cargar órdenes
  const loadOrders = useCallback(
    async (page: number = 1) => {
      setLoading(true)
      setError(null)

      try {
        const offset = (page - 1) * pageSize
        const result = await getAllOrders({
          limit: pageSize,
          offset,
          search: searchTerm || undefined,
          status: (statusFilter as OrderStatus) || undefined,
          dateFrom: dateFrom || undefined,
          dateTo: dateTo || undefined,
        })

        // Handle error
        if (result.error) {
          setError(result.error)
          setOrders([])
          setTotalCount(0)
          return
        }

        // Handle data
        if (result.data) {
          setOrders(result.data.data || [])
          setTotalCount(result.data.totalCount || 0)
          setCurrentPage(page)
        } else {
          setOrders([])
          setTotalCount(0)
        }
      } catch (err) {
        console.error('Error loading orders:', err)
        setError(err instanceof Error ? err.message : 'Error loading orders')
        setOrders([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    },
    [pageSize, searchTerm, statusFilter, dateFrom, dateTo]
  )

  // Cargar al montar
  React.useEffect(() => {
    loadOrders(1)
  }, [loadOrders])

  // Cambiar estado de orden
  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const { error } = await updateOrderStatus(orderId, newStatus)
      if (error) {
        setError(error)
        return
      }
      // Recargar órdenes
      loadOrders(currentPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating order')
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Badge de estado
  const getStatusBadge = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    }

    const labels: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmada',
      [OrderStatus.SHIPPED]: 'Enviada',
      [OrderStatus.DELIVERED]: 'Entregada',
      [OrderStatus.CANCELLED]: 'Cancelada',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
        {labels[status]}
      </span>
    )
  }

  // Badge de pago
  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    }

    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      failed: 'Fallo',
      refunded: 'Reembolsado',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[status] || colors.pending}`}>
        {labels[status] || status}
      </span>
    )
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Órdenes de Compra</h1>
        <p className="text-gray-600">
          Total: <span className="font-bold text-blue-600">{totalCount}</span> órdenes
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda */}
        <input
          type="text"
          placeholder="Buscar por número, cliente, email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Estado */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as OrderStatus | '')
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value={OrderStatus.PENDING}>Pendiente</option>
          <option value={OrderStatus.CONFIRMED}>Confirmada</option>
          <option value={OrderStatus.SHIPPED}>Enviada</option>
          <option value={OrderStatus.DELIVERED}>Entregada</option>
          <option value={OrderStatus.CANCELLED}>Cancelada</option>
        </select>

        {/* Fecha desde */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            setDateFrom(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Fecha hasta */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            setDateTo(e.target.value)
            setCurrentPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Errores */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tabla de órdenes */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Cargando órdenes...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay órdenes para mostrar</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Número</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Teléfono</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Pago</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-bold text-blue-600 hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{order.customer_name}</td>
                    <td className="px-4 py-3 text-sm">{order.customer_email}</td>
                    <td className="px-4 py-3 text-sm">{order.customer_phone}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.order_status)}</td>
                    <td className="px-4 py-3">{getPaymentBadge(order.payment_status)}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      ${(order.total / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/orders/${order.id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm inline-block">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-gray-600">
              Mostrando {(currentPage - 1) * pageSize + 1} a{' '}
              {Math.min(currentPage * pageSize, totalCount)} de {totalCount} órdenes
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => loadOrders(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => loadOrders(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => loadOrders(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400"
              >
                Siguiente →
              </button>
            </div>

            {/* Selector de tamaño de página */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </>
      )}
    </div>
  )
}
