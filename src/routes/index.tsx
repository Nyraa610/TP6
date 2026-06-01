import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { trendingMovies, discoverMovies } from "@/lib/tmdb.functions";
import { MovieGrid } from "@/components/movie-grid";
import { backdrop, type Movie } from "@/lib/tmdb";
import { Link } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CineTrack — Découvrir les films" },
      { name: "description", content: "Explorez les films tendances et populaires, gérez votre watchlist." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const trendingFn = useServerFn(trendingMovies);
  const discoverFn = useServerFn(discoverMovies);

  const trending = useQuery({
    queryKey: ["trending", "week"],
    queryFn: () => trendingFn({ data: { window: "week" } }),
  });
  const popular = useQuery({
    queryKey: ["discover", 1],
    queryFn: () => discoverFn({ data: { page: 1, sort: "popularity.desc" } }),
  });

  const hero: Movie | undefined = trending.data?.results?.[0];

  return (
    <div>
      {hero && (
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <img
            src={backdrop(hero.backdrop_path, "original") ?? ""}
            alt={hero.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-12">
            <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Tendance de la semaine
            </span>
            <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl md:text-6xl">{hero.title}</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base line-clamp-3">
              {hero.overview}
            </p>
            <Link
              to="/movie/$id"
              params={{ id: String(hero.id) }}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <Play className="h-4 w-4 fill-current" />
              Voir les détails
            </Link>
          </div>
        </section>
      )}

      <div className="container mx-auto space-y-12 px-4 py-12">
        <Section title="Tendances" q={trending} />
        <Section title="Populaires" q={popular} />
      </div>
    </div>
  );
}

function Section({ title, q }: { title: string; q: { isLoading: boolean; isError: boolean; error: unknown; data?: { results?: Movie[] } } }) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">{title}</h2>
      {q.isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {q.isError && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Erreur : {(q.error as Error)?.message ?? "Impossible de charger les films"}
        </p>
      )}
      {q.data && <MovieGrid movies={q.data.results ?? []} />}
    </section>
  );
}
