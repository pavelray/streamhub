import { TrendingItem } from "./Trending";

export interface TVSeason {
  id: number;
  name: string;
  overview: string;
  seasonNumber: number;
  episodeCount: number;
  airDate: string;
  posterPath: string | null;
  voteAverage: number;
}

export interface TVNetwork {
  id: number;
  name: string;
  logoPath: string | null;
  originCountry: string;
}

export interface TVDetails {
  id: number;
  name: string;
  originalName: string;
  overview: string;
  tagline?: string;
  status: string;
  posterPath: string;
  backdropPath?: string;
  genres: { id: number; name: string }[];
  firstAirDate: string;
  lastAirDate?: string;
  numberOfSeasons: number;
  numberOfEpisodes: number;
  episodeRunTime: number[];
  voteAverage: number;
  voteCount: number;
  popularity: number;
  homepage?: string;
  inProduction: boolean;
  networks: TVNetwork[];
  seasons: TVSeason[];
  cast?: {
    id: number;
    name: string;
    character: string;
    profilePath: string | null;
    popularity: number;
  }[];
  crew?: {
    id: number;
    name: string;
    job: string;
    department: string;
    profilePath: string | null;
  }[];
  videos?: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
  recommendations: TrendingItem[];
  similar: TrendingItem[];
  watchProviders?: WatchProviderRegion;
}

export interface WatchProvider {
  logoPath: string;
  providerId: number;
  providerName: string;
  displayPriority: number;
}

export interface WatchProviderRegion {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  link?: string;
}
