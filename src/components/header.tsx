import { Link } from "@tanstack/react-router";
import { Film, Bookmark, Search, Compass } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Film className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            CineTrack
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4">
          <NavLink to="/" icon={<Compass className="h-4 w-4" />} label="Découvrir" />
          <NavLink to="/search" icon={<Search className="h-4 w-4" />} label="Rechercher" />
          <NavLink to="/watchlist" icon={<Bookmark className="h-4 w-4" />} label="Watchlist" />
        </nav>
      </div>
    </header>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      activeProps={{ className: "text-foreground bg-accent" }}
      activeOptions={{ exact: to === "/" }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
