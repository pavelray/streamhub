"use client";
import { useWatchlistStore } from "@/utils/watchlistStore";
import { BASE_IMAGE_URL } from "@/utils/constants";
import { Bookmark, Film, Trash2, Tv, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";

export default function WatchlistPage() {
  const { items, remove, clear } = useWatchlistStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen mt-20 sm:mt-24 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <Bookmark className="w-20 h-20 text-white/20 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-3">Your Watchlist is Empty</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Start saving movies and TV shows to watch later. Look for the Watchlist button on any title page.
        </p>
        <div className="flex gap-4">
          <Link
            href="/discover"
            className="px-6 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
            style={{ background: "var(--color-header-gradient)" }}
          >
            Discover Content
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            Browse Trending
          </Link>
        </div>
      </div>
    );
  }

  const movies = items.filter((i) => i.mediaType === "movie");
  const tvShows = items.filter((i) => i.mediaType === "tv");

  return (
    <div className="min-h-screen mt-20 sm:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-2">My Watchlist</h1>
            <p className="text-gray-400">{items.length} {items.length === 1 ? "title" : "titles"} saved</p>
          </div>
          <button
            onClick={() => confirm("Clear your entire watchlist?") && clear()}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {movies.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Film className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Movies</h2>
              <span className="text-gray-400 text-sm">({movies.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((item) => (
                <WatchlistCard key={item.id} item={item} onRemove={() => remove(item.id)} />
              ))}
            </div>
          </section>
        )}

        {tvShows.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Tv className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">TV Shows</h2>
              <span className="text-gray-400 text-sm">({tvShows.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tvShows.map((item) => (
                <WatchlistCard key={item.id} item={item} onRemove={() => remove(item.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function WatchlistCard({
  item,
  onRemove,
}: {
  item: { id: number; title: string; posterPath: string; mediaType: "movie" | "tv" };
  onRemove: () => void;
}) {
  const slug = `${slugify(item.title, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  const href = item.mediaType === "tv" ? `/tv/${slug}` : `/movie/${slug}`;

  return (
    <div className="group relative">
      <Link href={href} className="block">
        <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
          <div className="relative aspect-[2/3] bg-white/5">
            <Image
              src={item.posterPath}
              alt={item.title}
              fill
              className="object-cover"
              sizes="200px"
            />
          </div>
          <div className="p-3">
            <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">
              {item.title}
            </p>
            <p className="text-gray-400 text-xs capitalize mt-1">{item.mediaType}</p>
          </div>
        </div>
      </Link>
      {/* Remove button */}
      <button
        onClick={(e) => { e.preventDefault(); onRemove(); }}
        className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50"
        aria-label="Remove from watchlist"
      >
        <X className="w-3.5 h-3.5 text-white" />
      </button>
    </div>
  );
}
