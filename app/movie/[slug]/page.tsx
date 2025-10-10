import MediaPlayButton from "@/components/MediaPlayButton";
import TrailerButton from "@/components/TrailerButton";
import TrendingCarousel from "@/components/TrendingCarousel";
import VideoCard from "@/components/VideoCard";
import { MovieDetails } from "@/lib/MovieDetails";
import { TrendingItem } from "@/lib/Trending";
import { TMDB_API_URL } from "@/utils/constants";
import { movieDataTransformer } from "@/utils/dataTransformer";
import { convertMinutesToReadable } from "@/utils/helperMethods";
import {
  ArrowRight,
  Calendar,
  Clock,
  Play,
  Star,
  Tag,
  TrendingUp,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const append_to_response =
  "videos,images,credits,recommendations,similar,watch_providers";

const getMovieDetailsData = async (
  movieId: string
): Promise<MovieDetails | null> => {
  try {
    const url = `${TMDB_API_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=${append_to_response}`;
    const movieRes = await fetch(
      url,
      { next: { revalidate: 86400 } } // Revalidate every 24 hours
    );
    if (!movieRes.ok) {
      console.error("Failed to fetch movie details");
      return null;
    }

    const movieData = await movieRes.json();
    const movieDetails = movieDataTransformer(movieData);
    return movieDetails;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

const MovieDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const movie = await getMovieDetailsData(slug);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (!movie) {
    return <div className="text-center text-white mt-20">Movie not found</div>;
  }
  return (
    <div className="min-h-screen">
      <section
        className="movie-hero min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right,rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.8)),url(${movie.backdropPath})`,
        }}
      >
        <div className="container mx-auto px-6 lg:px-8 mt-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Movie Poster */}
            <div className="lg:w-1/3 fade-in-up">
              <div className="glass-effect rounded-2xl p-4">
                <Image
                  src={movie.posterPath}
                  alt={`${movie.title} Poster`}
                  width={600}
                  height={900}
                  className="w-full rounded-xl shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Movie Details */}
            <div className="lg:w-2/3 fade-in-up">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              <h4 className="text-lg font-bold text-gray-300 mb-4 italic">
                {movie.tagline}
              </h4>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                {movie.overview}
              </p>
              <div className="flex flex-wrap gap-6 text-sm font-medium mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">
                    {formatDate(movie.releaseDate)}
                  </span>
                  -
                  <span className="text-gray-300">{movie.status}</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Star
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                  />
                  <span className="text-yellow-400 font-bold">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                  <span className="text-gray-300">Rating</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <TrendingUp className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 font-bold">
                    {Math.floor(movie.popularity)}
                  </span>
                  <span className="text-gray-300">Popularity</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Clock className="inline-block w-6 h-6" />{" "}
                  <span className="text-pink-400 font-bold">
                    {convertMinutesToReadable(movie.runtime)}
                  </span>
                  <span className="text-gray-300">Runtime</span>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-8 gap-2 flex flex-wrap">
                {movie.genres.map((genre, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      index === 0
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 text-purple-200"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-200"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>{genre.name}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* <Link href={`/movie/${movie.id}/watch`}>
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
                </Link> */}
                <MediaPlayButton
                  media={{ id: movie.id, name: movie.originalTitle }}
                />
                {movie?.videos && <TrailerButton videos={movie.videos} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="section-title text-4xl lg:text-5xl">Cast & Crew</h2>
            <Link href={`/movie/${slug}/crew`}>
              <button
                className="flex items-center gap-2 backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                aria-label="View all cast members"
              >
                <span className="hidden sm:inline">View All</span>
                <span className="sm:hidden">All</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {movie.cast?.slice(0, 5).map((member, index) => (
              <div
                key={member.id}
                className="group relative flex-shrink-0 w-40 md:w-48"
              >
                {/* Card container */}
                <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 overflow-hidden cursor-pointer">
                  {/* Decorative gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                  {/* Image container */}
                  <div className="relative w-full h-48 md:h-56 overflow-hidden">
                    {/* Image or fallback */}
                    {member.profilePath ? (
                      <img
                        src={member.profilePath}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-500/40 to-blue-500/40">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-white/60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    {/* Popularity badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-500/95 to-blue-500/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg z-20">
                      <TrendingUp className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="text-white font-bold text-xs whitespace-nowrap">
                        {member.popularity.toFixed(1)}
                      </span>
                    </div>

                    {/* Glass reflection effect */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
                  </div>
                  <div className="relative z-10 p-3 md:p-4">
                    <h2
                      className="text-sm md:text-base font-bold text-white mb-1 leading-tight truncate"
                      title={member.name}
                    >
                      {member.name}
                    </h2>
                    <p
                      className="text-purple-200 font-medium text-xs md:text-sm leading-tight line-clamp-2"
                      title={member.character}
                    >
                      as {member.character}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section className="py-16 px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="section-title text-4xl lg:text-5xl mb-12">
            Videos & Trailers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movie?.videos?.map((video) => (
              <VideoCard key={video.key} video={video} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      {movie.recommendations && !!movie.recommendations.length && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-4xl lg:text-5xl mb-6">
              Recommended For You
            </h2>
            <TrendingCarousel
              trendingItems={movie.recommendations as TrendingItem[]}
            />
          </div>
        </section>
      )}
      {movie.similar && !!movie.similar.length && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-4xl lg:text-5xl mb-6">
              More Like This
            </h2>
            <TrendingCarousel trendingItems={movie.similar as TrendingItem[]} />
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetailsPage;
