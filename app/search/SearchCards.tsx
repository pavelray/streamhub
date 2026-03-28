"use client";
import NSFWOverlay from "@/components/NSFWOverlay";
import { BASE_IMAGE_URL } from "@/utils/constants";
import { Film, Star, Tv, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";

export interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  profile_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  known_for_department?: string;
  known_for?: { title?: string; name?: string }[];
  adult?: boolean;
}

export function SearchCard({ item }: { item: SearchResult }) {
  const title = item.title || item.name || "Untitled";
  const slug = `${slugify(title, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  const href = item.media_type === "tv" ? `/tv/${slug}` : `/movie/${slug}`;
  const imageUrl = item.poster_path
    ? `${BASE_IMAGE_URL}/w300${item.poster_path}`
    : null;
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);

  return (
    <Link href={href} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300">
        <div className="relative aspect-[2/3] bg-white/5">
          <NSFWOverlay isAdult={item.adult}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {item.media_type === "tv" ? (
                  <Tv className="w-10 h-10 text-white/20" />
                ) : (
                  <Film className="w-10 h-10 text-white/20" />
                )}
              </div>
            )}
          </NSFWOverlay>
          {item.vote_average && item.vote_average > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-yellow-400 text-xs font-bold">
                {item.vote_average.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300 transition-colors">
            {title}
          </p>
          {year && <p className="text-gray-400 text-xs mt-1">{year}</p>}
        </div>
      </div>
    </Link>
  );
}

export function PersonCard({ item }: { item: SearchResult }) {
  const name = item.name || "Unknown";
  const slug = `${slugify(name, { remove: /[*+~.()'"!:@]/g })}-${item.id}`;
  const imageUrl = item.profile_path
    ? `${BASE_IMAGE_URL}/w185${item.profile_path}`
    : null;

  return (
    <Link href={`/person/${slug}`} className="group block">
      <div className="glass-card rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 p-4 text-center">
        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-purple-400 mb-3">
          <NSFWOverlay isAdult={item.adult}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500/40 to-blue-500/40 flex items-center justify-center">
                <User className="w-8 h-8 text-white/50" />
              </div>
            )}
          </NSFWOverlay>
        </div>
        <p className="text-white text-sm font-semibold truncate group-hover:text-cyan-300">
          {name}
        </p>
        {item.known_for_department && (
          <p className="text-gray-400 text-xs mt-1">{item.known_for_department}</p>
        )}
        {item.known_for && item.known_for.length > 0 && (
          <p className="text-gray-500 text-xs mt-1 truncate">
            {item.known_for
              .slice(0, 2)
              .map((k) => k.title || k.name)
              .join(", ")}
          </p>
        )}
      </div>
    </Link>
  );
}
