import { API_OPTIONS } from "./constants";

export const searchTMDBMovie = async (query: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=1`,
    API_OPTIONS
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.results || [];
};

export const searchTMDBTV = async (query: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
      query
    )}&language=en-US&page=1`,
    API_OPTIONS
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.results || [];
};

export const fetchWatchProviders = async (movieId: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    API_OPTIONS
  );

  if (!res.ok) return [];

  const data = await res.json();

  return data.results?.IN?.flatrate || data.results?.US?.flatrate || [];
};
