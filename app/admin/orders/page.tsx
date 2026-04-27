import React from 'react'
import OrdersListPanel from '@/components/admin/orders-list-panel'

export default function OrdersPage() {
  return (
    <>
      {/* Encabezado de página */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground">📦 Gestión de Órdenes</h1>
          <p className="text-muted-foreground mt-2">Visualiza y administra todas las órdenes de clientes</p>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <OrdersListPanel />
      </div>
    </>
  )
}
