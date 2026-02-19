"use client";
import { API_BASE } from "@/lib/api";
import { useState, useEffect } from "react";

export type UseApiResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useApi<T>(path: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API_BASE}${path}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load data (${res.status})`);
        }

        const json: T = await res.json();
        setData(json);
      } catch (err) {
        // Ignore abort errors (component unmounted)
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [path]);

  return { data, loading, error };
}
