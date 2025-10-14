"use client";
import { TrendingItem } from "@/lib/Trending";
import { BASE_IMAGE_URL } from "@/utils/constants";
import {
  Bookmark,
  Calendar,
  Film,
  Play,
  Share,
  Star,
  TrendingUp,
  Tv,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MediaCard = ({
  item,
  index,
  currentIndex,
  cardsPerView,
  isDragging,
  dragOffset,
}: {
  item: TrendingItem;
  index: number;
  currentIndex: number;
  cardsPerView: number;
  isDragging: boolean;
  dragOffset: number;
}) => {
  const router = useRouter();

  const isVisible =
    index >= currentIndex && index < currentIndex + cardsPerView;
  const cardOffset = isDragging ? -dragOffset : 0;

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const getTitle = (item: TrendingItem) => {
    if (item.media_type === "movie" || !item.media_type) return item.title;
    if (item.media_type === "tv") return item.name;
    return item.name || "Untitled";
  };

  const getDate = (item: TrendingItem) => {
    if (item.media_type === "movie" || !item.media_type) return item.release_date;
    if (item.media_type === "tv") return item.first_air_date;
    return "";
  };

  const getImageUrl = (item: TrendingItem) => {
    if (item.media_type === "person") return item.profile_path;
    return item.poster_path;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleCardClick = (id: number) => {
    let basePath = "/movie"; // Default to movies
    if (item.media_type === "tv") {
      basePath = "/tv";
    } else if (item.media_type === "person") {
      basePath = `/person`;
    }
    router.push(`${basePath}/${id}`);
  };

  const renderMediaTypeIcon = (mediaType: "movie" | "tv" | "person") => {
    const mediaTypeIconMapper = {
      movie: <Film className="w-2.5 h-2.5 text-white" />,
      tv: <Tv className="w-2.5 h-2.5 text-white" />,
      person: <User className="w-2.5 h-2.5 text-white" />,
    };
    return mediaTypeIconMapper[mediaType] || "";
  };

  return (
    <div
      className={`flex-shrink-0 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-70 scale-95"
      }`}
      style={{
        width: `${100 / cardsPerView}%`,
        transform: `translateX(${cardOffset}px)`,
      }}
      onMouseEnter={() => setHoveredCard(item.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="mx-1.5">
        <div
          onClick={() => handleCardClick(item.id)}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          <div className="aspect-[3/4] relative overflow-hidden rounded-t-2xl">
            <img
              src={`${BASE_IMAGE_URL}/w400/${
                getImageUrl(item) || "/api/placeholder/200/267"
              }`}
              alt={getTitle(item)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating Elements - Smaller for compact design */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
              <div className="bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
                {renderMediaTypeIcon(item.media_type)}
                <span className="text-white text-xs font-medium capitalize">
                  {item.media_type}
                </span>
              </div>

              {item.media_type !== "person" && "vote_average" in item && (
                <div className="bg-yellow-500/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-black fill-current" />
                  <span className="text-black text-xs font-bold">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Center Play Button */}
            {item.media_type !== "person" && hoveredCard === item.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 hover:bg-white/30 transition-all duration-200">
                  <Play
                    className="w-6 h-6 text-white fill-current ml-0.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Play clicked:", item.id);
                      handleCardClick(item.id);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">
              {getTitle(item)}
            </h3>
            {getDate(item) && (
              <div className="flex items-center gap-1 mb-2">
                <Calendar className="w-3 h-3 text-white/60" />
                <span className="text-white/80 text-xs">
                  {formatDate(getDate(item))}
                </span>
              </div>
            )}
            <p className="text-white/70 text-xs line-clamp-2 mb-2">
              {item.media_type === "person"
                ? `Known for ${item.known_for_department}`
                : "overview" in item
                ? item.overview
                : ""}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-purple-300">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {Math.floor(item.popularity)}
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className="w-3 h-3 text-white" />
                </button>
                <button
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
