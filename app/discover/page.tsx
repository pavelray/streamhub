"use client";
import NSFWOverlay from "@/components/NSFWOverlay";
import { BASE_IMAGE_URL, MOVIE_GENRES, TV_GENRES } from "@/utils/constants";
import { Film, Filter, Loader2, Search, Star, Tv, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import slugify from "slugify";

const WATCH_PROVIDERS = [
  { id: 8, name: "Netflix", color: "bg-red-600" },
  { id: 9, name: "Prime Video", color: "bg-blue-500" },
  { id: 337, name: "Disney+", color: "bg-blue-700" },
  { id: 384, name: "HBO Max", color: "bg-purple-800" },
  { id: 15, name: "Hulu", color: "bg-green-500" },
  { id: 531, name: "Paramount+", color: "bg-blue-400" },
  { id: 350, name: "Apple TV+", color: "bg-gray-700" },
];

interface DiscoverResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
  overview: string;
  adult?: boolean;
}

function DiscoverCard({
  item,
  type,
}: {
  item: DiscoverResult;
  type: "movie" | "tv";
}) {
  const title = item.title || item.name || "Untitled";
  const slug = `${slugify(title, { remove: /[*+~.'"!:@]/g })}-${item.id}`;
  const href = type === "tv" ? `/tv/${slug}` : `/movie/${slug}`;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  return (
    <Link href={href} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
        <div className="relative aspect-[2/3] bg-white/5">
          <NSFWOverlay isAdult={item.adult}>
            {item.poster_path ? (
              <Image
                src={`${BASE_IMAGE_URL}/w300${item.poster_path}`}
                alt={title}
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {type === "tv" ? (
                  <Tv className="w-10 h-10 text-white/20" />
                ) : (
                  <Film className="w-10 h-10 text-white/20" />
                )}
              </div>
            )}
          </NSFWOverlay>
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-yellow-400 text-xs font-bold">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">
            {title}
          </p>
          {year && <p className="text-gray-400 text-xs mt-1">{year}</p>}
        </div>
      </div>
    </Link>
  );
}

interface Filters {
  type: "movie" | "tv";
  genre: string;
  sortBy: string;
  minRating: string;
  maxRuntime: string;
  provider: string;
  language: string;
  yearFrom: string;
  yearTo: string;
  minVotes: string;
}

const DEFAULT_FILTERS: Filters = {
  type: "movie",
  genre: "",
  sortBy: "popularity.desc",
  minRating: "",
  maxRuntime: "",
  provider: "",
  language: "",
  yearFrom: "",
  yearTo: "",
  minVotes: "",
};

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "revenue.desc", label: "Highest Revenue" },
  { value: "release_date.desc", label: "Newest First" },
  { value: "release_date.asc", label: "Oldest First" },
  { value: "vote_count.desc", label: "Most Voted" },
];

