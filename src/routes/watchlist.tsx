import { createFileRoute, Link } from "@tanstack/react-router";
import { useWatchlist } from "@/hooks/use-watchlist";
import { poster } from "@/lib/tmdb";
import { Star, Trash2, Bookmark } from "lucide-react";

export const Route = createFileRoute("/watchlist")({
  head: () => ({ meta: [{ title: "Ma watchlist — CineTrack" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const { items, remove } = useWatchlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Ma watchlist</h1>
      <p className="mb-8 text-muted-foreground">{items.length} film{items.length > 1 ? "s" : ""} à voir</p>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Votre watchlist est vide.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-primary px-6 py-2 font-semibold text-primary-foreground"
          >
            Découvrir des films
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
            >
              <Link to="/movie/$id" params={{ id: String(m.id) }} className="shrink-0">
                <div className="h-24 w-16 overflow-hidden rounded bg-muted">
                  {m.poster_path && (
                    <img src={poster(m.poster_path, "w200") ?? ""} alt={m.title} className="h-full w-full object-cover" />
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to="/movie/$id" params={{ id: String(m.id) }}>
                  <h3 className="font-semibold hover:text-primary">{m.title}</h3>
                </Link>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{m.release_date?.slice(0, 4) || "—"}</span>
                  {m.vote_average > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {m.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => remove(m.id)}
                aria-label="Retirer"
                className="rounded-md p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
