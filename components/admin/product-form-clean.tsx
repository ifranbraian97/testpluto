'use client'

import type React from 'react'
import { useState, useCallback, memo, useEffect } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, X, Trash2, Save, Plus, Upload, Image as ImageIcon, ChevronDown, ChevronRight } from 'lucide-react'
import type { AdminProductWithVariants, AdminProductVariant, VariantType, VariantValue } from '@/types/admin'
import { ADMIN_STOCK_OPTIONS } from '@/types/admin'
import { useCategories } from '@/hooks/use-categories'
import { getVariantTypes, getVariantValues, getProductVariants, createProductVariant, updateProductVariant, deleteProductVariant } from '@/app/actions/admin-products'

interface ProductFormProps {
  product: AdminProductWithVariants
  isNew: boolean
  isLoading?: boolean
  error?: string | null
  onClose: () => void
  onSave: (product: AdminProductWithVariants) => Promise<void> | void
  onDelete?: (productId: number) => Promise<void> | void
}

/**
 * Formulario de producto con sistema de variantes personalizado
 */
const ProductForm = memo(function ProductForm({
  product,
  isNew,
  isLoading,
  error,
  onClose,
  onSave,
  onDelete,
}: ProductFormProps) {
  const { categories: dbCategories } = useCategories();
  const [formData, setFormData] = useState<AdminProductWithVariants>(product)
  const [images, setImages] = useState<string[]>(product.images || [])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  
  // Nuevos estados para variantes personalizadas
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [productVariants, setProductVariants] = useState<AdminProductVariant[]>([])
  const [selectedVariantType, setSelectedVariantType] = useState<number | null>(null)
  const [variantValues, setVariantValues] = useState<VariantValue[]>([])
  const [isLoadingVariants, setIsLoadingVariants] = useState(false)
  const [variantsExpanded, setVariantsExpanded] = useState(true)
  
  // Formulario para nueva variante
  const [newVariantName, setNewVariantName] = useState('')
  const [newVariantPrice, setNewVariantPrice] = useState(0)
  const [newVariantPriceOffer, setNewVariantPriceOffer] = useState<number | undefined>()
  const [newVariantStock, setNewVariantStock] = useState<'out' | 'low' | 'medium' | 'high'>('high')
  const [newVariantStockQty, setNewVariantStockQty] = useState(0)
  const [selectedAttributes, setSelectedAttributes] = useState<{variant_type_id: number, variant_value_id: number}[]>([])

  // Cargar tipos de variantes y variantes del producto
  useEffect(() => {
    loadVariantTypes()
    if (!isNew && product.id) {
      loadProductVariants(product.id)
    }
  }, [product.id, isNew])

  const loadVariantTypes = useCallback(async () => {
    try {
      const data = await getVariantTypes()
      setVariantTypes(data)
    } catch (err) {
      console.error('Error loading variant types:', err)
    }
  }, [])

  const loadProductVariants = useCallback(async (productId: number) => {
    setIsLoadingVariants(true)
    try {
      const data = await getProductVariants(productId)
      setProductVariants(data)
    } catch (err) {
      console.error('Error loading product variants:', err)
    } finally {
      setIsLoadingVariants(false)
    }
  }, [])

  const loadVariantValues = useCallback(async (typeId: number) => {
    try {
      const data = await getVariantValues(typeId)
      setVariantValues(data)
    } catch (err) {
      console.error('Error loading variant values:', err)
    }
  }, [])

  // Cuando se selecciona un tipo de variante, cargar sus valores
  useEffect(() => {
    if (selectedVariantType) {
      loadVariantValues(selectedVariantType)
    }
  }, [selectedVariantType, loadVariantValues])

  // Toggle attribute selection
  const toggleAttribute = (typeId: number, valueId: number) => {
    setSelectedAttributes(prev => {
      const exists = prev.find(a => a.variant_type_id === typeId && a.variant_value_id === valueId)
      if (exists) {
        return prev.filter(a => a !== exists)
      }
      return [...prev, { variant_type_id: typeId, variant_value_id: valueId }]
    })
  }

  // Agregar nueva variante
  const handleAddVariant = async () => {
    if (!product.id || !newVariantName.trim() || selectedAttributes.length === 0) {
      setLocalError('Debe completar todos los campos y seleccionar al menos una opción')
      return
    }

    setIsLoadingVariants(true)
    try {
      await createProductVariant({
        product_id: product.id,
        name: newVariantName,
        price: newVariantPrice,
        price_offer: newVariantPriceOffer,
        stock_quantity: newVariantStockQty,
        stock_status: newVariantStock,
        attributes: selectedAttributes,
      })
      
      // Limpiar formulario
      setNewVariantName('')
      setNewVariantPrice(formData.price || 0)
      setNewVariantPriceOffer(undefined)
      setNewVariantStock('high')
      setNewVariantStockQty(0)
      setSelectedAttributes([])
      
      // Recargar variantes
      await loadProductVariants(product.id)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error creando variante')
    } finally {
      setIsLoadingVariants(false)
    }
  }

  // Eliminar variante
  const handleDeleteVariant = async (variantId: number) => {
    if (!confirm('¿Eliminar esta variante?')) return
    
    setIsLoadingVariants(true)
    try {
      await deleteProductVariant(variantId)
      await loadProductVariants(product.id)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error eliminando variante')
    } finally {
      setIsLoadingVariants(false)
    }
  }

  // Validación básica del formulario
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

    try {
      const dataToSave = {
        ...formData,
        images,
        image: formData.image || images[0] || null,
      }

      console.log('[FORM] Guardando producto:', dataToSave)

      await onSave(dataToSave)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al guardar')
    }
  }

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files.length) return

    setIsUploadingImages(true)
    setUploadError(null)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response from server')
        }

        if (data.error) {
          throw new Error(data.error)
        }

        if (!data.url) {
          throw new Error('No URL returned from server')
        }

        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev: string[]) => [...prev, ...uploadedUrls])

      e.target.value = ''
    } catch (err) {
      console.error('Upload error:', err)
      setUploadError(err instanceof Error ? err.message : 'Error subiendo imágenes')
    } finally {
      setIsUploadingImages(false)
    }
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
      <div className="mx-auto max-w-4xl py-8">
        <Card className="relative">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute right-4 top-4 rounded-md p-1 hover:bg-muted disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Title */}
            <div>
              <h2 className="text-xl font-bold">
                {isNew ? 'Nuevo Producto' : `Editar: ${product.name}`}
              </h2>
            </div>

            {/* Error Message */}
            {(error || localError) && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                {error || localError}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Información Básica</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, slug: e.target.value }))
                    }
                    disabled={isLoading}
                    placeholder="producto-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        price: parseFloat(e.target.value) || 0,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_offer">Precio Oferta</Label>
                  <Input
                    id="price_offer"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_offer || ''}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        price_offer: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                    disabled={isLoading}
                    placeholder="Precio con descuento"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((p) => ({ ...p, category: value }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dbCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Select
                    value={formData.stock || 'high'}
                    onValueChange={(value) =>
                      setFormData((p) => ({
                        ...p,
                        stock: value as any,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="stock">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADMIN_STOCK_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">Descripción Completa</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description || ''}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      full_description: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="space-y-2">
                  <Label>Imagen Principal</Label>
                  <div className="relative h-40 w-40 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={formData.image}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData((p) => ({ ...p, image: null }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Quitar imagen principal
                  </Button>
                </div>
              )}

              {/* Multiple Images Upload */}
              <div className="space-y-2 border-t pt-4">
                <Label>Imágenes del Producto</Label>
                <p className="text-sm text-muted-foreground">
                  Sube múltiples imágenes para mostrar diferentes vistas del producto
                </p>

                {/* Upload Error */}
                {uploadError && (
                  <div className="rounded-md bg-red-50 p-2 text-sm text-red-800">
                    {uploadError}
                  </div>
                )}

                {/* File Input */}
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoading || isUploadingImages}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading || isUploadingImages}
                      className="w-full cursor-pointer gap-2"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {isUploadingImages ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Seleccionar Imágenes
                        </>
                      )}
                    </Button>
                  </label>
                </div>

                {!formData.id && (
                  <p className="text-xs text-amber-600">
                    💡 Primero debes crear o cargar un producto para subir imágenes
                  </p>
                )}

                {/* Images Grid */}
                {images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Imágenes subidas</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {images.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square overflow-hidden rounded-lg border border-muted bg-muted"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Imagen ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                            {formData.image !== imageUrl && (
                              <button
                                type="button"
                                onClick={() => setFormData((p) => ({ ...p, image: imageUrl }))}
                                title="Establecer como imagen principal"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                              >
                                Principal
                              </button>
                            )}
                            {formData.image === imageUrl && (
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                                ✓ Principal
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              disabled={isLoading || isUploadingImages}
                              title="Eliminar imagen"
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Variants - Nuevo Sistema */}
            <div className="space-y-4 border-t pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setVariantsExpanded(!variantsExpanded)}
              >
                <div className="flex items-center gap-2">
                  {variantsExpanded ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                  <div>
                    <h3 className="font-semibold">Variantes Personalizadas</h3>
                    <p className="text-sm text-muted-foreground">
                      Gestiona variantes con atributos personalizados (tamaño, color, etc.)
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {productVariants.length} variante(s)
                </span>
              </div>

              {variantsExpanded && (
                <div className="space-y-4">
                  {/* Lista de variantes existentes */}
                  {productVariants.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Variantes existentes</h4>
                      {productVariants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{variant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${variant.price.toLocaleString('es-AR')}
                              {variant.price_offer && (
                                <span className="ml-2 text-green-600">
                                  → ${variant.price_offer.toLocaleString('es-AR')}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              variant.stock_status === 'out' ? 'bg-red-100 text-red-800' :
                              variant.stock_status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                              variant.stock_status === 'medium' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {variant.stock_status === 'out' ? 'Sin Stock' :
                               variant.stock_status === 'low' ? 'Stock Bajo' :
                               variant.stock_status === 'medium' ? 'Stock Medio' : 'En Stock'}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVariant(variant.id)}
                              disabled={isLoadingVariants}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para nueva variante - solo si el producto ya existe */}
                  {!isNew && product.id && (
                    <div className="rounded-lg border p-4 space-y-4">
                      <h4 className="text-sm font-medium">Agregar nueva variante</h4>
                      
                      {/* Seleccionar tipo de variante */}
                      <div className="space-y-2">
                        <Label>Tipo de Variante</Label>
                        <Select
                          value={selectedVariantType?.toString() || ''}
                          onValueChange={(value) => setSelectedVariantType(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo..." />
                          </SelectTrigger>
                          <SelectContent>
                            {variantTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id.toString()}>
                                {type.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Seleccionar valores del tipo seleccionado */}
                      {selectedVariantType && variantValues.length > 0 && (
                        <div className="space-y-2">
                          <Label>Opciones disponibles</Label>
                          <div className="flex flex-wrap gap-2">
                            {variantValues.map((value) => {
                              const isSelected = selectedAttributes.some(
                                a => a.variant_type_id === selectedVariantType && a.variant_value_id === value.id
                              )
                              return (
                                <button
                                  key={value.id}
                                  type="button"
                                  onClick={() => toggleAttribute(selectedVariantType, value.id)}
                                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                    isSelected
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                                  }`}
                                  style={value.color_hex ? { backgroundColor: isSelected ? value.color_hex : undefined } : undefined}
                                >
                                  {value.color_hex && (
                                    <span 
                                      className="inline-block w-3 h-3 rounded-full mr-1 border"
                                      style={{ backgroundColor: value.color_hex }}
                                    />
                                  )}
                                  {value.value}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Nombre y precio de la variante */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Nombre de la variante</Label>
                          <Input
                            value={newVariantName}
                            onChange={(e) => setNewVariantName(e.target.value)}
                            placeholder="Ej: Rojo - M, 500ml, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Precio</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newVariantPrice}
                            onChange={(e) => setNewVariantPrice(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Precio Oferta (opcional)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newVariantPriceOffer || ''}
                            onChange={(e) => setNewVariantPriceOffer(e.target.value ? parseFloat(e.target.value) : undefined)}
                            placeholder="Precio con descuento"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stock</Label>
                          <Select
                            value={newVariantStock}
                            onValueChange={(value) => setNewVariantStock(value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ADMIN_STOCK_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Cantidad en Stock</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newVariantStockQty}
                            onChange={(e) => setNewVariantStockQty(parseInt(e.target.value) || 0)}
                            placeholder="Cantidad disponible"
                          />
                          <p className="text-xs text-gray-500">
                            Cantidad mayor a 20 = high, 11-20 = medium, 6-10 = low, 0-5 = out
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddVariant}
                        disabled={isLoadingVariants || !newVariantName.trim() || selectedAttributes.length === 0}
                        className="w-full gap-2"
                      >
                        {isLoadingVariants && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Plus className="h-4 w-4" />
                        Agregar Variante
                      </Button>
                    </div>
                  )}

                  {isNew && (
                    <p className="text-sm text-amber-600">
                      💡 Crea primero el producto para poder agregar variantes personalizadas
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                {!isNew && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('¿Está seguro que desea eliminar este producto?')) {
                        onDelete(product.id)
                      }
                    }}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isNew ? 'Crear' : 'Guardar'}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
})

export { ProductForm }
