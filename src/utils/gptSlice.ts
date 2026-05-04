import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateGeminiResponse } from "./geminiClient";
import { searchTMDBMovie } from "./tmdbClient";
import { getCachedValue, setCachedValue } from "./cache";
import type { Movie } from "./types";

export const fetchGPTMovies = createAsyncThunk<
  Movie[],
  string,
  { rejectValue: string }
>("gpt/fetchMovies", async (query, { rejectWithValue }) => {
  try {
    const cacheKey = `gpt:${query.trim().toLowerCase()}`;
    const cached = getCachedValue<Movie[]>(cacheKey);

    if (cached) return cached;

    const movieNames = await generateGeminiResponse(query);

    const tmdbPromises = movieNames.map((name: string) =>
      searchTMDBMovie(name)
    );

    const tmdbResults = await Promise.all(tmdbPromises);

    const movies: Movie[] = tmdbResults.flat();
    setCachedValue(cacheKey, movies);

    return movies;
  } catch {
    return rejectWithValue("Failed to fetch GPT movies");
  }
});

interface GPTState {
  results: Movie[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: GPTState = {
  results: [],
  status: "idle",
  error: null,
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    clearGPTMovies: (state) => {
      state.results = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGPTMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGPTMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(fetchGPTMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearGPTMovies } = gptSlice.actions;
export default gptSlice.reducer;
