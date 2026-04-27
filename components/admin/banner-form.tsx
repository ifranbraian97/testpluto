'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { createBanner, updateBanner, deleteBanner, getAllBanners } from '@/app/actions/homepage-config';
import { Banner } from '@/types/homepage-config';
import { Trash2, Edit2, Plus, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BannerFormProps {
  onSuccess?: () => void;
}

export function BannerForm({ onSuccess }: BannerFormProps) {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    image_key: '',
    link: '',
    position: '1',
    imagePreview: '',
  });

  const loadBanners = useCallback(async () => {
    try {
      const response = await getAllBanners();
      if (response.success) {
        setBanners(response.data || []);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Solo se permiten archivos de imagen',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'El archivo no debe exceder 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev: any) => ({
        ...prev,
        imagePreview: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Subir a R2
    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      if (data.success) {
        setFormData((prev: any) => ({
          ...prev,
          image_url: data.url,
          image_key: data.key,
        }));
        toast({
          title: 'Éxito',
          description: 'Imagen subida correctamente',
        });
      } else {
        throw new Error(data.error || 'Error al subir la imagen');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al subir la imagen',
        variant: 'destructive',
      });
      setFormData((prev: any) => ({
        ...prev,
        imagePreview: '',
      }));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.image_url || !formData.image_key || !formData.position) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos (incluida imagen)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const position = parseInt(formData.position);

      if (editingId) {
        const response = await updateBanner(editingId, {
          title: formData.title,
          link: formData.link || undefined,
          position,
        });

        if (!response.success) throw new Error(response.error);

        toast({
          title: 'Éxito',
          description: 'Banner actualizado correctamente',
        });
      } else {
        const response = await createBanner({
          title: formData.title,
          image_url: formData.image_url,
          image_key: formData.image_key,
          link: formData.link || undefined,
          position,
        });

        if (!response.success) throw new Error(response.error);

        toast({
          title: 'Éxito',
          description: 'Banner creado correctamente',
        });
      }

      setFormData({
        title: '',
        image_url: '',
        image_key: '',
        link: '',
        position: '1',
        imagePreview: '',
      });
      setEditingId(null);
      await loadBanners();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al guardar banner',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await deleteBanner(id);

      if (!response.success) throw new Error(response.error);

      toast({
        title: 'Éxito',
        description: 'Banner eliminado correctamente',
      });

      await loadBanners();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar banner',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setFormData({
      title: banner.title,
      image_url: banner.image_url,
      image_key: banner.image_key,
      link: banner.link || '',
      position: banner.position.toString(),
      imagePreview: banner.image_url,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: '',
      image_url: '',
      image_key: '',
      link: '',
      position: '1',
      imagePreview: '',
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold">{editingId ? 'Editar Banner' : 'Crear Nuevo Banner'}</h3>

        {/* Image Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
          {formData.imagePreview ? (
            <div className="space-y-4">
              <img src={formData.imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              <div className="space-y-2">
                <p className="text-sm text-green-600 font-medium">✓ Imagen cargada correctamente</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Cargando...' : 'Cambiar imagen'}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-8"
            >
              <Upload className="w-5 h-5 mr-2" />
              <span>{uploading ? 'Cargando imagen...' : 'Cargar imagen a R2 *'}</span>
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-3">PNG, JPG, WEBP - Máximo 5MB</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Promoción de Verano"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Enlace (opcional)</label>
            <Input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://example.com/promo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Posición (1-3) *</label>
            <select
              name="position"
              value={formData.position}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData((prev: any) => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || uploading}>
            {loading ? 'Guardando...' : editingId ? 'Actualizar Banner' : 'Crear Banner'}
          </Button>

          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>

      {/* Lista de Banners */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Banners Existentes ({banners.length}/3)</h3>
        {banners.length === 0 ? (
          <p className="text-gray-500">No hay banners creados aún</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {banner.image_url && (
                  <img src={banner.image_url} alt={banner.title} className="w-full h-32 object-cover" />
                )}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-medium">{banner.title}</p>
                    <p className="text-xs text-gray-500">Posición: {banner.position}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      disabled={loading}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Editar
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" disabled={loading}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Eliminar Banner</AlertDialogTitle>
                          <AlertDialogDescription>¿Estás seguro de que deseas eliminar este banner? Esta acción no se puede deshacer.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(banner.id)}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
