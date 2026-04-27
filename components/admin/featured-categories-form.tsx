'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getCategories, type Category } from '@/app/actions/categories';
import { FeaturedCategoryConfig } from '@/types/homepage-config';
import {
  getAllFeaturedCategories,
  upsertFeaturedCategory,
  deleteFeaturedCategory,
} from '@/app/actions/homepage-config';
import { Trash2 } from 'lucide-react';

export function FeaturedCategoriesForm() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<FeaturedCategoryConfig[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPositions, setEditingPositions] = useState<{
    [key: number]: {
      category_slug: string;
      redirect_link: string;
      file?: File;
    };
  }>({
    1: { category_slug: '', redirect_link: '' },
    2: { category_slug: '', redirect_link: '' },
    3: { category_slug: '', redirect_link: '' },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar categorías de la BD
      const categoriesResponse = await getCategories();
      if (categoriesResponse.success && categoriesResponse.data) {
        setDbCategories(categoriesResponse.data);
      }

      // Cargar categorías destacadas configuradas
      const response = await getAllFeaturedCategories();
      if (response.success) {
        setCategories(response.data || []);
        // Cargar datos existentes
        response.data?.forEach((cat) => {
          setEditingPositions((prev) => ({
            ...prev,
            [cat.position]: {
              category_slug: cat.category_slug,
              redirect_link: cat.redirect_link || '',
            },
          }));
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getCategoryName = (slug: string) => {
    return dbCategories.find((c) => c.slug === slug)?.name || slug;
  };

  const handleSave = async (position: number) => {
    const data = editingPositions[position];
    if (!data.category_slug) {
      toast({
        title: 'Error',
        description: 'Selecciona una categoría',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let image_url = categories.find((c) => c.position === position)?.image_url || '';
      let image_key = categories.find((c) => c.position === position)?.image_key || '';

      // Si hay archivo nuevo, subirlo
      if (data.file) {
        const formData = new FormData();
        formData.append('file', data.file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir imagen');
        }

        const uploadData = await response.json();
        if (uploadData.success) {
          image_url = uploadData.url;
          image_key = uploadData.key;
        } else {
          throw new Error(uploadData.error || 'Error al subir imagen');
        }
      }

      if (!image_url) {
        toast({
          title: 'Error',
          description: 'Carga una imagen',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const response = await upsertFeaturedCategory(
        {
          position,
          category_name: getCategoryName(data.category_slug),
          category_slug: data.category_slug,
          image_url,
          image_key,
          redirect_link: data.redirect_link || `/categoria/${data.category_slug}`,
        },
        position,
      );

      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Categoría guardada',
        });
        await loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return;

    setLoading(true);
    try {
      const response = await deleteFeaturedCategory(id);
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Categoría eliminada',
        });
        await loadData();
      } else {
        throw new Error(response.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Categorías Destacadas</h2>

      <div className="space-y-4">
        {[1, 2, 3].map((position) => {
          const existing = categories.find((c) => c.position === position);
          const data = editingPositions[position];

          return (
            <div key={position} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Posición {position}</h3>
                {existing && (
                  <button
                    onClick={() => handleDelete(existing.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoría</label>
                <select
                  value={data.category_slug}
                  onChange={(e) =>
                    setEditingPositions((prev) => ({
                      ...prev,
                      [position]: { ...prev[position], category_slug: e.target.value },
                    }))
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Selecciona una categoría</option>
                  {dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.currentTarget.files?.[0];
                    if (file) {
                      setEditingPositions((prev) => ({
                        ...prev,
                        [position]: { ...prev[position], file },
                      }));
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                />
                {existing && (
                  <p className="text-sm text-gray-500 mt-1">
                    Imagen actual: <img
                      src={existing.image_url}
                      alt={existing.category_name}
                      className="w-20 h-20 object-cover rounded mt-2"
                    />
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link de redirección</label>
                <Input
                  type="text"
                  placeholder="/categoria/perfumeria"
                  value={data.redirect_link}
                  onChange={(e) =>
                    setEditingPositions((prev) => ({
                      ...prev,
                      [position]: { ...prev[position], redirect_link: e.target.value },
                    }))
                  }
                />
              </div>

              <Button
                onClick={() => handleSave(position)}
                disabled={loading || !data.category_slug}
                className="w-full"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
