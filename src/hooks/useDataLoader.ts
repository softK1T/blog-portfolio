import { useState, useEffect } from "react";

interface UseDataLoaderOptions<T> {
  loader: () => Promise<T>;
  dependencies?: any[];
  onError?: (error: Error) => void;
}

interface UseDataLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDataLoader<T>({
  loader,
  dependencies = [],
  onError,
}: UseDataLoaderOptions<T>): UseDataLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loader();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, dependencies);

  return {
    data,
    loading,
    error,
    refetch: loadData,
  };
}
