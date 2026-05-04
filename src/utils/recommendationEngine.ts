import { cosineSimilarity } from "./embedding";
import { buildUserTasteVector, computeMovieEmbedding } from "./vectorStore";
import { getRecentRecommendationIds } from "./recommendationHistory";
import type { Movie } from "./types";
import type { WatchProgress } from "./watch/watchTypes";

const GENRES: Record<number, string> = {
  12: "adventure",
  14: "fantasy",
  16: "animation",
  18: "drama",
  27: "horror",
  28: "action",
  35: "comedy",
  53: "thriller",
  80: "crime",
  878: "science fiction",
  10749: "romance",
};

export type RankedMovie = Movie & {
  recommendationScore: number;
  matchFeatures: string[];
};

export const getMovieFeatures = (
  movie: Pick<Movie, "genre_ids" | "overview">,
) => {
  const genres = movie.genre_ids?.map((id) => GENRES[id]).filter(Boolean) || [];

  const keywords =
    movie.overview
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 5)
      .slice(0, 3) || [];

  return [...genres, ...keywords];
};

const computeQualityScore = (movie: Movie) =>
  (movie.vote_average / 10) * 0.3 + Math.min(movie.popularity / 1000, 1) * 0.2;

const computeExplorationScore = (movie: Movie) =>
  (1 - Math.min(movie.popularity / 1000, 1)) * 0.1;

export const getTopRecommendations = (
  movies: Movie[],
  watchHistory: WatchProgress[],
  limit: number,
): RankedMovie[] => {
  const userVector = buildUserTasteVector(watchHistory);
  const watchedIds = new Set(watchHistory.map((w) => w.movieId));
  const droppedIds = new Set(
    watchHistory.filter((w) => w.status === "dropped").map((w) => w.movieId),
  );

  const recentIds = new Set(getRecentRecommendationIds());

  const userKeywords = watchHistory.map((w) => w.title.toLowerCase()).join(" ");

  return movies
    .filter(
      (m) =>
        !watchedIds.has(m.id) && !droppedIds.has(m.id) && !recentIds.has(m.id),
    )
    .map((movie) => {
      const similarity = cosineSimilarity(
        userVector,
        computeMovieEmbedding(movie),
      );

      const quality = computeQualityScore(movie);
      const exploration = computeExplorationScore(movie);

      const rawFeatures = getMovieFeatures(movie);

      const matchFeatures = rawFeatures.filter((f) => userKeywords.includes(f));

      const score = similarity * 0.5 + quality + exploration;

      return {
        ...movie,
        recommendationScore: score,
        matchFeatures,
      };
    })
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};