const LANGUAGES = [
  { code: "", label: "All Languages" },
  { code: "en", label: "English" },
  { code: "ko", label: "Korean" },
  { code: "ja", label: "Japanese" },
  { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
];

async function fetchDiscover(filters: Filters, page: number): Promise<{ results: DiscoverResult[]; total_pages: number }> {
  const params = new URLSearchParams({
    sort_by: filters.sortBy,
    page: String(page),
  });
  if (filters.genre) params.set("with_genres", filters.genre);
  if (filters.minRating) params.set("vote_average.gte", filters.minRating);
  if (filters.maxRuntime && filters.type === "movie") params.set("with_runtime.lte", filters.maxRuntime);
  if (filters.provider) {
    params.set("with_watch_providers", filters.provider);
    params.set("watch_region", "US");
  }
  if (filters.language) params.set("with_original_language", filters.language);
  if (filters.yearFrom) {
    params.set(filters.type === "movie" ? "release_date.gte" : "first_air_date.gte", `${filters.yearFrom}-01-01`);
  }
  if (filters.yearTo) {
    params.set(filters.type === "movie" ? "release_date.lte" : "first_air_date.lte", `${filters.yearTo}-12-31`);
  }
  if (filters.minVotes) params.set("vote_count.gte", filters.minVotes);

  const url = `/api/discover/${filters.type}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return { results: [], total_pages: 0 };
  return res.json();
}

function DiscoverInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const moodLabel = searchParams?.get("moodLabel") || null;
  const moodDesc = searchParams?.get("moodDesc") || null;

  const [filters, setFilters] = useState<Filters>({
    type: (searchParams?.get("type") as "movie" | "tv") || DEFAULT_FILTERS.type,
    genre: searchParams?.get("genre") || DEFAULT_FILTERS.genre,
    sortBy: searchParams?.get("sortBy") || DEFAULT_FILTERS.sortBy,
    minRating: searchParams?.get("minRating") || DEFAULT_FILTERS.minRating,
    maxRuntime: DEFAULT_FILTERS.maxRuntime,
    provider: DEFAULT_FILTERS.provider,
    language: DEFAULT_FILTERS.language,
    yearFrom: DEFAULT_FILTERS.yearFrom,
    yearTo: DEFAULT_FILTERS.yearTo,
    minVotes: DEFAULT_FILTERS.minVotes,
  });
  const [results, setResults] = useState<DiscoverResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const genres = filters.type === "movie" ? MOVIE_GENRES : TV_GENRES;

  const doSearch = useCallback(async (f: Filters, p: number, append = false) => {
    setLoading(true);
    try {
      const data = await fetchDiscover(f, p);
      setResults((prev) => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setResults([]);
    doSearch(filters, 1, false);
  }, [filters, doSearch]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, type: filters.type });
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    doSearch(filters, next, true);
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => !["type", "sortBy"].includes(k) && v !== ""
  ).length;

  return (
    <div className="min-h-screen mt-20 sm:mt-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-2">Discover</h1>
          <p className="text-gray-400">Find exactly what you want with powerful filters</p>
        </div>

        {/* Mood banner */}
        {moodLabel && (
          <div
            className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-6 border border-white/10"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <span className="text-2xl leading-none mt-0.5">✨</span>
            <div>
              <p className="font-semibold text-white text-sm">{moodLabel}</p>
              {moodDesc && (
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                  {moodDesc}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          {(["movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => updateFilter("type", t)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                filters.type === t
                  ? "text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
              style={filters.type === t ? { background: "var(--color-header-gradient)" } : {}}
            >
              {t === "movie" ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
              {t === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="glass-card rounded-2xl p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-white font-semibold"
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs text-white" style={{ background: "var(--color-header-gradient)" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={resetFilters} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm transition-colors">
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>

          {/* Always-visible quick filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <select
              value={filters.genre}
              onChange={(e) => updateFilter("genre", e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              <option value="">All Genres</option>
              {Object.entries(genres).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <select
              value={filters.language}
              onChange={(e) => updateFilter("language", e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/20 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Less filters" : "More filters"}
            </button>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Streaming Provider */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Streaming On</label>
                <div className="flex flex-wrap gap-2">
                  {WATCH_PROVIDERS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => updateFilter("provider", filters.provider === String(p.id) ? "" : String(p.id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-all ${
                        filters.provider === String(p.id)
                          ? `${p.color} ring-2 ring-white/50`
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                  Min Rating: {filters.minRating || "Any"}
                </label>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={filters.minRating || 0}
                  onChange={(e) => updateFilter("minRating", e.target.value === "0" ? "" : e.target.value)}
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span><span>9+</span>
                </div>
              </div>

              {/* Min Votes */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Min Vote Count</label>
                <select
                  value={filters.minVotes}
                  onChange={(e) => updateFilter("minVotes", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="">Any</option>
                  <option value="100">100+</option>
                  <option value="500">500+ (Popular)</option>
                  <option value="1000">1,000+</option>
                  <option value="5000">5,000+ (Well-known)</option>
                  <option value="10000">10,000+ (Mainstream)</option>
                </select>
              </div>

              {/* Year Range */}
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Release Year From</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="e.g. 2000"
                  value={filters.yearFrom}
                  onChange={(e) => updateFilter("yearFrom", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Release Year To</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 2}
                  placeholder={String(new Date().getFullYear())}
                  value={filters.yearTo}
                  onChange={(e) => updateFilter("yearTo", e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 placeholder-gray-500"
                />
              </div>

              {/* Runtime (movies only) */}
              {filters.type === "movie" && (
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">
                    Max Runtime: {filters.maxRuntime ? `${filters.maxRuntime} min` : "Any"}
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="300"
                    step="15"
                    value={filters.maxRuntime || 300}
                    onChange={(e) => updateFilter("maxRuntime", e.target.value === "300" ? "" : e.target.value)}
                    className="w-full accent-purple-400"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>60 min</span><span>300+ min</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        {results.length > 0 && (
          <p className="text-gray-400 text-sm mb-6">
            Showing {results.length} results
          </p>
        )}

        {/* Results Grid */}
        {loading && results.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : results.length === 0 && !loading ? (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl">No results match your filters</p>
            <button onClick={resetFilters} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => (
              <DiscoverCard key={item.id} item={item} type={filters.type} />
            ))}
          </div>
        )}

        {/* Load More */}
        {page < totalPages && !loading && results.length > 0 && (
          <div className="flex justify-center mt-12 pb-12">
            <button
              onClick={loadMore}
              className="px-10 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
              style={{ background: "var(--color-header-gradient)" }}
            >
              Load More
            </button>
          </div>
        )}
        {loading && results.length > 0 && (
          <div className="flex justify-center mt-8 pb-8">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen mt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    }>
      <DiscoverInner />
    </Suspense>
  );
}
