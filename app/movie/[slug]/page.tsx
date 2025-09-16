import { TMDB_API_URL } from "@/utils/constants";

export interface MovieDetails {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  tagline?: string;
  status: string;
  posterPath: string;
  backdropPath?: string;
  genres: { id: number; name: string }[];
  releaseDate: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  homepage?: string;
  productionCompanies: {
    id: number;
    name: string;
    logoPath?: string;
    originCountry: string;
  }[];
  cast?: {
    id: number;
    name: string;
    character: string;
    profilePath?: string;
  }[];
  videos?: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
}
const append_to_response =
  "videos,images,credits,recommendations,similar,watch_providers";
const getMovieDetailsData = async (
  movieId: string
): Promise<MovieDetails | null> => {
  try {
    const movieRes = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=${append_to_response}`,
      { next: { revalidate: 86400 } } // Revalidate every 24 hours
    );

    if (!movieRes.ok) {
      console.error("Failed to fetch movie details");
      return null;
    }

    const movieData = await movieRes.json();

    const movieDetails: MovieDetails = {
      id: movieData.id,
      title: movieData.title,
      originalTitle: movieData.original_title,
      overview: movieData.overview,
      tagline: movieData.tagline,
      status: movieData.status,
      posterPath: movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : "/placeholder_poster.png",
      backdropPath: movieData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
        : undefined,
      genres: movieData.genres,
      releaseDate: movieData.release_date,
      runtime: movieData.runtime,
      voteAverage: movieData.vote_average,
      voteCount: movieData.vote_count,
      popularity: movieData.popularity,
      homepage: movieData.homepage,
      productionCompanies: movieData.production_companies,
      cast: movieData.credits?.cast.map((actor: any) => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : undefined,
      })),
      videos: movieData.videos?.results.map((video: any) => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
      })),
    };

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
  console.log("Movie Details:", movie);
  if (!movie) {
    return <div className="text-center text-white mt-20">Movie not found</div>;
  }
  return (
    <main className="theme-gradient min-h-screen px-4 py-10">
      {/* Banner & Poster */}
      <section className="flex flex-col md:flex-row items-center gap-8">
        <div className="glass-effect rounded-2xl shadow-lg overflow-hidden w-56 min-h-[336px] flex-shrink-0">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">{movie.title}</h1>
          {movie.tagline && (
            <div className="text-xl italic mb-3 text-pink-300">
              {movie.tagline}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="genre-chip">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="flex gap-8 text-secondary font-semibold mb-4">
            <span>Release: {movie.releaseDate}</span>
            <span>Runtime: {movie.runtime} min</span>
            <span>Rating: {movie.voteAverage} / 10</span>
          </div>
          <a
            href={movie.homepage}
            target="_blank"
            rel="noopener"
            className="theme-switch px-4 py-2 rounded-lg"
          >
            Official Website
          </a>
        </div>
      </section>

      {/* Overview Section */}
      <section className="glass-effect p-6 mt-8 rounded-xl max-w-2xl mx-auto text-lg text-secondary">
        {movie.overview}
      </section>

      {/* Cast Grid */}
      {movie.cast && (
        <section className="mt-10">
          <h2 className="text-2xl mb-6 text-white font-bold">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {movie.cast.slice(0, 10).map((actor) => (
              <div
                key={actor.id}
                className="glass-effect rounded-xl p-3 flex flex-col items-center"
              >
                {actor.profilePath && (
                  <img
                    src={actor.profilePath}
                    alt={actor.name}
                    className="w-20 h-20 rounded-full mb-2 object-cover"
                  />
                )}
                <span className="font-semibold text-white">{actor.name}</span>
                <span className="text-secondary text-sm">
                  {actor.character}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Previews */}
      {movie.videos && movie.videos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl mb-6 text-white font-bold">Videos</h2>
          <div className="flex overflow-x-auto gap-4">
            {movie.videos.map((video) => (
              <div
                key={video.key}
                className="glass-effect rounded-xl p-4 min-w-[320px]"
              >
                <iframe
                  width="280"
                  height="160"
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="font-semibold mt-2 text-white">
                  {video.name}
                </div>
                <div className="text-secondary text-sm">{video.type}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MovieDetailsPage;

// Genre Chip Example Styles (matches global theming)
/*
.genre-chip {
  background: linear-gradient(to right, var(--color-movie-gradient));
  color: var(--color-white);
  border-radius: 20px;
  padding: 4px 12px;
  margin: 2px;
  font-size: 0.95em;
}
*/
// Glass effect, theme-gradient, theme-switch CSS all come from globals.css[files:3]

/* Extract any section (cast, videos, overview, banner) into its own component for easy reuse/update */
