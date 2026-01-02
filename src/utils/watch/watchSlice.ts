import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { WatchProgress } from "./watchTypes";

type WatchState = WatchProgress[];

const initialState: WatchState = [];

const watchSlice = createSlice({
  name: "watch",
  initialState,
  reducers: {
    upsertWatchProgress: (state, action: PayloadAction<WatchProgress>) => {
      const index = state.findIndex(
        (item) => item.movieId === action.payload.movieId
      );

      if (index >= 0) {
        state[index] = action.payload;
      } else {
        state.push(action.payload);
      }
    },

    removeFromWatch: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.movieId !== action.payload);
    },

    clearWatchHistory: () => {
      return [];
    },
  },
});

export const { upsertWatchProgress, removeFromWatch, clearWatchHistory } =
  watchSlice.actions;

export default watchSlice.reducer;
