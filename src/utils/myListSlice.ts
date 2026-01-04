import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BaseMovie } from "./types";

export interface WatchlistItem {
  movie: BaseMovie;
  addedAt: number;
  contentType: "movie" | "tv";
}

const STORAGE_KEY = "cinemind_mylist";

const loadMyList = (): WatchlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is WatchlistItem =>
        item &&
        item.movie &&
        typeof item.movie.id === "number" &&
        typeof item.addedAt === "number" &&
        (item.contentType === "movie" || item.contentType === "tv")
    );
  } catch {
    return [];
  }
};

const saveMyList = (list: WatchlistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

type AddPayload = {
  movie: BaseMovie;
  contentType: "movie" | "tv";
};

const myListSlice = createSlice({
  name: "myList",
  initialState: loadMyList(),
  reducers: {
    addToMyList: (state, action: PayloadAction<AddPayload>) => {
      const { movie, contentType } = action.payload;

      if (!movie || typeof movie.id !== "number") return;

      const exists = state.some((item) => item.movie?.id === movie.id);

      if (!exists) {
        state.push({
          movie,
          contentType,
          addedAt: Date.now(),
        });
        saveMyList(state);
      }
    },

    removeFromMyList: (state, action: PayloadAction<number>) => {
      const updated = state.filter((item) => item.movie?.id !== action.payload);
      saveMyList(updated);
      return updated;
    },

    clearMyList: () => {
      saveMyList([]);
      return [];
    },
  },
});

export const { addToMyList, removeFromMyList, clearMyList } =
  myListSlice.actions;

export default myListSlice.reducer;
