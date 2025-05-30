import { create } from "zustand";
import { persist } from "zustand/middleware";

const storage = typeof window !== "undefined" ? window.localStorage : undefined; // Fallback for SSR or non-browser environments

export const useSearchQueryStore = create(
  persist(
    (set) => ({
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "search-query",
      storage,
    }
  )
);
