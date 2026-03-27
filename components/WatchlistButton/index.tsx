"use client";
import { useWatchlistStore, WatchlistItem } from "@/utils/watchlistStore";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface Props {
  item: Omit<WatchlistItem, "addedAt">;
}

export default function WatchlistButton({ item }: Props) {
  const { add, remove, has } = useWatchlistStore();
  const saved = has(item.id);

  const toggle = () => {
    if (saved) {
      remove(item.id);
    } else {
      add(item);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`group flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 border ${
        saved
          ? "bg-white/20 border-white/40 text-white"
          : "bg-white/10 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white"
      }`}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
    >
      {saved ? (
        <BookmarkCheck className="w-5 h-5 text-cyan-400" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
      <span className="text-sm">{saved ? "Saved" : "Watchlist"}</span>
    </button>
  );
}
