import React from 'react'
import Link from 'next/link'
import OrderDetailPanel from '@/components/admin/order-detail-panel'
import { ArrowLeft } from 'lucide-react'

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const orderId = parseInt(id, 10)

  return (
    <>
      {/* Barra de navegación */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Órdenes
          </Link>
        </div>
      </div>

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <OrderDetailPanel orderId={orderId} />
      </div>
    </>
  )
}
