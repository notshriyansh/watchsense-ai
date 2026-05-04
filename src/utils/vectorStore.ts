import { embedText } from "./embedding";
import type { Movie } from "./types";
import type { WatchProgress } from "./watch/watchTypes";

const MOVIE_VECTOR_KEY = "cinemind_movie_vectors";

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

const readStore = (): Record<number, number[]> => {
  try {
    return JSON.parse(localStorage.getItem(MOVIE_VECTOR_KEY) || "{}");
  } catch {
    return {};
  }
};

export const saveMovieEmbedding = (movieId: number, vector: number[]) => {
  const store = readStore();
  store[movieId] = vector;
  localStorage.setItem(MOVIE_VECTOR_KEY, JSON.stringify(store));
};

export const getMovieEmbedding = (movieId: number) => readStore()[movieId];

export const computeMovieEmbedding = (movie: Movie) => {
  const cached = getMovieEmbedding(movie.id);
  if (cached) return cached;

  const genreText =
    movie.genre_ids?.map((id) => GENRES[id] || "").join(" ") || "";

  const text = [
    movie.title,
    movie.original_title,
    movie.overview,
    genreText,
    movie.original_language,
    `rating ${Math.round(movie.vote_average)}`,
  ].join(" ");

  const vector = embedText(text);
  saveMovieEmbedding(movie.id, vector);
  return vector;
};

export const buildUserTasteVector = (watchHistory: WatchProgress[]) => {
  const vector = Array(48).fill(0);
  let totalWeight = 0;

  watchHistory.forEach((item) => {
    const baseText = [
      item.title,
      item.note,
      item.status,
      item.progressPercent > 70 ? "liked" : "partial",
    ]
      .filter(Boolean)
      .join(" ");

    const itemVector = embedText(baseText);

    const progressWeight = Math.max(item.progressPercent, 10) / 100;

    const statusWeight =
      item.status === "completed" ? 2 : item.status === "dropped" ? 0.2 : 0.8;

    const daysSinceWatched =
      (Date.now() - item.lastWatchedAt) / (1000 * 60 * 60 * 24);
    const timeWeight = 1 / (daysSinceWatched + 1);

    const weight = progressWeight * statusWeight * timeWeight;

    itemVector.forEach((value, index) => {
      vector[index] += value * weight;
    });

    totalWeight += Math.abs(weight);
  });

  return totalWeight ? vector.map((value) => value / totalWeight) : vector;
};
