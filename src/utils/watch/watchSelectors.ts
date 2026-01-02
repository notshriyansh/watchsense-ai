import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../appStore";
import { DROPOFF_THRESHOLD_DAYS, MS_IN_DAY } from "../constants";

export const selectWatchState = (state: RootState) => state.watch;

export const selectContinueWatching = createSelector(
  [selectWatchState],
  (watch) => [...watch].sort((a, b) => b.lastWatchedAt - a.lastWatchedAt)
);

export const selectInProgressOnly = createSelector(
  [selectWatchState],
  (watch) =>
    watch.filter(
      (item) => item.progressPercent > 0 && item.progressPercent < 100
    )
);

export const selectDroppedItems = createSelector(
  [selectWatchState],
  (watch) => {
    const now = Date.now();

    return watch.filter((item) => {
      const daysSinceLastWatch = (now - item.lastWatchedAt) / MS_IN_DAY;

      return (
        item.progressPercent > 0 &&
        item.progressPercent < 100 &&
        daysSinceLastWatch >= DROPOFF_THRESHOLD_DAYS
      );
    });
  }
);
