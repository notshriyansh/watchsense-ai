import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./appStore";

export const selectMovies = (state: RootState) => state.movies;

export const selectNowPlaying = createSelector(
  [selectMovies],
  (movies) => movies.nowPlaying
);

export const selectTopRated = createSelector(
  [selectMovies],
  (movies) => movies.topRated
);
