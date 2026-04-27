"use client"

import type React from "react"
import { useState, useCallback, memo } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Trash2, Save, Plus } from "lucide-react"

type Product = {
  id: number
  name: string
  price: number
  description: string
  category: string
  image: string
  images: string[]
  rating: number
  inStock: boolean
  stock?: string | number
  isFeatured?: boolean
  isNew?: boolean
  quantityVariants?: QuantityVariant[]
  flavorVariants?: FlavorVariant[]
  hasQuantityVariants?: boolean
  hasFlavorVariants?: boolean
  slug?: string
}

type QuantityVariant = {
  id: string
  quantity: string
  price: number
}

type FlavorVariant = {
  id: string
  name: string
  stock: string
}

type Category = {
  name: string
  slug: string
}

type ProductFormProps = {
  product: Product
  isNew: boolean
  categories: Category[]
  onClose: () => void
  onSave: (product: Product, isNew: boolean) => void
  onDelete: (productId: number) => void
}

function ProductForm({ product, isNew, categories, onClose, onSave, onDelete }: ProductFormProps) {
  const [editingProduct, setEditingProduct] = useState<Product>(product)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageError, setImageError] = useState("")
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    [...(product.images || []), null, null, null, null].slice(0, 4)
  )
  const [formData, setFormData] = useState({
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description || "",
    category: product.category || "accesorios-celular",
    image: product.image || "",
    images: product.images || [],
    rating: product.rating || 5,
    inStock: product.stock !== "out" && product.stock !== 0,
  })

  const addQuantityVariant = useCallback(() => {
    const newVariant: QuantityVariant = {
      id: `qty-${Date.now()}`,
      quantity: "",
      price: 0,
    }
    setEditingProduct((prev) => ({
      ...prev,
      quantityVariants: [...(prev.quantityVariants || []), newVariant],
    }))
  }, [])

  const updateQuantityVariant = useCallback(
    (index: number, field: keyof QuantityVariant, value: string | number) => {
      setEditingProduct((prev) => {
        const updatedVariants = [...(prev.quantityVariants || [])]
        updatedVariants[index] = { ...updatedVariants[index], [field]: value }
        return { ...prev, quantityVariants: updatedVariants }
      })
    },
    []
  )

  const removeQuantityVariant = useCallback((index: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      quantityVariants: (prev.quantityVariants || []).filter((_, i) => i !== index),
    }))
  }, [])

  const addFlavorVariant = useCallback(() => {
    const newVariant: FlavorVariant = {
      id: `flavor-${Date.now()}`,
      name: "",
      stock: "high",
    }
    setEditingProduct((prev) => ({
      ...prev,
      flavorVariants: [...(prev.flavorVariants || []), newVariant],
    }))
  }, [])

  const updateFlavorVariant = useCallback((index: number, field: keyof FlavorVariant, value: string) => {
    setEditingProduct((prev) => {
      const updatedVariants = [...(prev.flavorVariants || [])]
      updatedVariants[index] = { ...updatedVariants[index], [field]: value }
      return { ...prev, flavorVariants: updatedVariants }
    })
  }, [])

  const removeFlavorVariant = useCallback((index: number) => {
    setEditingProduct((prev) => ({
      ...prev,
      flavorVariants: (prev.flavorVariants || []).filter((_, i) => i !== index),
    }))
  }, [])

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      const newFiles = files.filter((file) => file.type.startsWith("image/"))
      if (newFiles.length === 0) {
        setImageError("Por favor selecciona solo archivos de imagen validos")
        return
      }

      const currentImageCount = imagePreviews.filter(Boolean).length
      const availableSlots = 4 - currentImageCount

      if (newFiles.length > availableSlots && index === undefined) {
        setImageError(`Solo puedes agregar ${availableSlots} imagen(es) mas. Maximo 4 imagenes.`)
        return
      }

      for (const file of newFiles) {
        if (file.size > 2 * 1024 * 1024) {
          setImageError(`La imagen ${file.name} debe ser menor a 2MB.`)
          return
        }
      }

      setImageError("")

      const updatedPreviews = [...imagePreviews]
      const updatedImageFiles = [...imageFiles]

      if (index !== undefined) {
        updatedPreviews[index] = URL.createObjectURL(newFiles[0])
        updatedImageFiles[index] = newFiles[0]
      } else {
        let currentSlot = editingProduct.images?.length || 0
        for (const file of newFiles) {
          if (currentSlot >= 4) break
          updatedPreviews[currentSlot] = URL.createObjectURL(file)
          updatedImageFiles[currentSlot] = file
          currentSlot++
        }
      }

      setImagePreviews(updatedPreviews)
      setImageFiles(updatedImageFiles)
      setEditingProduct((prev) => ({
        ...prev,
        images: updatedPreviews.filter(Boolean) as string[],
        image: prev.image || updatedPreviews[0] || "",
      }))
    },
    [imagePreviews, imageFiles, editingProduct.images]
  )

  const handleRemoveImage = useCallback((index: number) => {
    setImagePreviews((prev) => {
      const updated = [...prev]
      updated[index] = null
      return updated
    })
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setEditingProduct((prev) => {
      const updatedImages = (prev.images || []).filter((_, i) => i !== index)
      return {
        ...prev,
        images: updatedImages,
        image: index === 0 && updatedImages.length > 0 ? updatedImages[0] : prev.image,
      }
    })
  }, [])

  const handleSaveProduct = async () => {
    setIsLoading(true)

    const finalProductData = { ...editingProduct, ...formData }

    if (imageFiles.length > 0) {
      try {
        const uploadPromises = imageFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result as string)
              reader.onerror = () => reject(new Error(`Error al leer ${file.name}`))
              reader.readAsDataURL(file)
            })
        )

        const uploadedImageUrls = await Promise.all(uploadPromises)
        finalProductData.images = uploadedImageUrls.slice(0, 4)
        if (uploadedImageUrls.length > 0 && !finalProductData.image) {
          finalProductData.image = uploadedImageUrls[0]
        }
      } catch (error) {
        setImageError("Error al procesar imagenes")
        setIsLoading(false)
        return
      }
    }

    if (formData.inStock && (finalProductData.stock === "out" || finalProductData.stock === 0)) {
      finalProductData.stock = "high"
    } else if (!formData.inStock) {
      finalProductData.stock = "out"
    }

    // Prepare data for Supabase
    const supabaseData = {
      name: finalProductData.name,
      price: finalProductData.price,
      description: finalProductData.description,
      category: finalProductData.category,
      image: finalProductData.image || finalProductData.images?.[0] || "",
      images: finalProductData.images || [],
      rating: finalProductData.rating || 5,
      in_stock: formData.inStock,
      stock: finalProductData.stock,
      is_featured: finalProductData.isFeatured || false,
      is_new: finalProductData.isNew || false,
      quantity_variants: finalProductData.quantityVariants || [],
      flavor_variants: finalProductData.flavorVariants || [],
      has_quantity_variants: finalProductData.hasQuantityVariants || false,
      has_flavor_variants: finalProductData.hasFlavorVariants || false,
      slug: finalProductData.slug || finalProductData.name.toLowerCase().replace(/\s+/g, "-"),
    }

    try {
      const url = isNew ? "/api/products" : `/api/products/${finalProductData.id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supabaseData),
      })

      if (response.ok) {
        const savedProduct = await response.json()
        // Map back to frontend format
        const mappedProduct: Product = {
          id: savedProduct.id,
          name: savedProduct.name,
          price: savedProduct.price,
          description: savedProduct.description,
          category: savedProduct.category,
          image: savedProduct.image,
          images: savedProduct.images || [],
          rating: savedProduct.rating,
          inStock: savedProduct.in_stock,
          stock: savedProduct.stock,
          isFeatured: savedProduct.is_featured,
          isNew: savedProduct.is_new,
          quantityVariants: savedProduct.quantity_variants || [],
          flavorVariants: savedProduct.flavor_variants || [],
          hasQuantityVariants: savedProduct.has_quantity_variants,
          hasFlavorVariants: savedProduct.has_flavor_variants,
          slug: savedProduct.slug,
        }
        onSave(mappedProduct, isNew)
      } else {
        setImageError("Error al guardar cambios")
      }
    } catch {
      setImageError("Error al guardar cambios")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    const confirmDelete = window.confirm(
      `¿Estas seguro de que deseas eliminar "${editingProduct.name}"?`
    )
    if (!confirmDelete) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onDelete(editingProduct.id)
      } else {
        setImageError("Error al eliminar producto")
      }
    } catch {
      setImageError("Error al eliminar producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <Card className="my-8 w-full max-w-4xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">
            {isNew ? "Agregar Producto" : `Editar: ${editingProduct.name}`}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label>Nombre del Producto</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </div>

              <div>
                <Label>Precio (ARS)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                  }
                  placeholder="Precio"
                />
              </div>

              <div>
                <Label>Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoria" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-[100] max-h-60">
                    {categories.map((cat) => (
                      <SelectItem key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Descripcion</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Descripcion del producto"
                  rows={4}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, inStock: e.target.checked }))
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="inStock">En Stock</Label>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <Label>Imagenes (max 4)</Label>
              <div className="grid grid-cols-2 gap-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50"
                  >
                    {imagePreviews[index] ? (
                      <>
                        <Image
                          src={imagePreviews[index]! || "/placeholder.svg"}
                          alt={`Imagen ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <label className="flex h-full cursor-pointer flex-col items-center justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="h-6 w-6" />
                        <span className="text-xs">Agregar</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, index)}
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
              {imageError && <p className="text-sm text-red-500">{imageError}</p>}
            </div>
          </div>

          {/* Quantity Variants */}
          <div className="mt-6 border-t pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasQuantityVariants"
                  checked={editingProduct.hasQuantityVariants}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      hasQuantityVariants: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="hasQuantityVariants">Variantes de Cantidad</Label>
              </div>
              {editingProduct.hasQuantityVariants && (
                <Button variant="outline" size="sm" onClick={addQuantityVariant}>
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar
                </Button>
              )}
            </div>
            {editingProduct.hasQuantityVariants && (
              <div className="space-y-2">
                {editingProduct.quantityVariants?.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Cantidad (ej: 50ml)"
                      value={variant.quantity}
                      onChange={(e) => updateQuantityVariant(index, "quantity", e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Precio"
                      value={variant.price}
                      onChange={(e) =>
                        updateQuantityVariant(index, "price", Number(e.target.value))
                      }
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuantityVariant(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Flavor Variants */}
          <div className="mt-6 border-t pt-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasFlavorVariants"
                  checked={editingProduct.hasFlavorVariants}
                  onChange={(e) =>
                    setEditingProduct((prev) => ({
                      ...prev,
                      hasFlavorVariants: e.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="hasFlavorVariants">Variantes de Sabor</Label>
              </div>
              {editingProduct.hasFlavorVariants && (
                <Button variant="outline" size="sm" onClick={addFlavorVariant}>
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar
                </Button>
              )}
            </div>
            {editingProduct.hasFlavorVariants && (
              <div className="space-y-2">
                {editingProduct.flavorVariants?.map((variant, index) => (
                  <div key={variant.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Nombre del sabor"
                      value={variant.name}
                      onChange={(e) => updateFlavorVariant(index, "name", e.target.value)}
                      className="flex-1"
                    />
                    <Select
                      value={variant.stock}
                      onValueChange={(value) => updateFlavorVariant(index, "stock", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" className="z-[100]">
                        <SelectItem value="high">Alto</SelectItem>
                        <SelectItem value="medium">Medio</SelectItem>
                        <SelectItem value="low">Bajo</SelectItem>
                        <SelectItem value="out">Sin Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFlavorVariant(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t p-4">
          <div>
            {!isNew && (
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleSaveProduct} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default memo(ProductForm)
