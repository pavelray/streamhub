import MediaPlayButton from "@/components/MediaPlayButton";
import TrailerButton from "@/components/TrailerButton";
import TrendingCarousel from "@/components/TrendingCarousel";
import VideoCard from "@/components/VideoCard";
import StreamingProviders from "@/components/StreamingProviders";
import WatchlistButton from "@/components/WatchlistButton";
import { TVDetails } from "@/lib/TVDetails";
import { TrendingItem } from "@/lib/Trending";
import { APP_NAME, SITE_URL, TMDB_API_URL } from "@/utils/constants";
import type { Metadata } from "next";
import { tvDataTransformer } from "@/utils/dataTransformer";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  Star,
  Tag,
  TrendingUp,
  User,
  Tv,
  List,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const append_to_response =
  "videos,aggregate_credits,recommendations,similar,watch/providers";

const getTVDetailsData = async (tvId: string): Promise<TVDetails | null> => {
  const apiKeyPresent = !!process.env.TMDB_API_KEY;
  const url = `${TMDB_API_URL}/tv/${tvId}?api_key=${process.env.TMDB_API_KEY}&append_to_response=${append_to_response}`;
  console.log(`[TV] Fetching tvId=${tvId} | TMDB_API_KEY present=${apiKeyPresent}`);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      console.log(`[TV] tvId=${tvId} attempt=${attempt + 1} status=${res.status}`);
      if (res.status === 404) {
        console.warn(`[TV] tvId=${tvId} not found on TMDB (404)`);
        return null;
      }
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[TV] tvId=${tvId} attempt=${attempt + 1} FAILED status=${res.status} body=${body.slice(0, 200)}`);
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
          continue;
        }
        return null;
      }
      const data = await res.json();
      console.log(`[TV] tvId=${tvId} fetched OK name="${data.name}"`);
      return tvDataTransformer(data);
    } catch (error) {
      console.error(`[TV] tvId=${tvId} attempt=${attempt + 1} exception:`, error);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const tvId = slugParts[slugParts.length - 1];
  const series = await getTVDetailsData(tvId);

  if (!series) {
    return { title: `TV Series | ${APP_NAME}` };
  }

  const releaseYear = series.firstAirDate
    ? new Date(series.firstAirDate).getFullYear()
    : "";
  const genreText = series.genres?.map((g: { name: string }) => g.name).join(", ") || "";
  const creatorName = series.crew?.find((c: { job: string; name: string }) => c.job === "Creator" || c.job === "Executive Producer")?.name || "";
  const ogImage = series.posterPath ?? `${SITE_URL}/images/og-image.png`;

  const title = `${series.name}${releaseYear ? ` (${releaseYear})` : ""}`;
  const description = `${series.name} is a ${genreText} TV series${creatorName ? ` created by ${creatorName}` : ""}. ${series.overview?.slice(0, 160) || ""}`;

  return {
    title,
    description,
    keywords: `${series.name}, ${releaseYear}, ${genreText}, ${creatorName}, tv series, trailers, streamhub`,
    openGraph: {
      title,
      description,
      type: "video.tv_show",
      url: `${SITE_URL}/tv/${slug}`,
      locale: "en_US",
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 780, height: 1170, alt: series.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const TVDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const tvId = slugParts[slugParts.length - 1];
  const series = await getTVDetailsData(tvId);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  if (!series) {
    notFound();
  }

  const runtime = series.episodeRunTime?.[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="movie-hero min-h-screen flex items-start lg:items-center"
        style={{
          backgroundImage: series.backdropPath
            ? `linear-gradient(to right,rgba(0,0,0,0.85),rgba(0,0,0,0.45),rgba(0,0,0,0.85)),url(${series.backdropPath})`
            : "none",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 lg:py-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
            {/* Poster */}
            <div className="md:w-1/3 fade-in-up">
              <div className="glass-effect rounded-2xl p-4">
                <Image
                  src={series.posterPath}
                  alt={`${series.name} Poster`}
                  width={600}
                  height={900}
                  className="w-full rounded-xl shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Details */}
            <div className="md:w-2/3 fade-in-up">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                {series.name}
              </h1>
              {series.tagline && (
                <h4 className="text-lg font-bold text-gray-300 mb-4 italic">
                  {series.tagline}
                </h4>
              )}
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                {series.overview}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 text-sm font-medium mb-8">
                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-bold">{formatDate(series.firstAirDate)}</span>
                  <span className="text-gray-400">—</span>
                  <span className="text-gray-300">
                    {series.inProduction ? "Present" : formatDate(series.lastAirDate || "")}
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="text-yellow-400 font-bold">{series.voteAverage.toFixed(1)}</span>
                  <span className="text-gray-300">Rating</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <Tv className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-bold">{series.numberOfSeasons}</span>
                  <span className="text-gray-300">Seasons</span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <List className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 font-bold">{series.numberOfEpisodes}</span>
                  <span className="text-gray-300">Episodes</span>
                </div>

                {runtime && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">{runtime} min</span>
                    <span className="text-gray-300">per ep</span>
                  </div>
                )}

                <div className="flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-lg border border-white/20">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 font-bold">{Math.floor(series.popularity)}</span>
                  <span className="text-gray-300">Popularity</span>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-8 flex flex-wrap gap-2">
                {series.genres.map((genre, index) => (
                  <Link
                    key={genre.id}
                    href={`/discover?type=tv&genre=${genre.id}`}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                      index === 0
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 text-purple-200"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-cyan-200"
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <MediaPlayButton media={{ id: series.id, name: series.name }} />
                {series.videos && series.videos.length > 0 && (
                  <TrailerButton videos={series.videos} />
                )}
                <WatchlistButton item={{ id: series.id, title: series.name, posterPath: series.posterPath, mediaType: "tv" }} />
              </div>

              {/* Streaming Providers */}
              {series.watchProviders && (
                <StreamingProviders providers={series.watchProviders} />
              )}

              {/* Cast Preview */}
              {series.cast && series.cast.length > 0 && (
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl w-full max-w-4xl mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-xl font-bold">Top Cast</h2>
                  </div>
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    {series.cast.slice(0, 6).map((member) => (
                      <div key={member.id} className="flex flex-col items-center w-16 sm:w-20">
                          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-purple-400 shadow-lg hover:border-purple-300 transition-all hover:scale-110">
                          {member.profilePath ? (
                            <img
                              src={member.profilePath}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center">
                              <User className="w-8 h-8 text-white/60" />
                            </div>
                          )}
                        </div>
                        <p className="text-white text-xs font-medium mt-2 text-center truncate w-full" title={member.name}>
                          {member.name}
                        </p>
                        <p className="text-gray-400 text-xs text-center truncate w-full" title={member.character}>
                          {member.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seasons */}
      {series.seasons.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-10">Seasons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {series.seasons.map((season) => (
                <Link
                  key={season.id}
                  href={`/tv/${slug}/watch?season=${season.seasonNumber}&episode=1`}
                  className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 group"
                >
                  {season.posterPath ? (
                    <img
                      src={season.posterPath}
                      alt={season.name}
                      className="w-full aspect-[2/3] object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Tv className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-white text-sm font-bold truncate">{season.name}</p>
                    <p className="text-gray-400 text-xs">{season.episodeCount} episodes</p>
                    {season.voteAverage > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                        <span className="text-yellow-400 text-xs">{season.voteAverage.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {series.videos && series.videos.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-12">Videos & Trailers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.videos.map((video) => (
                <VideoCard key={video.key} video={video} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {series.recommendations && series.recommendations.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-6">Recommended For You</h2>
            <TrendingCarousel trendingItems={series.recommendations as TrendingItem[]} />
          </div>
        </section>
      )}

      {/* Similar */}
      {series.similar && series.similar.length > 0 && (
        <section className="py-16 px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-6">More Like This</h2>
            <TrendingCarousel trendingItems={series.similar as TrendingItem[]} />
          </div>
        </section>
      )}
    </div>
  );
};

export default TVDetailsPage;
