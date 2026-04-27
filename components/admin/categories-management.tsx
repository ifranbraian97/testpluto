'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Edit2, Trash2, Plus, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getAllCategoriesIncludingInactive,
  type Category,
} from '@/app/actions/categories'

export function CategoriesManagement() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'slug' | 'created'>('name')

  // Cargar categorías
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const response = await getAllCategoriesIncludingInactive()
      if (response.success && response.data) {
        setCategories(response.data)
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Error al cargar categorías',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast({
        title: 'Error',
        description: 'Error al cargar categorías',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Generar slug desde el nombre
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  // Manejar cambio en el nombre (auto-generar slug)
  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: formData.slug || generateSlug(name),
    })
  }

  // Abrir formulario para crear
  const openCreateForm = useCallback(() => {
    setEditingId(null)
    setFormData({ name: '', slug: '' })
    setIsFormOpen(true)
  }, [])

  // Abrir formulario para editar
  const openEditForm = useCallback((category: Category) => {
    setEditingId(category.id)
    setFormData({ name: category.name, slug: category.slug })
    setIsFormOpen(true)
  }, [])

  // Cerrar formulario
  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingId(null)
    setFormData({ name: '', slug: '' })
  }, [])

  // Guardar (crear o editar)
  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre es requerido',
        variant: 'destructive',
      })
      return
    }

    if (!formData.slug.trim()) {
      toast({
        title: 'Error',
        description: 'El slug es requerido',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        // Actualizar
        const response = await updateCategory(editingId, formData.name, formData.slug)
        if (response.success) {
          toast({
            title: 'Éxito',
            description: 'Categoría actualizada',
          })
          await loadCategories()
          closeForm()
        } else {
          throw new Error(response.error)
        }
      } else {
        // Crear
        const response = await createCategory(formData.name, formData.slug)
        if (response.success) {
          toast({
            title: 'Éxito',
            description: 'Categoría creada',
          })
          await loadCategories()
          closeForm()
        } else {
          throw new Error(response.error)
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar categoría',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Eliminar o activar categoría
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return

    setLoading(true)
    try {
      const response = await deleteCategory(id)
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Categoría eliminada',
        })
        await loadCategories()
      } else {
        throw new Error(response.error)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar categoría',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Toggle estado de categoría (activar/desactivar)
  const handleToggleStatus = async (id: number) => {
    setLoading(true)
    try {
      const response = await toggleCategoryStatus(id)
      if (response.success) {
        const newStatus = response.data?.is_active ? 'activada' : 'desactivada'
        toast({
          title: 'Éxito',
          description: `Categoría ${newStatus}`,
        })
        await loadCategories()
      } else {
        throw new Error(response.error)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al cambiar estado',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar y ordenar categorías
  const filteredCategories = categories
    .filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'slug') return a.slug.localeCompare(b.slug)
      return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Formulario */}
      {isFormOpen && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Nombre *</Label>
              <Input
                placeholder="Ej: Celulares"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label>Slug *</Label>
              <Input
                placeholder="Ej: celulares"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Se genera automáticamente desde el nombre. Usar solo letras, números y guiones.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={closeForm} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Buscador y filtros */}
      <Card className="p-4">
        <div className="flex gap-4 flex-col md:flex-row md:items-end">
          <div className="flex-1">
            <Label className="text-sm">Buscar</Label>
            <Input
              placeholder="Por nombre o slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <Label className="text-sm">Ordenar por</Label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'slug' | 'created')}
              className="border rounded px-3 py-2 text-sm"
              disabled={loading}
            >
              <option value="name">Nombre</option>
              <option value="slug">Slug</option>
              <option value="created">Creado</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabla de categorías */}
      <Card className="overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold">Nombre</th>
                <th className="p-4 text-left text-sm font-semibold">Slug</th>
                <th className="p-4 text-left text-sm font-semibold">Estado</th>
                <th className="p-4 text-left text-sm font-semibold">Creado</th>
                <th className="p-4 text-left text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    Cargando...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-muted-foreground">
                    {searchTerm
                      ? 'No se encontraron categorías que coincidan con la búsqueda'
                      : 'No hay categorías'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <span className="font-medium">{category.name}</span>
                    </td>
                    <td className="p-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">{category.slug}</code>
                    </td>
                    <td className="p-4">
                      {category.is_active ? (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {category.created_at
                        ? new Date(category.created_at).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(category)}
                          disabled={loading}
                          className="gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Editar
                        </Button>
                        <Button
                          variant={category.is_active ? "secondary" : "default"}
                          size="sm"
                          onClick={() => handleToggleStatus(category.id)}
                          disabled={loading}
                          className="gap-2"
                        >
                          {category.is_active ? (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Activar
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resumen */}
      <div className="text-sm text-muted-foreground">
        <p>Total: {filteredCategories.length} categorías</p>
        <p>Activas: {filteredCategories.filter((c) => c.is_active).length}</p>
        <p>Inactivas: {filteredCategories.filter((c) => !c.is_active).length}</p>
      </div>
    </div>
  )
}
