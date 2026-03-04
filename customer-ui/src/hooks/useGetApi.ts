import { useEffect, useState } from "react";

type UseApiResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

function useGetApi<T>(fetcher: (...args: any[]) => Promise<T>, dependencies: any[] = []): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetcher();
        setData(response);
      } catch {
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [fetcher, ...dependencies]);

  return {
    data,
    isLoading,
    error,
  };
}

export default useGetApi;