import { Link } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { poster, type Movie } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/use-watchlist";
import { cn } from "@/lib/utils";

export function MovieCard({ movie }: { movie: Movie }) {
  const { has, toggle } = useWatchlist();
  const inList = has(movie.id);
  const img = poster(movie.poster_path);

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <Link
        to="/movie/$id"
        params={{ id: String(movie.id) }}
        className="block aspect-[2/3] overflow-hidden bg-muted"
      >
        {img ? (
          <img
            src={img}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
            Pas d'affiche
          </div>
        )}
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggle({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
          });
        }}
        aria-label={inList ? "Retirer de la watchlist" : "Ajouter à la watchlist"}
        className={cn(
          "absolute right-2 top-2 rounded-full p-2 backdrop-blur transition-all",
          inList
            ? "bg-primary text-primary-foreground"
            : "bg-background/70 text-foreground hover:bg-primary hover:text-primary-foreground",
        )}
      >
        {inList ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      </button>
      <div className="p-3">
        <Link to="/movie/$id" params={{ id: String(movie.id) }}>
          <h3 className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary">
            {movie.title}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{movie.release_date?.slice(0, 4) || "—"}</span>
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {movie.vote_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
