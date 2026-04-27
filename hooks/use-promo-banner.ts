import { useEffect, useState } from 'react';
import { PromoBannerConfig } from '@/types/homepage-config';
import { getPromoBanner } from '@/app/actions/homepage-config';

export function usePromoBanner() {
  const [banner, setBanner] = useState<PromoBannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        setLoading(true);
        const response = await getPromoBanner();
        if (response.success) {
          setBanner(response.data || null);
          setError(null);
        } else {
          setError(response.error || 'Error loading banner');
          setBanner(null);
        }
      } catch (err: any) {
        console.error('Error loading promo banner:', err);
        setError(err.message);
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();

  // POLLING REMOVED - Testing real-time only
  // Real-time subscriptions should handle updates
  const interval = undefined;

    return () => clearInterval(interval);
  }, []);

  return { banner, loading, error };
}
