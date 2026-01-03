import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../utils/types";

export interface WatchlistItem {
  movie: Movie;
  addedAt: number;
}

const STORAGE_KEY = "cinemind_mylist";

const loadMyList = (): WatchlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (item?.id && !item.movie) {
            return {
              movie: item,
              addedAt: Date.now(),
            };
          }

          if (item?.movie?.id && item.addedAt) {
            return item;
          }

          return null;
        })
        .filter(Boolean);
    }

    return [];
  } catch {
    return [];
  }
};

const saveMyList = (list: WatchlistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
};

const myListSlice = createSlice({
  name: "myList",
  initialState: loadMyList(),
  reducers: {
    addToMyList: (state, action: PayloadAction<Movie>) => {
      const exists = state.some((item) => item.movie.id === action.payload.id);

      if (!exists) {
        state.push({
          movie: action.payload,
          addedAt: Date.now(),
        });
        saveMyList(state);
      }
    },

    removeFromMyList: (state, action: PayloadAction<number>) => {
      const updated = state.filter((item) => item.movie.id !== action.payload);
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
