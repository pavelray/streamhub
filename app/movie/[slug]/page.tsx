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
  Calendar,
  Clock,
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
    <div className="min-h-screen mt-24">
      <section
        className="movie-hero min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right,rgba(0, 0, 0, 0.8),rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.8)),url(${movie.backdropPath})`,
        }}
      >
        <div className="container mx-auto">
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
                  -<span className="text-gray-300">{movie.status}</span>
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
                <MediaPlayButton
                  media={{ id: movie.id, name: movie.originalTitle }}
                />
                {movie?.videos && <TrailerButton videos={movie.videos} />}
              </div>

              {/* Cast & Crew Preview */}
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl w-full max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-xl font-bold">Cast & Crew</h2>
                </div>

                <div className="flex gap-6">
                  {movie.cast?.slice(0, 5).map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center w-20 cursor-pointer"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg hover:border-purple-300 transition-all hover:scale-110">
                        {member.profilePath ? (
                          <img
                            src={member.profilePath}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full object-cover from-purple-500/40 to-blue-500/40">
                            <User className="w-full h-full object-cover text-white/60" />
                          </div>
                        )}
                      </div>
                      <p
                        className="text-white text-xs font-medium mt-2 text-center truncate w-full"
                        title={member.name}
                      >
                        {member.name}
                      </p>
                      <p
                        className="text-gray-300 text-xs text-center truncate w-full"
                        title={member.character}
                      >
                        {member.character}
                      </p>
                    </div>
                  ))}
                  <Link
                    href={`/movie/${slug}/crew`}
                    className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all hover:scale-110 shadow-lg border-2 border-purple-300"
                  >
                    <span className="text-white text-sm font-bold">View</span>
                    <span className="text-white text-sm font-bold">All</span>
                  </Link>
                </div>
              </div>
            </div>
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
