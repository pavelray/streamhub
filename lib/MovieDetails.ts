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