import TrendingCarousel from "@/components/TrendingCarousel";
import RowContainer from "@/components/RowContainer";
import { TrendingItem } from "@/lib/Trending";
import { TMDB_API_URL } from "@/utils/constants";

const getTVLists = async () => {
  const [popular, topRated, airingToday, onTheAir] = await Promise.all([
    fetch(`${TMDB_API_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/tv/top_rated?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 3600 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/tv/airing_today?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
    fetch(`${TMDB_API_URL}/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}`, { next: { revalidate: 1800 } }).then((r) => r.json()),
  ]);
  return { popular, topRated, airingToday, onTheAir };
};

const addMediaType = (results: any[]) =>
  results.map((r: any) => ({ ...r, media_type: "tv" }));

export default async function TVPage() {
  const { popular, topRated, airingToday, onTheAir } = await getTVLists();

  return (
    <div className="min-h-screen mt-24">
      <div className="px-6 lg:px-8 mb-8">
        <h1 className="section-title text-4xl lg:text-5xl">TV Shows</h1>
      </div>
      <RowContainer title="Airing Today" type="tv">
        <TrendingCarousel trendingItems={addMediaType(airingToday.results) as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="Popular TV Shows" type="tv">
        <TrendingCarousel trendingItems={addMediaType(popular.results) as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="Top Rated" type="tv">
        <TrendingCarousel trendingItems={addMediaType(topRated.results) as TrendingItem[]} />
      </RowContainer>
      <RowContainer title="On The Air" type="tv">
        <TrendingCarousel trendingItems={addMediaType(onTheAir.results) as TrendingItem[]} />
      </RowContainer>
    </div>
  );
}
