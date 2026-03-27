import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string;
  mediaType: "movie" | "tv";
  addedAt: number;
}

interface WatchlistStore {
  items: WatchlistItem[];
  add: (item: Omit<WatchlistItem, "addedAt">) => void;
  remove: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (!get().has(item.id)) {
          set((state) => ({
            items: [{ ...item, addedAt: Date.now() }, ...state.items],
          }));
        }
      },
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      has: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    {
      name: "streamhub-watchlist",
    }
  )
);
