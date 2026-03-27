import {
  CastMember,
  CrewMember,
  Gender,
  MovieDetails,
} from "@/lib/MovieDetails";
import { TVDetails, WatchProvider, WatchProviderRegion } from "@/lib/TVDetails";
import { BASE_IMAGE_URL } from "./constants";

export const movieDataTransformer = (movieData: any) => {
  const movieDetails: MovieDetails = {
    id: movieData.id,
    title: movieData.title,
    originalTitle: movieData.original_title,
    overview: movieData.overview,
    tagline: movieData.tagline,
    status: movieData.status,
    posterPath: movieData.poster_path
      ? `${BASE_IMAGE_URL}/w500${movieData.poster_path}`
      : "/placeholder_poster.png",
    backdropPath: movieData.backdrop_path
      ? `${BASE_IMAGE_URL}/original${movieData.backdrop_path}`
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
        ? `${BASE_IMAGE_URL}/w200${actor.profile_path}`
        : undefined,
    })),
    crew: movieData.credits?.crew.map((member: any) => ({
      id: member.id,
      name: member.name,
      job: member.job,
      department: member.department,
      profilePath: member.profile_path
        ? `${BASE_IMAGE_URL}/w200${member.profile_path}`
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
    recommendations: movieData.recommendations?.results || [],
    similar: movieData.similar?.results || [],
    watchProviders: parseWatchProviders(movieData["watch/providers"]),
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
          ? `${BASE_IMAGE_URL}/w200${actor.profile_path}`
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
          ? `${BASE_IMAGE_URL}/w200${member.profile_path}`
          : null,
        creditId: member.credit_id,
        department: member.department,
        job: member.job,
      })
    ),
  };

  return transformed;
};

const parseWatchProviders = (rawProviders: any): WatchProviderRegion | undefined => {
  if (!rawProviders?.results) return undefined;
  // Prefer US, fallback to first available region
  const region = rawProviders.results["US"] || Object.values(rawProviders.results)[0] as any;
  if (!region) return undefined;

  const mapProvider = (p: any): WatchProvider => ({
    logoPath: `${BASE_IMAGE_URL}/w92${p.logo_path}`,
    providerId: p.provider_id,
    providerName: p.provider_name,
    displayPriority: p.display_priority,
  });

  return {
    flatrate: region.flatrate?.map(mapProvider),
    rent: region.rent?.map(mapProvider),
    buy: region.buy?.map(mapProvider),
    link: region.link,
  };
};

export const tvDataTransformer = (tvData: any): TVDetails => {
  return {
    id: tvData.id,
    name: tvData.name,
    originalName: tvData.original_name,
    overview: tvData.overview,
    tagline: tvData.tagline,
    status: tvData.status,
    posterPath: tvData.poster_path
      ? `${BASE_IMAGE_URL}/w500${tvData.poster_path}`
      : "/placeholder_poster.png",
    backdropPath: tvData.backdrop_path
      ? `${BASE_IMAGE_URL}/original${tvData.backdrop_path}`
      : undefined,
    genres: tvData.genres || [],
    firstAirDate: tvData.first_air_date,
    lastAirDate: tvData.last_air_date,
    numberOfSeasons: tvData.number_of_seasons,
    numberOfEpisodes: tvData.number_of_episodes,
    episodeRunTime: tvData.episode_run_time || [],
    voteAverage: tvData.vote_average,
    voteCount: tvData.vote_count,
    popularity: tvData.popularity,
    homepage: tvData.homepage,
    inProduction: tvData.in_production,
    networks: (tvData.networks || []).map((n: any) => ({
      id: n.id,
      name: n.name,
      logoPath: n.logo_path ? `${BASE_IMAGE_URL}/w92${n.logo_path}` : null,
      originCountry: n.origin_country,
    })),
    seasons: (tvData.seasons || [])
      .filter((s: any) => s.season_number > 0)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        overview: s.overview,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count,
        airDate: s.air_date,
        posterPath: s.poster_path ? `${BASE_IMAGE_URL}/w300${s.poster_path}` : null,
        voteAverage: s.vote_average,
      })),
    cast: tvData.aggregate_credits?.cast
      ?.slice(0, 30)
      .map((a: any) => ({
        id: a.id,
        name: a.name,
        character: a.roles?.[0]?.character || "",
        profilePath: a.profile_path ? `${BASE_IMAGE_URL}/w200${a.profile_path}` : null,
        popularity: a.popularity,
      })),
    crew: tvData.aggregate_credits?.crew
      ?.filter((c: any) => ["Directing", "Writing", "Production"].includes(c.department))
      .slice(0, 20)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        job: c.jobs?.[0]?.job || c.known_for_department,
        department: c.department,
        profilePath: c.profile_path ? `${BASE_IMAGE_URL}/w200${c.profile_path}` : null,
      })),
    videos: tvData.videos?.results
      ?.filter((v: any) => v.type === "Trailer" || v.type === "Teaser")
      .map((v: any) => ({
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
      })),
    recommendations: tvData.recommendations?.results || [],
    similar: tvData.similar?.results || [],
    watchProviders: parseWatchProviders(tvData["watch/providers"]),
  };
};
