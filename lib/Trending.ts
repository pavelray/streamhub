type MediaType = "movie" | "tv" | "person";

interface BaseTrendingItem {
  id: number;
  media_type: MediaType;
  popularity: number;
  adult?: boolean;
}

interface TrendingMovie extends BaseTrendingItem {
  media_type: "movie";
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  genre_ids: number[];
  release_date: string;
  vote_average: number;
  vote_count: number;
  video: boolean;
}

interface TrendingTV extends BaseTrendingItem {
  media_type: "tv";
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  genre_ids: number[];
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

interface KnownForItem {
  id: number;
  media_type: "movie" | "tv";
  title?: string;
  original_title?: string;
  name?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  genre_ids: number[];
  release_date?: string;
  first_air_date?: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
}

interface TrendingPerson extends BaseTrendingItem {
  media_type: "person";
  name: string;
  original_name: string;
  profile_path: string;
  gender: number;
  known_for_department: string;
  known_for: KnownForItem[];
}

type TrendingItem = TrendingMovie | TrendingTV | TrendingPerson;

export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

export type { TrendingItem, TrendingMovie, TrendingTV, TrendingPerson };