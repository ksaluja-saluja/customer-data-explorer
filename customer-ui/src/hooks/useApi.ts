import { useEffect, useState } from "react";

type UseApiResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

function useApi<T>(fetcher: () => Promise<T>): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetcher();
        if (isMounted) {
          setData(response);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [fetcher]);

  return {
    data,
    isLoading,
    error,
  };
}

export default useApi;