import {
  Play,
  Info,
  Calendar,
  Star,
  TrendingUp,
  Film,
  Tag,
} from "lucide-react";
import { TrendingMovie, TrendingTV } from "@/lib/Trending";
import { MOVIE_GENRES, TV_GENRES } from "@/utils/constants";
import Link from "next/link";

const LandingHeader = ({
  item,
}: {
  item: TrendingMovie | TrendingTV | null;
}) => {
  if (!item) return null;

  const getReleaseYear = () => {
    if (item.media_type === "movie") {
      return new Date(item.release_date).getFullYear();
    } else {
      return new Date(item.first_air_date).getFullYear();
    }
  };

  const getTitle = () => {
    return item.media_type === "movie" ? item.title : item.name;
  };

  const getReleaseDate = () => {
    return item.media_type === "movie"
      ? item.release_date
      : item.first_air_date;
  };

  const getGenres = () => {
    const genreMap = item.media_type === "movie" ? MOVIE_GENRES : TV_GENRES;
    return item.genre_ids
      .slice(0, 2) // Get first 2 genres
      .map((id) => genreMap[id])
      .filter(Boolean); // Remove any undefined genres
  };

  return (
    <section
      className="relative flex items-center justify-center min-h-[600px] md:h-[700px] w-full bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url('https://image.tmdb.org/t/p/w1280/${item.backdrop_path}')`,
      }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div className="theme-overlay opacity-40"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-left px-6 py-8 text-white">
        {/* Media Type Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <Film className="w-4 h-4" />
          <span className="text-sm font-medium capitalize">
            {item.media_type === "movie" ? "Movie" : "TV Series"}
          </span>
        </div>

        {/* Movie/TV Title with Gradient */}
        <h1
          className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          style={{
            background: "var(--color-header-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))",
          }}
        >
          {getTitle()}
        </h1>

        {/* Overview */}
        <p className="mb-8 text-lg md:text-xl font-light leading-relaxed line-clamp-3 max-w-3xl text-gray-100">
          {item.overview || "No description available."}
        </p>

        {/* Enhanced Buttons with Gradients */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            className="cursor-pointer group px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            style={{
              background: "var(--color-header-gradient)",
            }}
          >
            <span className="flex items-center justify-center gap-2 text-[var(--color-white)]">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Now
            </span>
          </button>

          <button className="cursor-pointer group inline-flex items-center gap-3 px-8 py-4 font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Info className="w-5 h-5" />
            <Link href={`/${item.media_type}/${item.id}`}>
              <span>More Info</span>
            </Link>
          </button>
        </div>

        {/* Enhanced Stats with Icons */}
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-bold">{getReleaseYear()}</span>
            <span className="text-gray-300">Release</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-yellow-400 font-bold">
              {item.vote_average.toFixed(1)}
            </span>
            <span className="text-gray-300">Rating</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 font-bold">
              {Math.round(item.popularity)}
            </span>
            <span className="text-gray-300">Popularity</span>
          </div>

          <div className="flex items-center gap-3">
            {getGenres().map((genre, index) => (
              <div
                key={index}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  index === 0
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 text-purple-200"
                    : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-200"
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>{genre}</span>
              </div>
            ))}
            {getGenres().length === 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500/20 backdrop-blur-sm rounded-full border border-gray-400/50 text-gray-300 text-sm font-semibold">
                <Tag className="w-4 h-4" />
                <span>N/A</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional info for TV shows */}
        {item.media_type === "tv" && (
          <div className="mt-4 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
              Original: {item.original_name}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingHeader;
