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

export enum Gender {
  Unknown = 0,
  Female = 1,
  Male = 2,
}

export type VideoType = VIDEO_TYPE;

export interface CastMember {
  adult: boolean;
  gender: Gender;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  castId: number;
  character: string;
  creditId: string;
  order: number;
}
export interface CrewMember {
  adult: boolean;
  gender: Gender;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath: string | null;
  creditId: string;
  department: string;
  job: string;
}
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
  cast?: CastMember[];
  crew?: CrewMember[];
  videos?: {
    key: string;
    name: string;
    site: string;
    type: VideoType;
  }[];
}
