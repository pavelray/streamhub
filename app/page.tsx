import LandingHeader from "@/components/LandingHeader";
import { LandingSubHeader } from "@/components/LandingSubHeader";
import RowContainer from "@/components/RowContainer";
import TrendingCarousel from "@/components/TrendingCarousel";
import { TrendingMovie, TrendingPerson, TrendingResponse, TrendingTV } from "@/lib/Trending";
import { TIME_FRAME, TMDB_API_URL } from "@/utils/constants";
import { Play } from "lucide-react";


// Function to fetch all data concurrently with revalidation
const getAllData = async (): Promise<{
  movieList: TrendingResponse;
  tvList: TrendingResponse;
  peopleList: TrendingResponse;
}> => {
  const movieData = fetch(
    `${TMDB_API_URL}/trending/movie/${TIME_FRAME.WEEK}?api_key=${process.env.TMDB_API_KEY}`,
    {
      next: { revalidate: 60 },
    }
  );
  const tvData = fetch(
    `${TMDB_API_URL}/trending/tv/${TIME_FRAME.WEEK}?api_key=${process.env.TMDB_API_KEY}`,
    {
      next: { revalidate: 60 },
    }
  );
  const peopleData = fetch(
    `${TMDB_API_URL}/trending/person/${TIME_FRAME.WEEK}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 60 } }
  );
  const data = await Promise.all([movieData, tvData, peopleData]);
  const movieDataResp = await data[0].json();
  const tvDataResp = await data[1].json();
  const peopleDataResp = await data[2].json();
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
    <>
      <LandingHeader item={headerItem} />
      <LandingSubHeader />
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
    </>
  );
}
