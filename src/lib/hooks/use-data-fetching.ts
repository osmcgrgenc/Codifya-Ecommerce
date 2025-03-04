import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface FetchOptions<T> {
  fetchFn: () => Promise<T>;
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  errorMessage?: string;
  dependencies?: any[];
}

export function useDataFetching<T>({
  fetchFn,
  initialData,
  onSuccess,
  onError,
  errorMessage = 'Veri yüklenirken bir hata oluştu',
  dependencies = [],
}: FetchOptions<T>) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();

        if (isMounted) {
          setData(result);
          setError(null);

          if (onSuccess) {
            onSuccess(result);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          toast({
            title: 'Hata',
            description: errorMessage,
            variant: 'destructive',
          });

          if (onError) {
            onError(err);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, onSuccess, onError, errorMessage, toast]);

  return { data, loading, error, refetch: () => setLoading(true) };
}
