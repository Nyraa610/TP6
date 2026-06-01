import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { searchMovies } from "@/lib/tmdb.functions";
import { MovieGrid } from "@/components/movie-grid";
import { Search, Loader2 } from "lucide-react";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Rechercher — CineTrack" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);
  const searchFn = useServerFn(searchMovies);

  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchFn({ data: { query: q, page: 1 } }),
    enabled: q.length > 0,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Rechercher un film</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: { q: input.trim() || undefined } });
        }}
        className="mb-8 flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Titre du film…"
            className="w-full rounded-md border border-input bg-card py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Chercher
        </button>
      </form>

      {!q && <p className="text-muted-foreground">Tape un titre pour démarrer la recherche.</p>}
      {q && query.isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {q && query.isError && (
        <p className="text-destructive">Erreur : {(query.error as Error).message}</p>
      )}
      {q && query.data && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {query.data.total_results ?? 0} résultats pour « {q} »
          </p>
          <MovieGrid movies={query.data.results ?? []} />
        </>
      )}
    </div>
  );
}
