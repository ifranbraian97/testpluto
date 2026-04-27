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
import { Loader2, X, Trash2, Save, Plus } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/product-crud'
import { getCategories } from '@/app/actions/categories'
import type { Category } from '@/app/actions/categories'

interface QuantityVariant {
  id?: number
  product_id?: number
  min_quantity: number
  max_quantity?: number
  price: number
}

interface FlavorVariant {
  id?: number
  product_id?: number
  name: string
  stock?: 'out' | 'low' | 'medium' | 'high'
}

interface Product {
  id: number
  name: string
  price: number
  description?: string
  full_description?: string
  category: string
  image?: string
  images?: string[]
  features?: string[]
  stock?: 'out' | 'low' | 'medium' | 'high'
  slug: string
  has_quantity_variants?: boolean
  has_flavor_variants?: boolean
  quantity_variants?: QuantityVariant[]
  flavor_variants?: FlavorVariant[]
}

interface ProductFormProps {
  product: Product
  isNew: boolean
  onClose: () => void
  onSave: (product: Product, isNew: boolean) => void
  onDelete: (productId: number) => void
}

function ProductFormComponent({ product, isNew, onClose, onSave, onDelete }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>(product)
  const [quantityVariants, setQuantityVariants] = useState<QuantityVariant[]>(
    product.quantity_variants || []
  )
  const [flavorVariants, setFlavorVariants] = useState<FlavorVariant[]>(
    product.flavor_variants || []
  )
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.images || [])

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      const response = await getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    }
    loadCategories()
  }, [])

  const handleInputChange = useCallback(
    (field: keyof Product, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      setError(null)
    },
    []
  )

  const handleAddQuantityVariant = useCallback(() => {
    setQuantityVariants((prev) => [
      ...prev,
      { min_quantity: 1, max_quantity: undefined, price: formData.price },
    ])
  }, [formData.price])

  const handleUpdateQuantityVariant = useCallback(
    (index: number, field: keyof QuantityVariant, value: unknown) => {
      setQuantityVariants((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: value }
        return updated
      })
    },
    []
  )

  const handleRemoveQuantityVariant = useCallback((index: number) => {
    setQuantityVariants((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleAddFlavorVariant = useCallback(() => {
    setFlavorVariants((prev) => [
      ...prev,
      { name: '', stock: 'medium' },
    ])
  }, [])

  const handleUpdateFlavorVariant = useCallback(
    (index: number, field: keyof FlavorVariant, value: unknown) => {
      setFlavorVariants((prev) => {
        const updated = [...prev]
        updated[index] = { ...updated[index], [field]: value }
        return updated
      })
    },
    []
  )

  const handleRemoveFlavorVariant = useCallback((index: number) => {
    setFlavorVariants((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newPreviews: string[] = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newPreviews.push(event.target.result as string)
          if (newPreviews.length === files.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 4))
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido')
      return false
    }
    if (!formData.slug.trim()) {
      setError('El slug es requerido')
      return false
    }
    if (formData.price <= 0) {
      setError('El precio debe ser mayor a 0')
      return false
    }
    if (!formData.category) {
      setError('La categoría es requerida')
      return false
    }
    return true
  }

  const handleSave = useCallback(async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const qvData = quantityVariants.map((qv) => ({
        product_id: formData.id,
        min_quantity: qv.min_quantity,
        max_quantity: qv.max_quantity,
        price: qv.price,
      }))

      const fvData = flavorVariants.map((fv) => ({
        product_id: formData.id,
        name: fv.name,
        stock: fv.stock || 'medium',
      }))

      const productData = {
        name: formData.name,
        description: formData.description,
        full_description: formData.full_description,
        price: formData.price,
        category: formData.category,
        slug: formData.slug,
        image: formData.image,
        images: imagePreviews,
        features: formData.features || [],
        stock: formData.stock || 'medium',
      }

      let result

      if (isNew) {
        result = await createProduct(productData, qvData, fvData)
      } else {
        result = await updateProduct(formData.id, productData, qvData, fvData)
      }

      if (result.error) {
        setError(result.error)
        return
      }

      onSave(result.data as Product, isNew)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [formData, quantityVariants, flavorVariants, imagePreviews, isNew, onSave])

  const handleDelete = useCallback(async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    setIsLoading(true)
    try {
      const result = await deleteProduct(formData.id)

      if (result.error) {
        setError(result.error)
        return
      }

      onDelete(formData.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [formData.id, onDelete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <div className="sticky top-0 flex items-center justify-between border-b bg-background p-6">
          <h2 className="text-xl font-bold">{isNew ? 'Nuevo Producto' : 'Editar Producto'}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {error && <div className="rounded-lg bg-red-100 p-4 text-red-800">{error}</div>}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>

            <div>
              <Label>Nombre *</Label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <Label>Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="producto-slug"
              />
            </div>

            <div>
              <Label>Descripción Corta</Label>
              <Input
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción breve"
              />
            </div>

            <div>
              <Label>Descripción Completa</Label>
              <Textarea
                value={formData.full_description || ''}
                onChange={(e) => handleInputChange('full_description', e.target.value)}
                placeholder="Descripción detallada"
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Stock</Label>
                <Select
                  value={formData.stock || 'medium'}
                  onValueChange={(value) => handleInputChange('stock', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="out">Sin Stock</SelectItem>
                    <SelectItem value="low">Stock Bajo</SelectItem>
                    <SelectItem value="medium">Stock Medio</SelectItem>
                    <SelectItem value="high">Stock Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio *</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label>Imagen Principal</Label>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="/images/product.webp"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Imágenes</h3>
            <div className="grid grid-cols-4 gap-4">
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-32 w-full bg-muted">
                  {preview ? (
                    <>
                      <Image
                        src={preview}
                        alt={`Preview ${idx}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute right-1 top-1 rounded bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex h-full cursor-pointer items-center justify-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Variantes por Cantidad</h3>
              <Button size="sm" onClick={handleAddQuantityVariant} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>

            {quantityVariants.map((variant, idx) => (
              <div key={idx} className="space-y-2 rounded border p-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Cantidad Mín.</Label>
                    <Input
                      type="number"
                      value={variant.min_quantity}
                      onChange={(e) =>
                        handleUpdateQuantityVariant(idx, 'min_quantity', parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Cantidad Máx.</Label>
                    <Input
                      type="number"
                      value={variant.max_quantity || ''}
                      onChange={(e) =>
                        handleUpdateQuantityVariant(idx, 'max_quantity', e.target.value ? parseInt(e.target.value) : null)
                      }
                      placeholder="Sin límite"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Precio</Label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleUpdateQuantityVariant(idx, 'price', parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveQuantityVariant(idx)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            ))}
          </div>

          {/* Flavor Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Variantes por Sabor/Color</h3>
              <Button size="sm" onClick={handleAddFlavorVariant} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>

            {flavorVariants.map((variant, idx) => (
              <div key={idx} className="space-y-2 rounded border p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Nombre</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) =>
                        handleUpdateFlavorVariant(idx, 'name', e.target.value)
                      }
                      placeholder="Ej: Rojo, Azul, Fresa"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Stock</Label>
                    <Select
                      value={variant.stock || 'medium'}
                      onValueChange={(value) =>
                        handleUpdateFlavorVariant(idx, 'stock', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="out">Sin Stock</SelectItem>
                        <SelectItem value="low">Stock Bajo</SelectItem>
                        <SelectItem value="medium">Stock Medio</SelectItem>
                        <SelectItem value="high">Stock Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemoveFlavorVariant(idx)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 border-t pt-6">
            {!isNew && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Eliminar
              </Button>
            )}
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex-1">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isNew ? 'Crear' : 'Guardar'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default memo(ProductFormComponent)
