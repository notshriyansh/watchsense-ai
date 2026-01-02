import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateGeminiResponse } from "./geminiClient";
import { searchTMDBMovie } from "./tmdbClient";
import type { Movie } from "./types";

export const fetchGPTMovies = createAsyncThunk<
  Movie[],
  string,
  { rejectValue: string }
>("gpt/fetchMovies", async (query, { rejectWithValue }) => {
  try {
    const movieNames = await generateGeminiResponse(query);

    const tmdbPromises = movieNames.map((name: string) =>
      searchTMDBMovie(name)
    );

    const tmdbResults = await Promise.all(tmdbPromises);

    const movies: Movie[] = tmdbResults.flat();

    return movies;
  } catch (err) {
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
  reducers: {},
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

export default gptSlice.reducer;
