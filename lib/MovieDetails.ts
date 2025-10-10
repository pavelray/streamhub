export enum VIDEO_TYPE {
  Featurette = "Featurette",
  Teaser = "Teaser",
  Clip = "Clip",
  BTS = "Behind the Scenes",
  Trailer = "Trailer",
}

export enum DEPARTMENT_TYPE {
  Directing = "Directing",
  Writing = "Writing",
  ACTING = "Acting",
}

export type VideoType = VIDEO_TYPE;

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
    adult: boolean;
    id: number;
    name: string;
    character: string;
    profilePath?: string;
  }[];
  crew: {
    adult: boolean;
    gender: number;
    id: number;
    knownForDepartment?: string;
    name: string;
    originalName?: string;
    popularity: number;
    profilePath?: string;
    creditId: string;
    department?: string;
    job?: string;
  };
  videos?: {
    key: string;
    name: string;
    site: string;
    type: VideoType;
  }[];
}
