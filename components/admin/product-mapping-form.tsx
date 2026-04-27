'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { getAllProducts } from '@/app/actions/admin-products';

interface ProductMappingFormProps {
  title: string;
  maxProducts: number;
  onAddProduct: (product_id: string, position: number) => Promise<any>;
  onRemoveProduct: (id: string) => Promise<any>;
  onUpdateProduct: (id: string, position: number) => Promise<any>;
  products: any[];
  onLoadProducts?: () => Promise<void>;
  onSuccess?: () => void;
}

export function ProductMappingForm({
  title,
  maxProducts,
  onAddProduct,
  onRemoveProduct,
  onUpdateProduct,
  products,
  onLoadProducts,
  onSuccess,
}: ProductMappingFormProps) {
  const { toast } = useToast();
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Throttle refs para evitar clicks duplicados (500ms)
  const addProductTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isAddingRef = useRef<boolean>(false);
  const removeProductTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRemovingRef = useRef<boolean>(false);

  useEffect(() => {
    loadAvailableProducts();
    // Cleanup
    return () => {
      if (addProductTimeoutRef.current) clearTimeout(addProductTimeoutRef.current);
      if (removeProductTimeoutRef.current) clearTimeout(removeProductTimeoutRef.current);
    };
  }, []);

  const loadAvailableProducts = async () => {
    try {
      const products = await getAllProducts();
      setAvailableProducts(products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const remainingSlots = maxProducts - products.length;
  const usedPositions = new Set(products.map((p) => p.position));
  const availablePositions = Array.from({ length: maxProducts }, (_, i) => i + 1).filter((pos) => !usedPositions.has(pos));

  const handleAddProduct = async () => {
    // Throttle: prevenir clicks duplicados
    if (isAddingRef.current) return;
    isAddingRef.current = true;

    if (!selectedProductId) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un producto',
        variant: 'destructive',
      });
      isAddingRef.current = false;
      return;
    }

    const nextPosition = availablePositions[0];
    if (!nextPosition) {
      toast({
        title: 'Error',
        description: `Has alcanzado el máximo de ${maxProducts} productos`,
        variant: 'destructive',
      });
      isAddingRef.current = false;
      return;
    }

    setLoading(true);
    try {
      const response = await onAddProduct(selectedProductId, nextPosition);
      if (!response.success) throw new Error(response.error);

      toast({
        title: 'Éxito',
        description: 'Producto agregado correctamente',
      });

      setSelectedProductId('');
      await onLoadProducts?.();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al agregar producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Re-habilitar throttle después de 500ms
      addProductTimeoutRef.current = setTimeout(() => {
        isAddingRef.current = false;
      }, 500);
    }
  };

  // Throttle para remover también
  const handleRemove = async (id: string) => {
    if (isRemovingRef.current) return
    isRemovingRef.current = true

    setLoading(true);
    try {
      const response = await onRemoveProduct(id);
      if (!response.success) throw new Error(response.error);

      toast({
        title: 'Éxito',
        description: 'Producto removido correctamente',
      });

      await onLoadProducts?.();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al remover producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      // Re-habilitar throttle después de 500ms
      removeProductTimeoutRef.current = setTimeout(() => {
        isRemovingRef.current = false;
      }, 500);
    }
  };

  const handleMoveUp = async (product: any) => {
    if (product.position <= 1) return;

    setLoading(true);
    try {
      const allProducts = products.sort((a, b) => a.position - b.position);
      const currentIndex = allProducts.findIndex((p) => p.id === product.id);
      const prevProduct = allProducts[currentIndex - 1];

      // Intercambiar posiciones
      await onUpdateProduct(product.id, prevProduct.position);
      await onUpdateProduct(prevProduct.id, product.position);

      toast({
        title: 'Éxito',
        description: 'Producto movido correctamente',
      });

      await onLoadProducts?.();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al mover producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMoveDown = async (product: any) => {
    if (product.position >= maxProducts) return;

    setLoading(true);
    try {
      const allProducts = products.sort((a, b) => a.position - b.position);
      const currentIndex = allProducts.findIndex((p) => p.id === product.id);
      const nextProduct = allProducts[currentIndex + 1];

      // Intercambiar posiciones
      await onUpdateProduct(product.id, nextProduct.position);
      await onUpdateProduct(nextProduct.id, product.position);

      toast({
        title: 'Éxito',
        description: 'Producto movido correctamente',
      });

      await onLoadProducts?.();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Error al mover producto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sortedProducts = [...products].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-6">
      {/* Agregar producto */}
      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Seleccionar Producto *</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={remainingSlots === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Elige un producto...</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Próxima Posición</label>
            <Input
              type="text"
              value={availablePositions[0] || 'Lleno'}
              disabled
              className="bg-gray-200"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAddProduct}
              disabled={loading || remainingSlots === 0}
              className="w-full"
            >
              {loading ? 'Agregando...' : 'Agregar Producto'}
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {products.length} de {maxProducts} productos utilizados ({remainingSlots} disponibles)
        </p>
      </div>

      {/* Lista de productos */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Productos Agregados</h3>
        {sortedProducts.length === 0 ? (
          <p className="text-gray-500">No hay productos agregados aún</p>
        ) : (
          <div className="space-y-3">
            {sortedProducts.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                      {product.position}
                    </div>
                    <div>
                      <p className="font-medium">{product.product?.name || `Producto ID: ${product.product_id}`}</p>
                      <p className="text-sm text-gray-500">
                        ${product.product?.price.toLocaleString('es-AR') || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(product)}
                    disabled={loading || idx === 0}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(product)}
                    disabled={loading || idx === sortedProducts.length - 1}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={loading}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover Producto</AlertDialogTitle>
                        <AlertDialogDescription>¿Estás seguro de que deseas remover este producto? Esta acción no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemove(product.id)}>Remover</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
