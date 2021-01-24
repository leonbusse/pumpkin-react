import { useEffect, useState } from "react";

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useApiCall<T, R>(
  arg: T | null,
  call: (arg: T) => Promise<R | null>
): { data: R | null; error: Error | null } {
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<R | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      if (!error && arg && !fetching && !data) {
        setFetching(true);
        try {
          const r: R | null = await call(arg);
          if (!r) return;

          setData(r);
          setFetching(false);
        } catch (e) {
          setError(e);
          setFetching(false);
        }
      }
    })();
  }, [error, arg, call, fetching, setFetching, data]);

  return { data, error };
}
