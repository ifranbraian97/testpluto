'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BannerForm } from '@/components/admin/banner-form';
import { ProductMappingForm } from '@/components/admin/product-mapping-form';
import { FeaturedCategoriesForm } from '@/components/admin/featured-categories-form';
import { PromoBannerForm } from '@/components/admin/promo-banner-form';
import {
  getAllFeaturedProducts,
  getAllNewArrivals,
  getAllGeneralProducts,
  addFeaturedProduct,
  removeFeaturedProduct,
  updateFeaturedProduct,
  addNewArrival,
  removeNewArrival,
  updateNewArrival,
  addGeneralProduct,
  removeGeneralProduct,
  updateGeneralProduct,
} from '@/app/actions/homepage-config';
import { useToast } from '@/hooks/use-toast';

interface ProductWithDetails {
  id: string;
  product_id: string;
  position: number;
  is_active: boolean;
  product?: any;
}

export function HomepageConfigPanel() {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductWithDetails[]>([]);
  const [generalProducts, setGeneralProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      const response = await getAllFeaturedProducts();
      if (response.success) {
        setFeaturedProducts(response.data || []);
      }
    } catch (error) {
      console.error('Error loading featured products:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar productos destacados',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const loadNewArrivals = useCallback(async () => {
    try {
      const response = await getAllNewArrivals();
      if (response.success) {
        setNewArrivals(response.data || []);
      }
    } catch (error) {
      console.error('Error loading new arrivals:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar nuevos ingresos',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const loadGeneralProducts = useCallback(async () => {
    try {
      const response = await getAllGeneralProducts();
      if (response.success) {
        setGeneralProducts(response.data || []);
      }
    } catch (error) {
      console.error('Error loading general products:', error);
      toast({
        title: 'Error',
        description: 'Error al cargar productos en general',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadFeaturedProducts();
    loadNewArrivals();
    loadGeneralProducts();
  }, [loadFeaturedProducts, loadNewArrivals, loadGeneralProducts]);

  return (
    <div className="w-full">
      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="banners">Banner</TabsTrigger>
          <TabsTrigger value="featured">Destacados</TabsTrigger>
          <TabsTrigger value="new-arrivals">Nuevos Ingresos</TabsTrigger>
          <TabsTrigger value="general">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="promo">Promo</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Banner Principal</h2>
            <p className="text-gray-600 mb-6">
              Configura el carrusel de imágenes principal (máximo 3). Las imágenes deben ser subidas a Cloudflare R2.
            </p>
            <BannerForm onSuccess={() => {}} />
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Productos Destacados</h2>
            <p className="text-gray-600 mb-6">
              Selecciona hasta 8 productos para mostrar en la sección de destacados. Puedes cambiar su orden con las flechas.
            </p>
            <ProductMappingForm
              title="Productos Destacados"
              maxProducts={8}
              products={featuredProducts}
              onAddProduct={(product_id, position) =>
                addFeaturedProduct({ product_id, position })
              }
              onRemoveProduct={(id) => removeFeaturedProduct(id)}
              onUpdateProduct={(id, position) =>
                updateFeaturedProduct(id, { position })
              }
              onLoadProducts={loadFeaturedProducts}
            />
          </div>
        </TabsContent>

        <TabsContent value="new-arrivals" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Nuevos Ingresos</h2>
            <p className="text-gray-600 mb-6">
              Selecciona hasta 8 productos nuevos para mostrar en la sección de nuevos ingresos. Puedes cambiar su orden con las flechas.
            </p>
            <ProductMappingForm
              title="Nuevos Ingresos"
              maxProducts={8}
              products={newArrivals}
              onAddProduct={(product_id, position) =>
                addNewArrival({ product_id, position })
              }
              onRemoveProduct={(id) => removeNewArrival(id)}
              onUpdateProduct={(id, position) =>
                updateNewArrival(id, { position })
              }
              onLoadProducts={loadNewArrivals}
            />
          </div>
        </TabsContent>

        <TabsContent value="general" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Productos en General</h2>
            <p className="text-gray-600 mb-6">
              Selecciona hasta 12 productos para mostrar en la grid de productos generales. Puedes cambiar su orden con las flechas.
            </p>
            <ProductMappingForm
              title="Productos en General"
              maxProducts={12}
              products={generalProducts}
              onAddProduct={(product_id, position) =>
                addGeneralProduct({ product_id, position })
              }
              onRemoveProduct={(id) => removeGeneralProduct(id)}
              onUpdateProduct={(id, position) =>
                updateGeneralProduct(id, { position })
              }
              onLoadProducts={loadGeneralProducts}
            />
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold mb-6">Gestionar Categorías Destacadas</h2>
            <p className="text-gray-600 mb-6">
              Configura hasta 3 categorías destacadas con imágenes personalizadas. Estas aparecerán en el carrusel de la página de inicio.
            </p>
            <FeaturedCategoriesForm />
          </div>
        </TabsContent>

        <TabsContent value="promo" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <PromoBannerForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
