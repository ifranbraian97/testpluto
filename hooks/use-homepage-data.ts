import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Banner } from '@/types/homepage-config';
import { Product } from '@/types/product';

interface BannerWithProduct extends Banner {
  product?: Product;
}

interface ProductMapping {
  id: string;
  product_id: string;
  position: number;
  product: Product;
}

export function useHomepageData(forceRefresh: boolean = false) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [generalProducts, setGeneralProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const pollingIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Campos optimizados para lista (evita traer datos pesados)
  const PRODUCT_FIELDS = 'id, name, price, price_offer, image, category, slug, stock, created_at';

  useEffect(() => {
    const supabase = createClient();

    const loadData = async () => {
      try {
        console.log('[useHomepageData] Fetching data from Supabase...');
        setLoading(true);
        setError(null);

        // Obtener banners
        const { data: bannersData, error: bannersError } = await supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (bannersError) throw bannersError;
        setBanners(bannersData || []);

        // Obtener productos destacados con detalles del producto
        const { data: featuredData, error: featuredError } = await supabase
          .from('featured_products_mapping')
          .select(
            `
            id,
            product_id,
            position,
            is_active,
            product:products(${PRODUCT_FIELDS})
          `
          )
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (featuredError) throw featuredError;
        const featuredProducts = (featuredData || [])
          .map((item: any) => item.product)
          .filter(Boolean);
        setFeaturedProducts(featuredProducts);

        // Obtener nuevos ingresos
        const { data: newArrivalsData, error: newArrivalsError } = await supabase
          .from('new_arrivals_mapping')
          .select(
            `
            id,
            product_id,
            position,
            is_active,
            product:products(${PRODUCT_FIELDS})
          `
          )
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (newArrivalsError) throw newArrivalsError;
        const newProducts = (newArrivalsData || [])
          .map((item: any) => item.product)
          .filter(Boolean);
        setNewArrivals(newProducts);

        // Obtener productos generales
        const { data: generalData, error: generalError } = await supabase
          .from('general_products_mapping')
          .select(
            `
            id,
            product_id,
            position,
            is_active,
            product:products(${PRODUCT_FIELDS})
          `
          )
          .eq('is_active', true)
          .order('position', { ascending: true });

        if (generalError) throw generalError;
        const generalProds = (generalData || [])
          .map((item: any) => item.product)
          .filter(Boolean);
        setGeneralProducts(generalProds);

        console.log('[useHomepageData] Data loaded successfully');
      } catch (err) {
        console.error('[useHomepageData] Error:', err);
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    // Debounce inicial
    loadTimeoutRef.current = setTimeout(() => {
      loadData();
    }, 300);

    // POLLING REMOVED - Testing real-time subscriptions only
    // Real-time subscriptions maneja cambios inmediatos
    pollingIntervalRef.current = undefined;

    // DISABLED: Real-time subscriptions causing request loops on Vercel
    // Keeping cache strategy instead (30 second TTL)
    // Real-time can be re-enabled with proper debouncing if needed
    let subscriptions: any[] = [];
    
    // if (process.env.NODE_ENV === 'development') {
    //   try {
    //     const channels = [
    //       { name: 'banners-changes', table: 'banners' },
    //       { name: 'featured-changes', table: 'featured_products_mapping' },
    //       { name: 'arrivals-changes', table: 'new_arrivals_mapping' },
    //       { name: 'general-changes', table: 'general_products_mapping' },
    //     ];

    //     let debounceTimeout: NodeJS.Timeout;
    //     const debouncedLoadData = () => {
    //       clearTimeout(debounceTimeout);
    //       debounceTimeout = setTimeout(() => {
    //         console.log('[useHomepageData] Real-time: Changes detected - reloading');
    //         loadData();
    //       }, 1000); // Wait 1 second before reloading
    //     };

    //     channels.forEach(({ name, table }) => {
    //       const sub = supabase
    //         .channel(name)
    //         .on(
    //           'postgres_changes',
    //           { event: '*', schema: 'public', table },
    //           () => debouncedLoadData()
    //         )
    //         .subscribe();
    //       subscriptions.push(sub);
    //     });

    //     console.log('[useHomepageData] Real-time subscriptions created');
    //   } catch (err) {
    //     console.error('[useHomepageData] Subscriptions error:', err);
    //   }
    // }

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
  }, []);

  return {
    banners,
    featuredProducts,
    newArrivals,
    generalProducts,
    loading,
    error,
  };
}

