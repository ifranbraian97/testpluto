'use client'

import type React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Trash2, Save, AlertCircle, TrendingDown } from 'lucide-react'
import type {
  AdminProductWithVariants,
  AdminProductVariantWithAttributes,
  VariantType,
  VariantValue,
} from '@/types/admin'
import { ADMIN_STOCK_OPTIONS } from '@/types/admin'
import { useCategories } from '@/hooks/use-categories'

interface ProductFormAdvancedProps {
  product: AdminProductWithVariants
  variantTypes?: VariantType[]
  isNew: boolean
  isLoading?: boolean
  error?: string | null
  onClose: () => void
  onSave: (product: AdminProductWithVariants, variants?: AdminProductVariantWithAttributes[]) => Promise<void>
  onDelete?: (productId: number) => Promise<void>
}

export function ProductFormAdvanced({
  product,
  variantTypes = [],
  isNew,
  isLoading,
  error,
  onClose,
  onSave,
  onDelete,
}: ProductFormAdvancedProps) {
  const { categories: dbCategories } = useCategories();
  const [formData, setFormData] = useState<AdminProductWithVariants>(product)
  const [variants, setVariants] = useState<AdminProductVariantWithAttributes[]>(
    product.variants || []
  )
  const [activeTab, setActiveTab] = useState('general')
  const [localError, setLocalError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calcular descuento automático
  const calculateDiscount = useCallback((price: number, priceOffer?: number): number => {
    if (!priceOffer || priceOffer <= 0 || priceOffer >= price) return 0
    return Math.round(((price - priceOffer) / price) * 100)
  }, [])

  const validateForm = useCallback(() => {
    if (!formData.name?.trim()) {
      setLocalError('El nombre es requerido')
      return false
    }
    if (!formData.slug?.trim()) {
      setLocalError('El slug es requerido')
      return false
    }
    if (!formData.price || formData.price <= 0) {
      setLocalError('El precio debe ser mayor a 0')
      return false
    }
    if (!formData.category) {
      setLocalError('Debe seleccionar una categoría')
      return false
    }
    setLocalError(null)
    return true
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSave(formData, variants)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddVariant = () => {
    const newVariant: AdminProductVariantWithAttributes = {
      id: Date.now(),
      product_id: formData.id,
      name: '',
      price: formData.price,
      stock_quantity: 0,
      stock_status: 'medium',
      is_active: true,
      attributes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setVariants([...variants, newVariant])
  }

  const handleUpdateVariant = (variantId: number | string, updates: Partial<AdminProductVariantWithAttributes>) => {
    setVariants(
      variants.map(v => (v.id === variantId ? { ...v, ...updates } : v))
    )
  }

  const handleDeleteVariant = (variantId: number | string) => {
    setVariants(variants.filter(v => v.id !== variantId))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isNew ? 'Nuevo Producto' : 'Editar Producto'}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Errores */}
          {(localError || error) && (
            <div className="flex gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>{localError || error}</div>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="pricing">Precios</TabsTrigger>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
            </TabsList>

            {/* TAB: General */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre del producto"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="slug-del-producto"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Select
                    value={formData.stock || 'medium'}
                    onValueChange={value =>
                      setFormData({
                        ...formData,
                        stock: value as 'out' | 'low' | 'medium' | 'high',
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMIN_STOCK_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción corta"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="fullDescription">Descripción completa</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.full_description || ''}
                  onChange={e =>
                    setFormData({ ...formData, full_description: e.target.value })
                  }
                  placeholder="Descripción detallada"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* TAB: Pricing */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio Regular</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={e =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) })
                    }
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="priceOffer">Precio en Oferta (opcional)</Label>
                  <Input
                    id="priceOffer"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price_offer || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        price_offer: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Mostrar descuento automático */}
              {formData.price_offer && formData.price_offer > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-900">Descuento automático</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {calculateDiscount(formData.price, formData.price_offer)}%
                  </div>
                  <div className="text-sm text-green-700 mt-2">
                    <div>Precio regular: ${formData.price.toLocaleString('es-AR')}</div>
                    <div>Precio en oferta: ${formData.price_offer.toLocaleString('es-AR')}</div>
                    <div className="font-semibold mt-2">
                      Ahorras: ${(formData.price - formData.price_offer).toLocaleString('es-AR')}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB: Variants */}
            <TabsContent value="variants" className="space-y-4">
              <div className="space-y-4">
                {variants.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
                    No hay variantes. Agrega una para comenzar.
                  </div>
                ) : (
                  variants.map((variant, idx) => (
                    <Card key={variant.id} className="p-4 bg-gray-50">
                      <div className="space-y-3">
                        {/* Nombre y acciones */}
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <Label className="text-xs">Nombre de variante</Label>
                            <Input
                              value={variant.name}
                              onChange={e =>
                                handleUpdateVariant(variant.id, { name: e.target.value })
                              }
                              placeholder="Ej: Rojo - M"
                              className="mt-1 text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteVariant(variant.id)}
                            className="h-9"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Precios de variante */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Precio</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={e =>
                                handleUpdateVariant(variant.id, {
                                  price: parseFloat(e.target.value),
                                })
                              }
                              placeholder="0.00"
                              className="mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Precio Oferta (opcional)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price_offer || ''}
                              onChange={e =>
                                handleUpdateVariant(variant.id, {
                                  price_offer: e.target.value ? parseFloat(e.target.value) : undefined,
                                })
                              }
                              placeholder="0.00"
                              className="mt-1 text-sm"
                            />
                          </div>
                        </div>

                        {/* Descuento automático */}
                        {variant.price_offer && variant.price_offer > 0 && (
                          <div className="flex items-center gap-2 p-2 bg-green-100 rounded text-sm">
                            <TrendingDown className="h-3 w-3 text-green-600" />
                            <span className="font-semibold text-green-700">
                              {calculateDiscount(variant.price, variant.price_offer)}% descuento
                            </span>
                          </div>
                        )}

                        {/* Stock */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">Cantidad Stock</Label>
                            <Input
                              type="number"
                              min="0"
                              value={variant.stock_quantity || 0}
                              onChange={e =>
                                handleUpdateVariant(variant.id, {
                                  stock_quantity: parseInt(e.target.value) || 0,
                                })
                              }
                              placeholder="0"
                              className="mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Estado Stock</Label>
                            <Select
                              value={variant.stock_status}
                              onValueChange={value =>
                                handleUpdateVariant(variant.id, {
                                  stock_status: value as 'out' | 'low' | 'medium' | 'high',
                                })
                              }
                            >
                              <SelectTrigger className="mt-1 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ADMIN_STOCK_OPTIONS.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddVariant}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Variante
              </Button>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            {!isNew && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (window.confirm('¿Eliminar este producto?')) {
                    onDelete(formData.id)
                    onClose()
                  }
                }}
              >
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting || isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
