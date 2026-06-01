export const IMG = "https://image.tmdb.org/t/p";
export const poster = (path: string | null, size: "w200" | "w342" | "w500" | "original" = "w342") =>
  path ? `${IMG}/${size}${path}` : null;
export const backdrop = (path: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  path ? `${IMG}/${size}${path}` : null;

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}
