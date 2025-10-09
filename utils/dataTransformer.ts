import { MovieDetails } from "@/lib/MovieDetails";

export const movieDataTransformer = (movieData: any) => {
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
    videos: movieData.videos?.results
      .filter((video: any) => video.type === "Trailer")
      .map((video: any) => ({
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
      })),
  };
  return movieDetails;
};
