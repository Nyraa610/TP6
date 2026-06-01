import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE = "https://api.themoviedb.org/3";

async function tmdb(path: string, params: Record<string, string | number | undefined> = {}) {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY missing");
  const url = new URL(BASE + path);
  url.searchParams.set("api_key", key);
  url.searchParams.set("language", "fr-FR");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${await res.text()}`);
  return res.json();
}

export const discoverMovies = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      page: z.number().min(1).max(500).default(1),
      sort: z.string().default("popularity.desc"),
    }),
  )
  .handler(async ({ data }) => {
    return tmdb("/discover/movie", { page: data.page, sort_by: data.sort });
  });

export const searchMovies = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      query: z.string().min(1).max(200),
      page: z.number().min(1).max(500).default(1),
    }),
  )
  .handler(async ({ data }) => {
    return tmdb("/search/movie", { query: data.query, page: data.page });
  });

export const movieDetails = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    return tmdb(`/movie/${data.id}`, { append_to_response: "credits,videos,similar" });
  });

export const trendingMovies = createServerFn({ method: "GET" })
  .inputValidator(z.object({ window: z.enum(["day", "week"]).default("week") }))
  .handler(async ({ data }) => {
    return tmdb(`/trending/movie/${data.window}`);
  });
