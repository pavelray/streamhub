import { TMDB_API_URL, BASE_IMAGE_URL, MOVIE_GENRES, TV_GENRES, APP_NAME, SEO_TAGS } from "@/utils/constants";
import { Film, Search, Star, Tv, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  if (!q) {
    return {
      title: SEO_TAGS.SEARCH.TITLE,
      description: SEO_TAGS.SEARCH.DESCRIPTION,
    };
  }
  return {
    title: `Search: ${q}`,
    description: `Search results for "${q}" – movies, TV series, and people on ${APP_NAME}.`,
    robots: { index: false, follow: false },
  };
}

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  profile_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  known_for_department?: string;
  known_for?: { title?: string; name?: string }[];
}

const searchTMDB = async (query: string, page = 1): Promise<{ results: SearchResult[]; total_results: number; total_pages: number }> => {
  if (!query) return { results: [], total_results: 0, total_pages: 0 };
  const res = await fetch(
    `${TMDB_API_URL}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return { results: [], total_results: 0, total_pages: 0 };
  return res.json();
};

const getResultPath = (item: SearchResult) => {
  const title = item.title || item.name || "untitled";
  const slug = `${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  if (item.media_type === "tv") return `/tv/${slug}`;
  if (item.media_type === "person") return `/person/${slug}`;
  return `/movie/${slug}`;
};

const getGenreNames = (ids: number[] = [], type: "movie" | "tv") => {
  const map = type === "tv" ? TV_GENRES : MOVIE_GENRES;
  return ids.slice(0, 2).map((id) => map[id]).filter(Boolean);
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page));
  const { results, total_results, total_pages } = await searchTMDB(q, currentPage);

  const movies = results.filter((r) => r.media_type === "movie");
  const tvShows = results.filter((r) => r.media_type === "tv");
  const people = results.filter((r) => r.media_type === "person");

  return (
    <div className="min-h-screen mt-24 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Search Header */}
        <div className="mb-10">
          <h1 className="section-title text-4xl lg:text-5xl mb-4">
            {q ? `Results for "${q}"` : "Search"}
          </h1>
          {q && (
            <p className="text-gray-400">
              {total_results.toLocaleString()} results found
            </p>
          )}
        </div>

        {/* Search Bar */}
        <form method="GET" action="/search" className="mb-12">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search movies, TV shows, actors..."
              autoFocus
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-4 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-white font-semibold transition-all"
              style={{ background: "var(--color-header-gradient)" }}
            >
              Search
            </button>
          </div>
        </form>

        {!q && (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">Start typing to search movies, TV shows and people</p>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">No results for &quot;{q}&quot;</p>
            <p className="text-sm mt-2">Try different keywords or check the spelling</p>
          </div>
        )}

        {/* Movies */}
        {movies.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Film className="w-6 h-6 text-pink-400" />
              <h2 className="text-2xl font-bold text-white">Movies</h2>
              <span className="text-gray-400 text-sm">({movies.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((item) => (
                <SearchCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* TV Shows */}
        {tvShows.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Tv className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">TV Shows</h2>
              <span className="text-gray-400 text-sm">({tvShows.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {tvShows.map((item) => (
                <SearchCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* People */}
        {people.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">People</h2>
              <span className="text-gray-400 text-sm">({people.length})</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {people.map((item) => (
                <PersonCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Pagination */}
        {total_pages > 1 && (
          <div className="flex justify-center gap-4 py-12">
            {currentPage > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}&page=${currentPage - 1}`}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              >
                Previous
              </Link>
            )}
            <span className="px-6 py-3 rounded-full bg-white/10 text-white border border-white/20">
              {currentPage} / {Math.min(total_pages, 10)}
            </span>
            {currentPage < Math.min(total_pages, 10) && (
              <Link
                href={`/search?q=${encodeURIComponent(q)}&page=${currentPage + 1}`}
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchCard({ item }: { item: SearchResult }) {
  const title = item.title || item.name || "Untitled";
  const slug = `${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  const href = item.media_type === "tv" ? `/tv/${slug}` : `/movie/${slug}`;
  const imageUrl = item.poster_path
    ? `${BASE_IMAGE_URL}/w300${item.poster_path}`
    : null;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  return (
    <Link href={href} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
        <div className="relative aspect-[2/3] bg-white/5">
          {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover" sizes="200px" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {item.media_type === "tv" ? (
                <Tv className="w-10 h-10 text-white/20" />
              ) : (
                <Film className="w-10 h-10 text-white/20" />
              )}
            </div>
          )}
          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-yellow-400 text-xs font-bold">{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">{title}</p>
          {year && <p className="text-gray-400 text-xs mt-1">{year}</p>}
        </div>
      </div>
    </Link>
  );
}

function PersonCard({ item }: { item: SearchResult }) {
  const name = item.name || "Unknown";
  const slug = `${slugify(name, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  const imageUrl = item.profile_path
    ? `${BASE_IMAGE_URL}/w185${item.profile_path}`
    : null;

  return (
    <Link href={`/person/${slug}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 p-4 text-center">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-purple-400 mb-3">
          {imageUrl ? (
            <Image src={imageUrl} alt={name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center">
              <User className="w-8 h-8 text-white/50" />
            </div>
          )}
        </div>
        <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300">{name}</p>
        {item.known_for_department && (
          <p className="text-gray-400 text-xs mt-1">{item.known_for_department}</p>
        )}
        {item.known_for && item.known_for.length > 0 && (
          <p className="text-gray-500 text-xs mt-1 truncate">
            {item.known_for.slice(0, 2).map((k) => k.title || k.name).join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
