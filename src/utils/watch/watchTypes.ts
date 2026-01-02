export type WatchStatus = "watching" | "completed" | "dropped";

export interface WatchProgress {
  movieId: number;
  title: string;
  posterPath: string;
  progressPercent: number;
  lastWatchedAt: number;
  status: WatchStatus;
  note?: string;
}
