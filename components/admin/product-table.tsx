'use client'

import type React from 'react'
import { memo } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import type { AdminProductWithVariants } from '@/types/admin'

interface ProductTableProps {
  products: AdminProductWithVariants[]
  isLoading?: boolean
  onEdit: (product: AdminProductWithVariants) => void
  onDelete?: (productId: number) => void
}

/**
 * Tabla de productos presentacional
 * No contiene lógica de datos, solo renderiza lo que recibe
 */
const ProductTable = memo(function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 text-left text-sm font-semibold">Imagen</th>
            <th className="p-3 text-left text-sm font-semibold">ID</th>
            <th className="p-3 text-left text-sm font-semibold">Nombre</th>
            <th className="p-3 text-left text-sm font-semibold">Precio</th>
            <th className="p-3 text-left text-sm font-semibold">Oferta</th>
            <th className="p-3 text-left text-sm font-semibold">Variantes</th>
            <th className="p-3 text-left text-sm font-semibold">Stock</th>
            <th className="p-3 text-left text-sm font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="p-4 text-center text-muted-foreground">
                Cargando...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={8} className="p-4 text-center text-muted-foreground">
                No hay productos
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
})

interface ProductRowProps {
  product: AdminProductWithVariants
  onEdit: (product: AdminProductWithVariants) => void
  onDelete?: (productId: number) => void
}

/**
 * Fila de producto individual
 */
const ProductRow = memo(function ProductRow({
  product,
  onEdit,
  onDelete,
}: ProductRowProps) {
  const stockColor = {
    out: 'bg-red-100 text-red-800',
    low: 'bg-yellow-100 text-yellow-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-green-100 text-green-800',
  }[product.stock || 'high'] || 'bg-green-100 text-green-800'

  const stockLabel = {
    out: 'Sin Stock',
    low: 'Stock Bajo',
    medium: 'Stock Medio',
    high: 'En Stock',
  }[product.stock || 'high'] || 'En Stock'

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="48px"
              loading="lazy"
              quality={60}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Sin img
            </div>
          )}
        </div>
      </td>
      <td className="p-3 font-mono text-sm">{product.id}</td>
      <td className="p-3 max-w-[250px] truncate font-medium">{product.name}</td>
      <td className="p-3 font-mono">
        $
        {product.price.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </td>
      <td className="p-3 font-mono">
        {product.price_offer ? (
          <div className="flex flex-col">
            <span className="text-green-600 font-medium">
              $
              {product.price_offer.toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            {product.discount_percentage && (
              <span className="text-xs text-muted-foreground">
                -{product.discount_percentage}%
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-1">
          {product.has_quantity_variants && (
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              Cant
            </span>
          )}
          {product.has_flavor_variants && (
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-800">
              Sabor
            </span>
          )}
          {!product.has_quantity_variants && !product.has_flavor_variants && (
            <span className="text-muted-foreground text-xs">-</span>
          )}
        </div>
      </td>
      <td className="p-3">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${stockColor}`}>
          {stockLabel}
        </span>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(product)}
            className="gap-1"
          >
            <Edit className="h-3 w-3" />
            Editar
          </Button>
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
})

export { ProductTable, ProductRow }
