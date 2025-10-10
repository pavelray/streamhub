import {
  CastMember,
  CrewMember,
  Gender,
  MovieDetails,
} from "@/lib/MovieDetails";

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
      popularity: actor.popularity,
      adult: actor.adult,
      profilePath: actor.profile_path
        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
        : undefined,
    })),
    crew: movieData.credits?.crew.map((member: any) => ({
      id: member.id,
      name: member.name,
      job: member.job,
      department: member.department,
      profilePath: member.profile_path
        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
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
    recommendations: movieData.recommendations.results,
    similar: movieData.similar.results,
  };
  return movieDetails;
};

export const castAndCrewDataTransformer = (creditsData: any) => {
  const transformed = {
    id: creditsData.id,
    cast: (creditsData.cast || []).map(
      (actor: any): CastMember => ({
        adult: actor.adult,
        gender: actor.gender as Gender,
        id: actor.id,
        knownForDepartment: actor.known_for_department,
        name: actor.name,
        originalName: actor.original_name,
        popularity: actor.popularity,
        profilePath: actor.profile_path
          ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
          : null,
        castId: actor.cast_id,
        character: actor.character,
        creditId: actor.credit_id,
        order: actor.order,
      })
    ),
    crew: (creditsData.crew || []).map(
      (member: any): CrewMember => ({
        adult: member.adult,
        gender: member.gender as Gender,
        id: member.id,
        knownForDepartment: member.known_for_department,
        name: member.name,
        originalName: member.original_name,
        popularity: member.popularity,
        profilePath: member.profile_path
          ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
          : null,
        creditId: member.credit_id,
        department: member.department,
        job: member.job,
      })
    ),
  };

  return transformed;
};
