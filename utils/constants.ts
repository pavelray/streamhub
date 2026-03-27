export enum TIME_FRAME {
  DAY = "day",
  WEEK = "week",
}

export const TMDB_API_URL = "https://api.themoviedb.org/3";

export const MOVIE_GENRES: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const TV_GENRES: { [key: number]: string } = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

export const BASE_IMAGE_URL = "https://image.tmdb.org/t/p";

export const FALLBACK_VIDEO_THUMBNAIL =
  "https://via.placeholder.com/480x360?text=No+Thumbnail";

export const APP_NAME = "StreamHub";
export const SITE_URL = "https://streamhub.pavelray.in";
export const SITE_OG_IMAGE = `${SITE_URL}/images/og-image.png`;

export const SEO_TAGS = {
  DEFAULT: {
    TITLE: "StreamHub – Watch Trending Movies & TV Series",
    DESCRIPTION:
      "Discover and explore trending movies, TV series, and people. Find trailers, cast details, streaming providers, and more on StreamHub.",
    KEYWORDS:
      "watch movies online, trending movies, tv series, streaming, trailers, cast, streamhub",
  },
  MOVIE: {
    TITLE: `Movies | ${APP_NAME}`,
    DESCRIPTION:
      "Browse trending, popular, and upcoming movies. Find trailers, cast details, and streaming providers.",
    KEYWORDS:
      "movies, trending movies, popular movies, upcoming movies, movie trailers, streamhub",
  },
  TV: {
    TITLE: `TV Series | ${APP_NAME}`,
    DESCRIPTION:
      "Browse trending, popular, and on-air TV series. Find trailers, cast details, and streaming providers.",
    KEYWORDS:
      "tv series, trending tv shows, popular tv shows, on air tv, upcoming tv series, streamhub",
  },
  SEARCH: {
    TITLE: `Search | ${APP_NAME}`,
    DESCRIPTION:
      "Search for your favorite movies, TV series, and people on StreamHub.",
    KEYWORDS: "search movies, search tv series, search cast, streamhub",
  },
  DISCOVER: {
    TITLE: `Discover | ${APP_NAME}`,
    DESCRIPTION:
      "Discover movies and TV series by genre, mood, and more on StreamHub.",
    KEYWORDS:
      "discover movies, discover tv series, genre, mood search, streamhub",
  },
  WATCHLIST: {
    TITLE: `My Watchlist | ${APP_NAME}`,
    DESCRIPTION: "Your personal watchlist on StreamHub.",
    KEYWORDS: "watchlist, my movies, my tv shows, streamhub",
  },
};
