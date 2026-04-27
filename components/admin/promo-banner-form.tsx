'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/use-categories';
import { PromoBannerConfig } from '@/types/homepage-config';
import { getPromoBanner, upsertPromoBanner, deletePromoBanner } from '@/app/actions/homepage-config';
import { Trash2 } from 'lucide-react';

export function PromoBannerForm() {
  const { toast } = useToast();
  const { categories: dbCategories } = useCategories();
  const [banner, setBanner] = useState<PromoBannerConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({
    title: '',
    category_slug: '',
    redirect_link: '',
    file: undefined as File | undefined,
  });

  useEffect(() => {
    loadBanner();
  }, []);

  const loadBanner = async () => {
    try {
      const response = await getPromoBanner();
      if (response.success && response.data) {
        setBanner(response.data);
        setEditing({
          title: response.data.title,
          category_slug: response.data.category_slug,
          redirect_link: response.data.redirect_link || '',
          file: undefined,
        });
      }
    } catch (error) {
      console.error('Error loading banner:', error);
    }
  };

  const handleSave = async () => {
    if (!editing.title || !editing.category_slug) {
      toast({
        title: 'Error',
        description: 'Completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let image_url = banner?.image_url || '';
      let image_key = banner?.image_key || '';

      // Si hay archivo nuevo, subirlo
      if (editing.file) {
        const formData = new FormData();
        formData.append('file', editing.file);
        
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

      const response = await upsertPromoBanner({
        title: editing.title,
        category_slug: editing.category_slug,
        image_url,
        image_key,
        redirect_link: editing.redirect_link || `/categoria/${editing.category_slug}`,
      });

      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Banner guardado',
        });
        await loadBanner();
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

  const handleDelete = async () => {
    if (!banner || !confirm('¿Eliminar este banner?')) return;

    setLoading(true);
    try {
      const response = await deletePromoBanner(banner.id);
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Banner eliminado',
        });
        setBanner(null);
        setEditing({
          title: '',
          category_slug: '',
          redirect_link: '',
          file: undefined,
        });
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banner Promo (Colección Exclusiva)</h2>
        {banner && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="border rounded-lg p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Título</label>
          <Input
            type="text"
            placeholder="Perfumes Árabes"
            value={editing.title}
            onChange={(e) => setEditing((prev) => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categoría</label>
          <select
            value={editing.category_slug}
            onChange={(e) => setEditing((prev) => ({ ...prev, category_slug: e.target.value }))}
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
                setEditing((prev) => ({ ...prev, file }));
              }
            }}
            className="w-full border rounded px-3 py-2"
          />
          {banner && (
            <p className="text-sm text-gray-500 mt-1">
              Imagen actual:
              <img src={banner.image_url} alt={banner.title} className="w-32 h-20 object-cover rounded mt-2" />
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Link de redirección</label>
          <Input
            type="text"
            placeholder="/categoria/perfumeria"
            value={editing.redirect_link}
            onChange={(e) => setEditing((prev) => ({ ...prev, redirect_link: e.target.value }))}
          />
        </div>

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Guardando...' : 'Guardar Banner'}
        </Button>
      </div>
    </div>
  );
}
