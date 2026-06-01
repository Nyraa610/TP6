import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { movieDetails } from "@/lib/tmdb.functions";
import { backdrop, poster, type Movie } from "@/lib/tmdb";
import { MovieGrid } from "@/components/movie-grid";
import { useWatchlist } from "@/hooks/use-watchlist";
import { Bookmark, BookmarkCheck, Loader2, Star, Clock } from "lucide-react";

export const Route = createFileRoute("/movie/$id")({
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { id } = Route.useParams();
  const fn = useServerFn(movieDetails);
  const { has, toggle } = useWatchlist();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fn({ data: { id: Number(id) } }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  if (isError) {
    return <p className="container mx-auto p-8 text-destructive">Erreur : {(error as Error).message}</p>;
  }
  if (!data) return null;

  const inList = has(data.id);
  const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h${String(data.runtime % 60).padStart(2, "0")}` : null;
  const cast = data.credits?.cast?.slice(0, 8) ?? [];
  const similar: Movie[] = data.similar?.results?.slice(0, 12) ?? [];

  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        {data.backdrop_path && (
          <img
            src={backdrop(data.backdrop_path, "original") ?? ""}
            alt={data.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </section>

      <div className="container mx-auto -mt-32 px-4 pb-12">
        <div className="flex flex-col gap-8 md:flex-row">
          {data.poster_path && (
            <img
              src={poster(data.poster_path, "w500") ?? ""}
              alt={data.title}
              className="w-48 self-start rounded-lg border border-border shadow-2xl md:w-64"
            />
          )}
          <div className="flex-1 pt-4 md:pt-32">
            <h1 className="text-4xl font-bold md:text-5xl">{data.title}</h1>
            {data.tagline && <p className="mt-2 text-lg italic text-muted-foreground">{data.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {data.release_date && <span>{data.release_date.slice(0, 4)}</span>}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {runtime}
                </span>
              )}
              {data.vote_average > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {data.vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>

            {data.genres?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {data.genres.map((g: { id: number; name: string }) => (
                  <span key={g.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 max-w-3xl leading-relaxed">{data.overview}</p>

            <button
              onClick={() =>
                toggle({
                  id: data.id,
                  title: data.title,
                  poster_path: data.poster_path,
                  release_date: data.release_date,
                  vote_average: data.vote_average,
                })
              }
              className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-colors ${
                inList
                  ? "bg-primary text-primary-foreground"
                  : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            >
              {inList ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {inList ? "Dans ma watchlist" : "Ajouter à la watchlist"}
            </button>
          </div>
        </div>

        {cast.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Casting</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
              {cast.map((p: { id: number; name: string; character: string; profile_path: string | null }) => (
                <div key={p.id} className="text-center">
                  <div className="aspect-square overflow-hidden rounded-full bg-muted">
                    {p.profile_path ? (
                      <img
                        src={poster(p.profile_path, "w200") ?? ""}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Films similaires</h2>
            <MovieGrid movies={similar} />
          </section>
        )}
      </div>
    </div>
  );
}
