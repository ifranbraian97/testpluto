'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X, Plus, Edit2, Trash2, Save, Loader2, AlertCircle } from 'lucide-react'
import type { VariantType, VariantValue, CreateVariantTypeDTO, CreateVariantValueDTO } from '@/types/admin'
import {
  getVariantTypes,
  getVariantValues,
  createVariantType,
  updateVariantType,
  deleteVariantType,
  createVariantValue,
  updateVariantValue,
  deleteVariantValue,
} from '@/app/actions/variants'

export function VariantManagementPanel() {
  const [variantTypes, setVariantTypes] = useState<VariantType[]>([])
  const [variantValues, setVariantValues] = useState<VariantValue[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Formulario para nuevo tipo
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeDisplayName, setNewTypeDisplayName] = useState('')
  const [newTypeDescription, setNewTypeDescription] = useState('')
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null)

  // Formulario para nuevo valor
  const [newValueName, setNewValueName] = useState('')
  const [newValueColor, setNewValueColor] = useState('')
  const [editingValueId, setEditingValueId] = useState<number | null>(null)

  // Cargar tipos y valores
  useEffect(() => {
    loadVariantTypes()
  }, [])

  const loadVariantTypes = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getVariantTypes()
      if (result.error) {
        setError(result.error)
      } else {
        setVariantTypes(result.data || [])
        if (selectedTypeId === null && result.data?.length) {
          setSelectedTypeId(result.data[0].id)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [selectedTypeId])

  const loadVariantValues = useCallback(async (typeId: number) => {
    setIsLoading(true)
    try {
      const result = await getVariantValues(typeId)
      if (result.error) {
        setError(result.error)
      } else {
        setVariantValues(result.data || [])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Manejar selección de tipo
  const handleTypeSelect = (typeId: number) => {
    setSelectedTypeId(typeId)
    loadVariantValues(typeId)
  }

  // Crear nuevo tipo de variante
  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!newTypeName.trim() || !newTypeDisplayName.trim()) {
      setError('El nombre y nombre para mostrar son obligatorios')
      return
    }

    setIsLoading(true)
    try {
      const result = await createVariantType({
        name: newTypeName,
        display_name: newTypeDisplayName,
        description: newTypeDescription || undefined,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Tipo de variante creado exitosamente')
        setNewTypeName('')
        setNewTypeDisplayName('')
        setNewTypeDescription('')
        await loadVariantTypes()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar tipo
  const handleUpdateType = async (typeId: number) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const type = variantTypes.find(t => t.id === typeId)
      if (!type) return

      const result = await updateVariantType(typeId, {
        display_name: type.display_name,
        description: type.description,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Tipo actualizado exitosamente')
        setEditingTypeId(null)
        await loadVariantTypes()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Eliminar tipo
  const handleDeleteType = async (typeId: number) => {
    if (!window.confirm('¿Eliminar este tipo de variante? Se eliminarán todos sus valores.')) {
      return
    }

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const result = await deleteVariantType(typeId)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Tipo eliminado exitosamente')
        setEditingTypeId(null)
        await loadVariantTypes()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Crear nuevo valor de variante
  const handleCreateValue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedTypeId || !newValueName.trim()) {
      setError('Selecciona un tipo y proporciona un valor')
      return
    }

    setIsLoading(true)
    try {
      const result = await createVariantValue({
        variant_type_id: selectedTypeId,
        value: newValueName,
        color_hex: newValueColor || undefined,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Valor de variante creado exitosamente')
        setNewValueName('')
        setNewValueColor('')
        await loadVariantValues(selectedTypeId)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Eliminar valor
  const handleDeleteValue = async (valueId: number) => {
    if (!window.confirm('¿Eliminar este valor?')) {
      return
    }

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const result = await deleteVariantValue(valueId)

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Valor eliminado exitosamente')
        if (selectedTypeId) {
          await loadVariantValues(selectedTypeId)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="flex gap-2 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          <div>✓ {success}</div>
        </div>
      )}

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="types">Tipos de Variantes</TabsTrigger>
          <TabsTrigger value="values">Valores</TabsTrigger>
        </TabsList>

        {/* TAB: Tipos de Variantes */}
        <TabsContent value="types" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Crear nuevo tipo de variante</h3>
            <form onSubmit={handleCreateType} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typeName">Nombre (ID)</Label>
                  <Input
                    id="typeName"
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                    placeholder="Ej: color, tamaño, sabor"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Será convertido a minúsculas y sin espacios
                  </p>
                </div>

                <div>
                  <Label htmlFor="typeDisplayName">Nombre para mostrar</Label>
                  <Input
                    id="typeDisplayName"
                    value={newTypeDisplayName}
                    onChange={e => setNewTypeDisplayName(e.target.value)}
                    placeholder="Ej: Color, Tamaño, Sabor"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="typeDescription">Descripción (opcional)</Label>
                <Textarea
                  id="typeDescription"
                  value={newTypeDescription}
                  onChange={e => setNewTypeDescription(e.target.value)}
                  placeholder="Descripción del tipo de variante"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Tipo
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Lista de tipos */}
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold">Tipos existentes</h3>
            {isLoading && variantTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                Cargando...
              </div>
            ) : variantTypes.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                No hay tipos de variantes creados
              </div>
            ) : (
              variantTypes.map(type => (
                <Card
                  key={type.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedTypeId === type.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold">{type.display_name}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteType(type.id)
                        }}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* TAB: Valores */}
        <TabsContent value="values" className="space-y-4">
          {!selectedTypeId ? (
            <Card className="p-6 text-center text-gray-500">
              <p>Selecciona un tipo de variante para ver y editar sus valores</p>
            </Card>
          ) : (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Agregar valor a: {variantTypes.find(t => t.id === selectedTypeId)?.display_name}
                </h3>
                <form onSubmit={handleCreateValue} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valueName">Valor</Label>
                      <Input
                        id="valueName"
                        value={newValueName}
                        onChange={e => setNewValueName(e.target.value)}
                        placeholder="Ej: Rojo, Grande, Fresa"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="valueColor">Color (opcional, hex)</Label>
                      <div className="mt-1 flex gap-2">
                        <Input
                          id="valueColor"
                          value={newValueColor}
                          onChange={e => setNewValueColor(e.target.value)}
                          placeholder="#FF0000"
                          className="flex-1"
                          type="text"
                          pattern="^#[0-9A-F]{6}$"
                        />
                        {newValueColor && (
                          <div
                            className="w-10 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: newValueColor }}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Valor
                      </>
                    )}
                  </Button>
                </form>
              </Card>

              {/* Lista de valores */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Valores de {variantTypes.find(t => t.id === selectedTypeId)?.display_name}
                </h3>
                {isLoading && variantValues.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Cargando...
                  </div>
                ) : variantValues.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                    No hay valores para este tipo
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {variantValues.map(value => (
                      <Card key={value.id} className="p-4">
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {value.color_hex && (
                              <div
                                className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                                style={{ backgroundColor: value.color_hex }}
                              />
                            )}
                            <div>
                              <p className="font-medium">{value.value}</p>
                              {value.color_hex && (
                                <p className="text-xs text-gray-500">{value.color_hex}</p>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteValue(value.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
