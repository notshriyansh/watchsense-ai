import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { WatchProgress } from "./watchTypes";
import { buildVerdictPrompt } from "./prompts";
import { generateGeminiText } from "../geminiClient";

export interface VerdictInsight {
  verdict: "CONTINUE" | "DROP";
  reason: string;
}

interface InsightsState {
  dropOffInsights: Record<number, VerdictInsight>;
}

const initialState: InsightsState = {
  dropOffInsights: {},
};

export const fetchDropOffInsight = createAsyncThunk<
  { movieId: number; insight: VerdictInsight },
  { item: WatchProgress; overview: string }
>("insights/dropoff", async ({ item, overview }) => {
  const prompt = buildVerdictPrompt(item, overview);

  const responseText = await generateGeminiText(prompt);

  const parsed: VerdictInsight = JSON.parse(responseText);

  return {
    movieId: item.movieId,
    insight: parsed,
  };
});

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDropOffInsight.fulfilled, (state, action) => {
      state.dropOffInsights[action.payload.movieId] = action.payload.insight;
    });
  },
});

export default insightsSlice.reducer;
