import LandingHeader from "@/components/LandingHeader";
import { LandingSubHeader } from "@/components/LandingSubHeader";
import MoodSearch from "@/components/MoodSearch";
import RowContainer from "@/components/RowContainer";
import TrendingCarousel from "@/components/TrendingCarousel";
import { TrendingMovie, TrendingPerson, TrendingResponse, TrendingTV } from "@/lib/Trending";
import { TIME_FRAME, TMDB_API_URL } from "@/utils/constants";
import { Play } from "lucide-react";


async function fetchWithRetry(url: string, options: RequestInit & { next?: { revalidate?: number } }, retries = 3): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`TMDB responded ${res.status}`);
      return res;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw new Error("fetch failed after retries");
}

// Function to fetch all data concurrently with revalidation
const getAllData = async (): Promise<{
  movieList: TrendingResponse;
  tvList: TrendingResponse;
  peopleList: TrendingResponse;
}> => {
  const opts = { next: { revalidate: 60 } };
  const apiKey = process.env.TMDB_API_KEY;
  const [movieData, tvData, peopleData] = await Promise.all([
    fetchWithRetry(`${TMDB_API_URL}/trending/movie/${TIME_FRAME.WEEK}?api_key=${apiKey}`, opts),
    fetchWithRetry(`${TMDB_API_URL}/trending/tv/${TIME_FRAME.WEEK}?api_key=${apiKey}`, opts),
    fetchWithRetry(`${TMDB_API_URL}/trending/person/${TIME_FRAME.WEEK}?api_key=${apiKey}`, opts),
  ]);
  const [movieDataResp, tvDataResp, peopleDataResp] = await Promise.all([
    movieData.json(),
    tvData.json(),
    peopleData.json(),
  ]);
  return {
    movieList: movieDataResp as TrendingResponse,
    tvList: tvDataResp as TrendingResponse,
    peopleList: peopleDataResp as TrendingResponse,
  };
};

function getRandomHeaderItem(
  movieList: TrendingMovie[],
  tvList: TrendingTV[]
): TrendingMovie | TrendingTV | null {
  const combinedList = [...movieList, ...tvList];

  if (combinedList.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * combinedList.length);
  return combinedList[randomIndex];
}

export default async function Home() {
  const { movieList, tvList, peopleList } = await getAllData();
  console.log("Movie List:", movieList);
  console.log("TV List:", tvList);
  console.log("People List:", peopleList);
  const headerItem = getRandomHeaderItem(
    movieList.results as TrendingMovie[],
    tvList.results as TrendingTV[]
  );

  return (
    <div className="min-h-screen mt-24">
      <LandingHeader item={headerItem} />
      <LandingSubHeader />
      <MoodSearch />
      <RowContainer title="Trending Movies" type="movie">
        <TrendingCarousel
          trendingItems={movieList.results as TrendingMovie[]}
        />
      </RowContainer>
      <RowContainer title="Trending TV Shows" type="tv">
        <TrendingCarousel
          trendingItems={tvList.results as TrendingTV[]}
        />
      </RowContainer>
      <RowContainer title="Trending People" type="person">
        <TrendingCarousel
          trendingItems={peopleList.results as TrendingPerson[]}
        />
      </RowContainer>
    </div>
  );
}
