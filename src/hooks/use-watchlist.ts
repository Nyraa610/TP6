import { useEffect, useState, useCallback } from "react";
import type { Movie } from "@/lib/tmdb";

const KEY = "cinetrack:watchlist";

type StoredMovie = Pick<Movie, "id" | "title" | "poster_path" | "release_date" | "vote_average">;

function read(): StoredMovie[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [items, setItems] = useState<StoredMovie[]>([]);

  useEffect(() => {
    setItems(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setItems(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: StoredMovie[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }, []);

  const has = useCallback((id: number) => items.some((m) => m.id === id), [items]);

  const toggle = useCallback(
    (m: StoredMovie) => {
      const exists = items.some((x) => x.id === m.id);
      save(exists ? items.filter((x) => x.id !== m.id) : [...items, m]);
    },
    [items, save],
  );

  const remove = useCallback(
    (id: number) => save(items.filter((x) => x.id !== id)),
    [items, save],
  );

  return { items, has, toggle, remove };
}
