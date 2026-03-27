import { TMDB_API_URL } from "@/utils/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const getMovieTitle = async (movieId: string): Promise<string> => {
  try {
    const res = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&fields=title`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return "Movie";
    const data = await res.json();
    return data.title || "Movie";
  } catch {
    return "Movie";
  }
};

const MovieWatchPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const movieId = slugParts[slugParts.length - 1];
  const title = await getMovieTitle(movieId);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 py-4 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <Link
          href={`/movie/${slug}`}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back to {title}</span>
        </Link>
        <h1 className="text-white text-lg font-semibold ml-4">{title}</h1>
      </div>

      {/* Player */}
      <div className="flex-1 relative bg-black">
        <div className="w-full aspect-video max-h-[calc(100vh-80px)]">
          <iframe
            src={`https://www.2embed.cc/embed/${movieId}`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; fullscreen"
            className="w-full h-full"
            style={{ minHeight: "60vh" }}
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieWatchPage;
