import { TMDB_API_URL, APP_NAME, SEO_TAGS } from "@/utils/constants";
import { Search, Film, Tv, User } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import slugify from "slugify";
import { SearchCard, PersonCard } from "./SearchCards";
import type { SearchResult } from "./SearchCards";

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
    <div className="min-h-screen mt-20 sm:mt-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Search Header */}
        <div className="mb-10">
          <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
            {q ? `Results for "${q}"` : "Search"}
          </h1>
          {q && (
            <p className="text-gray-400">
              {total_results.toLocaleString()} results found
            </p>
          )}
        </div>

        {/* Search Bar */}
        <form method="GET" action="/search" className="mb-8 sm:mb-12">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search movies, TV shows, actors..."
              autoFocus
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-full py-3 sm:py-4 pl-12 pr-24 sm:pr-28 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 focus:bg-white/15 transition-all duration-300 text-base sm:text-lg"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white font-semibold transition-all text-sm sm:text-base"
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
