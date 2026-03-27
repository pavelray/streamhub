import TrendingCarousel from "@/components/TrendingCarousel";
import RowContainer from "@/components/RowContainer";
import { TrendingItem } from "@/lib/Trending";
import { TMDB_API_URL } from "@/utils/constants";

const getMovieLists = async () => {
  const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
    fetch(`${TMDB_API_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/movie/top_rated?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 3600 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/movie/now_playing?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/movie/upcoming?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 3600 } }).then((r) => r.json()),
  ]);
  return { popular, topRated, nowPlaying, upcoming };
};

const addMediaType = (results: any[], type: "movie" | "tv") =>
  results.map((r: any) => ({ ...r, media_type: type }));

export default async function MoviesPage() {
  const { popular, topRated, nowPlaying, upcoming } = await getMovieLists();

  return (
    <div className="min-h-screen mt-24">
      <div className="px-6 lg:px-8 mb-8">
        <h1 className="section-title text-4xl lg:text-5xl">Movies</h1>
      </div>
      <RowContainer title="Now Playing" type="movie">
        <TrendingCarousel trendingItems={addMediaType(nowPlaying.results, "movie") as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="Popular Movies" type="movie">
        <TrendingCarousel trendingItems={addMediaType(popular.results, "movie") as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="Top Rated" type="movie">
        <TrendingCarousel trendingItems={addMediaType(topRated.results, "movie") as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="Upcoming" type="movie">
        <TrendingCarousel trendingItems={addMediaType(upcoming.results, "movie") as TrendingItem[]} />
      </RowContainer>
    </div>
  );
}
