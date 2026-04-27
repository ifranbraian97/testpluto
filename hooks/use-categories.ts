'use client';

import { useEffect, useState } from 'react';
import { getCategories, type Category } from '@/app/actions/categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategories();
        if (response.success) {
          setCategories(response.data || []);
          setError(null);
        } else {
          setError(response.error || 'Error loading categories');
          setCategories([]);
        }
      } catch (err: any) {
        console.error('Error loading categories:', err);
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
}