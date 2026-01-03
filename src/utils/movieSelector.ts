import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./appStore";
import { STALE_WATCHLIST_DAYS } from "./constants";

export const selectMovies = (state: RootState) => state.movies;
export const selectWatch = (state: RootState) => state.watch;
export const selectMyList = (state: RootState) => state.myList;

export const selectNowPlaying = createSelector(
  [selectMovies],
  (movies) => movies.nowPlaying
);

export const selectTopRated = createSelector(
  [selectMovies],
  (movies) => movies.topRated
);

export const selectIsInMyList =
  (movieId: number) =>
  (state: RootState): boolean =>
    state.myList.some((item) => item?.movie && item.movie.id === movieId);

export const selectStaleWatchlist = createSelector(
  [selectMyList, selectWatch],
  (myList, watchHistory) => {
    const now = Date.now();

    return myList.filter((item) => {
      if (!item?.movie) return false;

      const daysSinceAdded = (now - item.addedAt) / (1000 * 60 * 60 * 24);

      const hasProgress = watchHistory.some(
        (w) => w.movieId === item.movie.id && w.progressPercent > 0
      );

      return daysSinceAdded >= STALE_WATCHLIST_DAYS && !hasProgress;
    });
  }
);
