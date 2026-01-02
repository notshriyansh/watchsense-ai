import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_OPTIONS } from "../utils/constants";
import type { Movie, TMDBResponse } from "./types";

export const fetchNowPlayingMovies = createAsyncThunk(
  "movies/nowPlaying",
  async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing",
      API_OPTIONS
    );
    const data: TMDBResponse = await res.json();
    return data.results;
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  "movies/topRated",
  async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated",
      API_OPTIONS
    );
    const data: TMDBResponse = await res.json();
    return data.results;
  }
);

export const fetchPopularMovies = createAsyncThunk(
  "movies/popular",
  async () => {
    const res = await fetch(
      "https://api.themoviedb.org/3/movie/popular",
      API_OPTIONS
    );
    const data: TMDBResponse = await res.json();
    return data.results;
  }
);

export const fetchMovieTrailer = createAsyncThunk(
  "movies/trailer",
  async (movieId: number) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      API_OPTIONS
    );
    const data = await res.json();
    return data.results.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );
  }
);

export const fetchMovieTrailerById = createAsyncThunk(
  "movies/fetchTrailerById",
  async (movieId: number) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      API_OPTIONS
    );
    const data = await res.json();
    const trailer = data.results.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    return { movieId, key: trailer?.key };
  }
);

interface MovieState {
  nowPlaying: Movie[];
  topRated: Movie[];
  popular: Movie[];
  trailers: Record<number, string>;
  heroTrailer: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MovieState = {
  nowPlaying: [],
  topRated: [],
  popular: [],
  trailers: {},
  heroTrailer: null,
  status: "idle",
  error: null,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
        state.nowPlaying = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRated = action.payload;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popular = action.payload;
      })
      .addCase(fetchMovieTrailerById.fulfilled, (state, action) => {
        if (action.payload.key) {
          state.trailers[action.payload.movieId] = action.payload.key;
          if (!state.heroTrailer) {
            state.heroTrailer = action.payload.key;
          }
        }
      });
  },
});

export default movieSlice.reducer;
