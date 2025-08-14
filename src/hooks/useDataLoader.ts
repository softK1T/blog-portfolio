import { useState, useEffect, useCallback } from "react";

interface UseDataLoaderOptions<T> {
  loader: () => Promise<T>;
}

interface UseDataLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for loading data with proper memoization to prevent continuous requests.
 * The loader function should be memoized using useCallback to prevent unnecessary re-renders.
 *
 * @example
 * ```tsx
 * const loader = useCallback(() => service.getData(), []);
 * const { data, loading, error } = useDataLoader({ loader });
 * ```
 */
export function useDataLoader<T>({
  loader,
}: UseDataLoaderOptions<T>): UseDataLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loader();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
