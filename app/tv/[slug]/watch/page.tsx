"use client";
import { TMDB_API_URL } from "@/utils/constants";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface EpisodeInfo {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

interface SeasonInfo {
  season_number: number;
  name: string;
  episode_count: number;
  episodes: EpisodeInfo[];
}

const TVWatchPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (params?.slug ?? "") as string;
  const slugParts = slug.split("-");
  const tvId = slugParts[slugParts.length - 1];

  const [season, setSeason] = useState(Number(searchParams?.get("season") || 1));
  const [episode, setEpisode] = useState(Number(searchParams?.get("episode") || 1));
  const [seasonData, setSeasonData] = useState<SeasonInfo | null>(null);
  const [seriesName, setSeriesName] = useState("TV Series");

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        const [seriesRes, seasonRes] = await Promise.all([
          fetch(`/api/tv/${tvId}`),
          fetch(`/api/tv/${tvId}/season/${season}`),
        ]);
        if (seriesRes.ok) {
          const s = await seriesRes.json();
          setSeriesName(s.name || "TV Series");
        }
        if (seasonRes.ok) {
          const data = await seasonRes.json();
          setSeasonData(data);
        }
      } catch {
        // silent
      }
    };
    fetchSeason();
  }, [tvId, season]);

  const currentEpisode = seasonData?.episodes?.find(
    (e) => e.episode_number === episode
  );

  const handleEpisode = (ep: number) => {
    setEpisode(ep);
    router.replace(`/tv/${slug}/watch?season=${season}&episode=${ep}`, { scroll: false });
  };

  const handleSeason = (s: number) => {
    setSeason(s);
    setEpisode(1);
    router.replace(`/tv/${slug}/watch?season=${s}&episode=1`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10 flex-wrap">
        <Link
          href={`/tv/${slug}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </Link>
        <h1 className="text-white text-lg font-semibold">{seriesName}</h1>
        <span className="text-gray-400 text-sm">
          S{season} · E{episode}
          {currentEpisode?.name ? ` — ${currentEpisode.name}` : ""}
        </span>
      </div>

      <div className="flex flex-col xl:flex-row flex-1">
        {/* Player */}
        <div className="flex-1">
          <div className="w-full aspect-video bg-black">
            <iframe
              key={`${tvId}-s${season}-e${episode}`}
              src={`https://www.2embed.cc/embedtv/${tvId}&s=${season}&e=${episode}`}
              width="100%"
              height="100%"
              allowFullScreen
              allow="autoplay; fullscreen"
              className="w-full h-full"
              style={{ minHeight: "60vh" }}
              title={`${seriesName} S${season}E${episode}`}
            />
          </div>
          {/* Episode info */}
          {currentEpisode && (
            <div className="p-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-white mb-2">
                {currentEpisode.name}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">{currentEpisode.overview}</p>
            </div>
          )}
        </div>

        {/* Episode Sidebar */}
        <div className="xl:w-80 border-t xl:border-t-0 xl:border-l border-white/10 flex flex-col">
          {/* Season selector */}
          <div className="p-4 border-b border-white/10">
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block">Season</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => season > 1 && handleSeason(season - 1)}
                disabled={season <= 1}
                className="p-1 rounded bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center text-white font-semibold">Season {season}</span>
              <button
                onClick={() => handleSeason(season + 1)}
                className="p-1 rounded bg-white/10 hover:bg-white/20"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Episode list */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] xl:max-h-full">
            {seasonData?.episodes?.map((ep) => (
              <button
                key={ep.episode_number}
                onClick={() => handleEpisode(ep.episode_number)}
                className={`w-full text-left p-3 flex gap-3 border-b border-white/5 hover:bg-white/10 transition-colors ${
                  ep.episode_number === episode ? "bg-purple-500/20 border-l-2 border-l-purple-400" : ""
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-sm font-bold text-gray-300">
                  {ep.episode_number}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${ep.episode_number === episode ? "text-purple-300" : "text-white"}`}>
                    {ep.name}
                  </p>
                  {ep.runtime && (
                    <p className="text-xs text-gray-500">{ep.runtime} min</p>
                  )}
                </div>
              </button>
            ))}
            {!seasonData && (
              <div className="p-6 text-center text-gray-500 text-sm">Loading episodes...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVWatchPage;
