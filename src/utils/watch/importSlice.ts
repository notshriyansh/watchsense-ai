import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { generateGeminiText } from "../geminiClient";
import { buildImportTitlesPrompt } from "./importPrompts";
import { searchTMDBMovie } from "../tmdbClient";
import { upsertWatchProgress } from "./watchSlice";

export const importFromText = createAsyncThunk<number, string>(
  "import/fromText",
  async (rawText, { dispatch }) => {
    const prompt = buildImportTitlesPrompt(rawText);
    const response = await generateGeminiText(prompt);

    const titles: string[] = JSON.parse(response);

    let imported = 0;

    for (const title of titles) {
      const results = await searchTMDBMovie(title);
      const movie = results[0];
      if (!movie) continue;

      dispatch(
        upsertWatchProgress({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
          progressPercent: 100,
          lastWatchedAt: Date.now(),
          status: "completed",
        })
      );

      imported++;
    }

    return imported;
  }
);

interface ImportState {
  status: "idle" | "loading" | "done" | "failed";
  count: number;
}

const initialState: ImportState = {
  status: "idle",
  count: 0,
};

const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(importFromText.pending, (state) => {
        state.status = "loading";
        state.count = 0;
      })
      .addCase(importFromText.fulfilled, (state, action) => {
        state.status = "done";
        state.count = action.payload;
      })
      .addCase(importFromText.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default importSlice.reducer;
