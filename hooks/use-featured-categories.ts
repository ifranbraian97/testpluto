import { useEffect, useState } from 'react';
import { FeaturedCategoryConfig } from '@/types/homepage-config';
import { getFeaturedCategories } from '@/app/actions/homepage-config';

export function useFeaturedCategories() {
  const [categories, setCategories] = useState<FeaturedCategoryConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await getFeaturedCategories();
        if (response.success) {
          setCategories(response.data || []);
          setError(null);
        } else {
          setError(response.error || 'Error loading categories');
          setCategories([]);
        }
      } catch (err: any) {
        console.error('Error loading featured categories:', err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();

  // POLLING REMOVED - Testing real-time only
  // Real-time subscriptions should handle updates
  const interval = undefined;

    return () => clearInterval(interval);
  }, []);

  return { categories, loading, error };
}
